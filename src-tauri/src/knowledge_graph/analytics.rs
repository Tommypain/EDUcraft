//! Analytical algorithms and traversals for the KnowledgeGraph.
//!
//! Includes prerequisite discovery, multimodal concept tracing,
//! and study performance propagation for dynamic mastery calculation.

use super::builder::slugify;
use super::types::{ConceptTrace, EdgeKind, GraphEdge, GraphNode, GraphNodeKind, KnowledgeGraph, StudyAttempt};
use std::collections::{HashMap, HashSet, VecDeque};

impl KnowledgeGraph {
    /// Retrieve direct prerequisites for a given node (edges pointing to this node with PrerequisiteOf).
    pub fn get_direct_prerequisites(&self, node_id: &str) -> Vec<String> {
        let mut prereqs = Vec::new();
        for edge in self.get_incoming_edges(node_id) {
            if edge.kind == EdgeKind::PrerequisiteOf {
                prereqs.push(edge.source.clone());
            }
        }
        prereqs
    }

    /// Retrieve all transitive prerequisites for a given node via breadth-first search.
    pub fn get_prerequisites(&self, node_id: &str) -> Vec<String> {
        let mut result = Vec::new();
        let mut visited = HashSet::new();
        let mut queue = VecDeque::new();

        visited.insert(node_id.to_string());
        for prereq in self.get_direct_prerequisites(node_id) {
            if visited.insert(prereq.clone()) {
                queue.push_back(prereq);
            }
        }

        while let Some(current) = queue.pop_front() {
            result.push(current.clone());
            for prereq in self.get_direct_prerequisites(&current) {
                if visited.insert(prereq.clone()) {
                    queue.push_back(prereq);
                }
            }
        }

        result
    }

    /// Retrieve dependent nodes that require this node as a prerequisite.
    pub fn get_dependents(&self, node_id: &str) -> Vec<String> {
        let mut dependents = Vec::new();
        for edge in self.get_outgoing_edges(node_id) {
            if edge.kind == EdgeKind::PrerequisiteOf {
                dependents.push(edge.target.clone());
            }
        }
        dependents
    }

    /// Find a concept node by id, slugified id, or label.
    pub fn find_concept_node(&self, query: &str) -> Option<&GraphNode> {
        let query_trimmed = query.trim();
        if query_trimmed.is_empty() {
            return None;
        }

        // 1. Direct ID match
        if let Some(node) = self.nodes.get(query_trimmed) {
            if node.kind == GraphNodeKind::Concept {
                return Some(node);
            }
        }

        // 2. Slugified ID match
        let slug_id = format!("concept_{}", slugify(query_trimmed));
        if let Some(node) = self.nodes.get(&slug_id) {
            if node.kind == GraphNodeKind::Concept {
                return Some(node);
            }
        }

        // 3. Case-insensitive label match
        self.nodes.values().find(|n| {
            n.kind == GraphNodeKind::Concept && n.label.eq_ignore_ascii_case(query_trimmed)
        })
    }

    /// Trace a concept across curriculum, content blocks, assets, questions, and mastery.
    pub fn trace_concept(&self, query: &str) -> Option<ConceptTrace> {
        let concept_node = self.find_concept_node(query)?;
        let cid = &concept_node.id;

        let mut leaves = Vec::new();
        let mut content_blocks = Vec::new();
        let mut assets = Vec::new();
        let mut questions = Vec::new();

        let mut leaf_set = HashSet::new();
        let mut block_set = HashSet::new();
        let mut asset_set = HashSet::new();
        let mut question_set = HashSet::new();

        // Helper to find parent leaf from a block or question
        let find_parent_leaf = |source_id: &str| -> Option<String> {
            for in_edge in self.get_incoming_edges(source_id) {
                if in_edge.kind == EdgeKind::Contains {
                    if let Some(parent) = self.nodes.get(&in_edge.source) {
                        if parent.kind == GraphNodeKind::Leaf {
                            return Some(parent.id.clone());
                        }
                    }
                }
            }
            // Also check outgoing Tests edge for questions pointing to leaf
            for out_edge in self.get_outgoing_edges(source_id) {
                if out_edge.kind == EdgeKind::Tests {
                    if let Some(target) = self.nodes.get(&out_edge.target) {
                        if target.kind == GraphNodeKind::Leaf {
                            return Some(target.id.clone());
                        }
                    }
                }
            }
            None
        };

        // Incoming edges into concept node (CoversConcept / Tests)
        for edge in self.get_incoming_edges(cid) {
            if edge.kind == EdgeKind::CoversConcept || edge.kind == EdgeKind::Tests {
                if let Some(source_node) = self.nodes.get(&edge.source) {
                    match source_node.kind {
                        GraphNodeKind::ContentBlock => {
                            if block_set.insert(source_node.id.clone()) {
                                content_blocks.push(source_node.id.clone());
                            }
                            if let Some(leaf_id) = find_parent_leaf(&source_node.id) {
                                if leaf_set.insert(leaf_id.clone()) {
                                    leaves.push(leaf_id);
                                }
                            }
                        }
                        GraphNodeKind::Asset => {
                            if asset_set.insert(source_node.id.clone()) {
                                assets.push(source_node.id.clone());
                            }
                        }
                        GraphNodeKind::Question => {
                            if question_set.insert(source_node.id.clone()) {
                                questions.push(source_node.id.clone());
                            }
                            if let Some(leaf_id) = find_parent_leaf(&source_node.id) {
                                if leaf_set.insert(leaf_id.clone()) {
                                    leaves.push(leaf_id);
                                }
                            }
                        }
                        GraphNodeKind::Leaf => {
                            if leaf_set.insert(source_node.id.clone()) {
                                leaves.push(source_node.id.clone());
                            }
                        }
                        _ => {}
                    }
                }
            }
        }

        // Also check assets illustrating blocks or questions that cover this concept
        for block_id in &content_blocks {
            for in_edge in self.get_incoming_edges(block_id) {
                if in_edge.kind == EdgeKind::Illustrates {
                    if let Some(source_node) = self.nodes.get(&in_edge.source) {
                        if source_node.kind == GraphNodeKind::Asset && asset_set.insert(source_node.id.clone()) {
                            assets.push(source_node.id.clone());
                        }
                    }
                }
            }
        }

        for q_id in &questions {
            for in_edge in self.get_incoming_edges(q_id) {
                if in_edge.kind == EdgeKind::Illustrates {
                    if let Some(source_node) = self.nodes.get(&in_edge.source) {
                        if source_node.kind == GraphNodeKind::Asset && asset_set.insert(source_node.id.clone()) {
                            assets.push(source_node.id.clone());
                        }
                    }
                }
            }
        }

        let mastery = self.concept_mastery.get(cid).copied().unwrap_or(0.0);

        Some(ConceptTrace {
            concept_id: cid.clone(),
            label: concept_node.label.clone(),
            leaves,
            content_blocks,
            assets,
            questions,
            mastery,
        })
    }

    /// Record a student study attempt, update graph, and propagate score to concept mastery.
    pub fn record_study_attempt(
        &mut self,
        leaf_id: &str,
        question_id: &str,
        is_correct: bool,
        score: f32,
    ) -> HashMap<String, f32> {
        let clamped_score = score.clamp(0.0, 1.0);
        let attempt_id = format!("attempt_{}_{}", self.study_records.len() + 1, question_id);

        let attempt = StudyAttempt {
            id: attempt_id.clone(),
            leaf_id: leaf_id.to_string(),
            question_id: question_id.to_string(),
            is_correct,
            score: clamped_score,
            timestamp: None,
        };
        self.study_records.push(attempt);

        // Add node and edges
        let attempt_node = GraphNode::new(
            attempt_id.clone(),
            GraphNodeKind::StudyRecord,
            format!("Attempt on {}", question_id),
        )
        .with_attribute("score", clamped_score)
        .with_attribute("is_correct", is_correct);
        self.add_node(attempt_node);

        self.add_edge(GraphEdge::new(
            attempt_id.clone(),
            question_id.to_string(),
            EdgeKind::RecordedStudy,
        ));
        self.add_edge(GraphEdge::new(
            attempt_id.clone(),
            leaf_id.to_string(),
            EdgeKind::RecordedStudy,
        ));

        // Find all concepts associated with question or leaf
        let mut affected_concepts = HashSet::new();

        // Check question's edges
        for out_edge in self.get_outgoing_edges(question_id) {
            if (out_edge.kind == EdgeKind::Tests || out_edge.kind == EdgeKind::CoversConcept)
                && self.nodes.get(&out_edge.target).map(|n| n.kind == GraphNodeKind::Concept).unwrap_or(false)
            {
                affected_concepts.insert(out_edge.target.clone());
            }
        }

        // Check leaf's blocks edges
        for out_edge in self.get_outgoing_edges(leaf_id) {
            if out_edge.kind == EdgeKind::Contains {
                for block_out in self.get_outgoing_edges(&out_edge.target) {
                    if block_out.kind == EdgeKind::CoversConcept
                        && self.nodes.get(&block_out.target).map(|n| n.kind == GraphNodeKind::Concept).unwrap_or(false)
                    {
                        affected_concepts.insert(block_out.target.clone());
                    }
                }
            }
        }

        let mut updated = HashMap::new();

        // Recompute mastery for affected concepts
        for cid in affected_concepts {
            // Find all questions testing this concept
            let mut testing_questions = HashSet::new();
            for in_edge in self.get_incoming_edges(&cid) {
                if in_edge.kind == EdgeKind::Tests {
                    testing_questions.insert(in_edge.source.clone());
                }
            }

            // Find all attempts on these questions
            let attempts: Vec<&StudyAttempt> = self
                .study_records
                .iter()
                .filter(|a| testing_questions.contains(&a.question_id) || a.leaf_id == leaf_id)
                .collect();

            if !attempts.is_empty() {
                let total_score: f32 = attempts.iter().map(|a| a.score).sum();
                let mastery = (total_score / attempts.len() as f32).clamp(0.0, 1.0);
                self.concept_mastery.insert(cid.clone(), mastery);
                updated.insert(cid, mastery);
            }
        }

        updated
    }

    /// Retrieve the current mastery score for a concept (0.0 to 1.0).
    pub fn get_concept_mastery(&self, concept_id: &str) -> f32 {
        self.concept_mastery.get(concept_id).copied().unwrap_or(0.0)
    }
}
