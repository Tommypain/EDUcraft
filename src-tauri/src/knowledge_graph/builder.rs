//! Builder for constructing a KnowledgeGraph from an ExportBook and optional KnowledgeAssetManifest.

use super::types::{EdgeKind, GraphEdge, GraphNode, GraphNodeKind, KnowledgeGraph};
use crate::contracts::KnowledgeAssetManifest;
use crate::export_engine::types::ExportBook;

/// Convert a string to a normalized lowercase slug.
pub fn slugify(text: &str) -> String {
    text.to_lowercase()
        .chars()
        .map(|c| if c.is_alphanumeric() { c } else { '_' })
        .collect::<String>()
        .split('_')
        .filter(|s| !s.is_empty())
        .collect::<Vec<_>>()
        .join("_")
}

/// Helper to ensure a Concept node exists in the graph and return its node ID.
pub fn ensure_concept_node(graph: &mut KnowledgeGraph, concept_text: &str) -> String {
    let clean = concept_text.trim();
    if clean.is_empty() {
        return String::new();
    }
    let slug = slugify(clean);
    let concept_id = format!("concept_{}", slug);
    if !graph.has_node(&concept_id) {
        graph.add_node(GraphNode::new(
            concept_id.clone(),
            GraphNodeKind::Concept,
            clean,
        ));
    }
    concept_id
}

/// Ingest an `ExportBook` and optional `KnowledgeAssetManifest` into a `KnowledgeGraph`.
pub fn build_graph_from_book(
    book: &ExportBook,
    manifest: Option<&KnowledgeAssetManifest>,
) -> KnowledgeGraph {
    let mut graph = KnowledgeGraph::new();

    // 1. Book node
    let book_label = if !book.en.title.trim().is_empty() {
        book.en.title.clone()
    } else if !book.ar.title.trim().is_empty() {
        book.ar.title.clone()
    } else {
        book.id.clone()
    };
    graph.add_node(GraphNode::new(book.id.clone(), GraphNodeKind::Book, book_label));

    // 2. Add structural nodes (Branch, SubBranch, Leaf)
    for node in &book.nodes {
        let kind = match node.level.as_str() {
            "branch" => GraphNodeKind::Branch,
            "sub" => GraphNodeKind::SubBranch,
            _ => GraphNodeKind::Leaf,
        };
        let label = node
            .en
            .as_deref()
            .or(node.ar.as_deref())
            .unwrap_or(&node.id)
            .to_string();

        let mut graph_node = GraphNode::new(node.id.clone(), kind, label);
        if let Some(parent) = &node.parent {
            graph_node = graph_node.with_attribute("parent", parent.clone());
        }
        graph.add_node(graph_node);

        // Edge from parent
        if let Some(parent) = &node.parent {
            if !parent.is_empty() {
                graph.add_edge(GraphEdge::new(
                    parent.clone(),
                    node.id.clone(),
                    EdgeKind::Contains,
                ));
            }
        } else if node.level == "branch" {
            // Top-level branch directly contained in Book
            graph.add_edge(GraphEdge::new(
                book.id.clone(),
                node.id.clone(),
                EdgeKind::Contains,
            ));
        }

        // 3. Extract pageBlocks
        if let Some(blocks) = node.extra.get("pageBlocks").and_then(|v| v.as_array()) {
            for (idx, block) in blocks.iter().enumerate() {
                let block_id = block
                    .get("id")
                    .and_then(|v| v.as_str())
                    .map(|s| s.to_string())
                    .unwrap_or_else(|| format!("{}_block_{}", node.id, idx));

                let block_kind = block
                    .get("kind")
                    .and_then(|v| v.as_str())
                    .unwrap_or("block");
                let block_label = block
                    .get("title")
                    .and_then(|v| v.as_str())
                    .unwrap_or(block_kind);

                let mut block_node =
                    GraphNode::new(block_id.clone(), GraphNodeKind::ContentBlock, block_label);
                if let Some(text) = block.get("text").and_then(|v| v.as_str()) {
                    block_node = block_node.with_attribute(
                        "text_snippet",
                        text.chars().take(120).collect::<String>(),
                    );
                }
                graph.add_node(block_node);

                // Leaf -> Block Contains
                graph.add_edge(GraphEdge::new(
                    node.id.clone(),
                    block_id.clone(),
                    EdgeKind::Contains,
                ));

                // Check Asset references in Block
                let asset_ref = block
                    .get("asset_id")
                    .or_else(|| block.get("assetId"))
                    .or_else(|| block.get("image_id"))
                    .or_else(|| block.get("src"))
                    .or_else(|| block.get("url"))
                    .and_then(|v| v.as_str());

                if let Some(aid) = asset_ref {
                    if !aid.is_empty() {
                        graph.add_edge(GraphEdge::new(
                            aid.to_string(),
                            block_id.clone(),
                            EdgeKind::Illustrates,
                        ));
                    }
                }

                // Check Concept references in Block
                if let Some(concepts) = block.get("concepts").and_then(|v| v.as_array()) {
                    for c in concepts {
                        if let Some(s) = c.as_str() {
                            let cid = ensure_concept_node(&mut graph, s);
                            if !cid.is_empty() {
                                graph.add_edge(GraphEdge::new(
                                    block_id.clone(),
                                    cid,
                                    EdgeKind::CoversConcept,
                                ));
                            }
                        }
                    }
                } else if let Some(concept) = block.get("concept").and_then(|v| v.as_str()) {
                    let cid = ensure_concept_node(&mut graph, concept);
                    if !cid.is_empty() {
                        graph.add_edge(GraphEdge::new(
                            block_id.clone(),
                            cid,
                            EdgeKind::CoversConcept,
                        ));
                    }
                } else if let Some(topic) = block.get("topic").and_then(|v| v.as_str()) {
                    let cid = ensure_concept_node(&mut graph, topic);
                    if !cid.is_empty() {
                        graph.add_edge(GraphEdge::new(
                            block_id.clone(),
                            cid,
                            EdgeKind::CoversConcept,
                        ));
                    }
                }
            }
        }

        // 4. Extract questions
        if let Some(questions) = node.extra.get("questions").and_then(|v| v.as_array()) {
            for (idx, q) in questions.iter().enumerate() {
                let q_id = q
                    .get("id")
                    .and_then(|v| v.as_str())
                    .map(|s| s.to_string())
                    .unwrap_or_else(|| format!("{}_q_{}", node.id, idx));

                let q_type = q.get("type").and_then(|v| v.as_str()).unwrap_or("question");
                let q_label = format!("{} Question", q_type);

                let mut q_node = GraphNode::new(q_id.clone(), GraphNodeKind::Question, q_label);
                q_node = q_node.with_attribute("type", q_type);
                if let Some(diff) = q.get("difficulty").and_then(|v| v.as_str()) {
                    q_node = q_node.with_attribute("difficulty", diff);
                }
                graph.add_node(q_node);

                // Leaf contains question & Question tests leaf
                graph.add_edge(GraphEdge::new(
                    node.id.clone(),
                    q_id.clone(),
                    EdgeKind::Contains,
                ));
                graph.add_edge(GraphEdge::new(
                    q_id.clone(),
                    node.id.clone(),
                    EdgeKind::Tests,
                ));

                // Check Asset references in Question
                let q_asset_ref = q
                    .get("asset_id")
                    .or_else(|| q.get("assetId"))
                    .or_else(|| q.get("image"))
                    .or_else(|| q.get("image_id"))
                    .and_then(|v| v.as_str());
                if let Some(aid) = q_asset_ref {
                    if !aid.is_empty() {
                        graph.add_edge(GraphEdge::new(
                            aid.to_string(),
                            q_id.clone(),
                            EdgeKind::Illustrates,
                        ));
                    }
                }

                // Check Concepts / Subject in Question
                if let Some(subject) = q.get("subject").and_then(|v| v.as_str()) {
                    let cid = ensure_concept_node(&mut graph, subject);
                    if !cid.is_empty() {
                        graph.add_edge(GraphEdge::new(q_id.clone(), cid, EdgeKind::Tests));
                    }
                }
                if let Some(concept) = q.get("concept").and_then(|v| v.as_str()) {
                    let cid = ensure_concept_node(&mut graph, concept);
                    if !cid.is_empty() {
                        graph.add_edge(GraphEdge::new(q_id.clone(), cid, EdgeKind::Tests));
                    }
                }
                if let Some(concepts) = q.get("concepts").and_then(|v| v.as_array()) {
                    for c in concepts {
                        if let Some(s) = c.as_str() {
                            let cid = ensure_concept_node(&mut graph, s);
                            if !cid.is_empty() {
                                graph.add_edge(GraphEdge::new(q_id.clone(), cid, EdgeKind::Tests));
                            }
                        }
                    }
                }
            }
        }
    }

    // 5. Ingest Knowledge Asset Manifest
    if let Some(manifest) = manifest {
        for asset in manifest.assets.values() {
            let asset_node = GraphNode::new(
                asset.id.clone(),
                GraphNodeKind::Asset,
                asset.original_filename.clone(),
            )
            .with_attribute("asset_type", format!("{:?}", asset.asset_type))
            .with_attribute("role", format!("{:?}", asset.role))
            .with_attribute("mime_type", asset.mime_type.clone());

            if let Some(intel) = &asset.intelligence {
                for c in &intel.concepts {
                    let cid = ensure_concept_node(&mut graph, c);
                    if !cid.is_empty() {
                        graph.add_edge(GraphEdge::new(
                            asset.id.clone(),
                            cid,
                            EdgeKind::CoversConcept,
                        ));
                    }
                }
                for t in &intel.topics {
                    let cid = ensure_concept_node(&mut graph, t);
                    if !cid.is_empty() {
                        graph.add_edge(GraphEdge::new(
                            asset.id.clone(),
                            cid,
                            EdgeKind::CoversConcept,
                        ));
                    }
                }
            }
            graph.add_node(asset_node);
        }
    }

    // 6. Cross-Links -> PrerequisiteOf Edges
    for link in &book.cross_links {
        let pair = if let Some(arr) = link.as_array() {
            if arr.len() >= 2 {
                let from = arr[0].as_str();
                let to = arr[1].as_str();
                from.zip(to)
            } else {
                None
            }
        } else if let Some(obj) = link.as_object() {
            let from = obj
                .get("from")
                .or_else(|| obj.get("source"))
                .and_then(|v| v.as_str());
            let to = obj
                .get("to")
                .or_else(|| obj.get("target"))
                .and_then(|v| v.as_str());
            from.zip(to)
        } else {
            None
        };

        if let Some((from, to)) = pair {
            if !from.trim().is_empty() && !to.trim().is_empty() {
                graph.add_edge(GraphEdge::new(
                    from.to_string(),
                    to.to_string(),
                    EdgeKind::PrerequisiteOf,
                ));
            }
        }
    }

    graph
}
