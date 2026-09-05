//! Pure in-memory Knowledge Graph data structures.
//!
//! Connects Books, Branches, SubBranches, Leaves, ContentBlocks,
//! Concepts, Questions, Assets, and Study Records.

use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// Semantic and structural kinds of nodes in the Knowledge Graph.
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum GraphNodeKind {
    Book,
    Branch,
    SubBranch,
    Leaf,
    ContentBlock,
    Concept,
    Question,
    Asset,
    StudyRecord,
}

/// Pedagogical, structural, and performance relationships between nodes.
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum EdgeKind {
    /// Hierarchy: Book -> Branch -> Sub -> Leaf -> Block / Question
    Contains,
    /// Pedagogical dependency: Leaf A -> Leaf B (from crossLinks)
    PrerequisiteOf,
    /// Multimodal illustration: Asset -> Leaf / Block / Question
    Illustrates,
    /// Assessment link: Question -> Leaf / Concept / Asset
    Tests,
    /// Concept mapping: Block / Question / Asset -> Concept
    CoversConcept,
    /// Study performance record: Attempt -> Question / Leaf
    RecordedStudy,
}

/// A node in the in-memory knowledge graph.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct GraphNode {
    pub id: String,
    pub kind: GraphNodeKind,
    pub label: String,
    #[serde(default, skip_serializing_if = "HashMap::is_empty")]
    pub attributes: HashMap<String, serde_json::Value>,
}

impl GraphNode {
    pub fn new(id: impl Into<String>, kind: GraphNodeKind, label: impl Into<String>) -> Self {
        Self {
            id: id.into(),
            kind,
            label: label.into(),
            attributes: HashMap::new(),
        }
    }

    pub fn with_attribute(mut self, key: impl Into<String>, value: impl Into<serde_json::Value>) -> Self {
        self.attributes.insert(key.into(), value.into());
        self
    }
}

/// A directed edge connecting two nodes in the knowledge graph.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct GraphEdge {
    pub source: String,
    pub target: String,
    pub kind: EdgeKind,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub weight: Option<f32>,
    #[serde(default, skip_serializing_if = "HashMap::is_empty")]
    pub metadata: HashMap<String, serde_json::Value>,
}

impl GraphEdge {
    pub fn new(source: impl Into<String>, target: impl Into<String>, kind: EdgeKind) -> Self {
        Self {
            source: source.into(),
            target: target.into(),
            kind,
            weight: None,
            metadata: HashMap::new(),
        }
    }

    pub fn with_weight(mut self, weight: f32) -> Self {
        self.weight = Some(weight);
        self
    }
}

/// A single recorded student study attempt on a question or lesson unit.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct StudyAttempt {
    pub id: String,
    pub leaf_id: String,
    pub question_id: String,
    pub is_correct: bool,
    pub score: f32,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub timestamp: Option<String>,
}

/// Multimodal trace for a concept across curriculum, assets, questions, and mastery.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ConceptTrace {
    pub concept_id: String,
    pub label: String,
    pub leaves: Vec<String>,
    pub content_blocks: Vec<String>,
    pub assets: Vec<String>,
    pub questions: Vec<String>,
    pub mastery: f32,
}

/// Unified, lightweight in-memory knowledge graph representation.
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq)]
pub struct KnowledgeGraph {
    pub nodes: HashMap<String, GraphNode>,
    pub outgoing: HashMap<String, Vec<GraphEdge>>,
    pub incoming: HashMap<String, Vec<GraphEdge>>,
    #[serde(default)]
    pub concept_mastery: HashMap<String, f32>,
    #[serde(default)]
    pub study_records: Vec<StudyAttempt>,
}

impl KnowledgeGraph {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn add_node(&mut self, node: GraphNode) {
        self.nodes.insert(node.id.clone(), node);
    }

    pub fn get_node(&self, id: &str) -> Option<&GraphNode> {
        self.nodes.get(id)
    }

    pub fn has_node(&self, id: &str) -> bool {
        self.nodes.contains_key(id)
    }

    pub fn add_edge(&mut self, edge: GraphEdge) {
        self.outgoing
            .entry(edge.source.clone())
            .or_default()
            .push(edge.clone());
        self.incoming
            .entry(edge.target.clone())
            .or_default()
            .push(edge);
    }

    pub fn get_outgoing_edges(&self, node_id: &str) -> &[GraphEdge] {
        self.outgoing.get(node_id).map(|v| v.as_slice()).unwrap_or(&[])
    }

    pub fn get_incoming_edges(&self, node_id: &str) -> &[GraphEdge] {
        self.incoming.get(node_id).map(|v| v.as_slice()).unwrap_or(&[])
    }

    pub fn node_count(&self) -> usize {
        self.nodes.len()
    }

    pub fn edge_count(&self) -> usize {
        self.outgoing.values().map(|edges| edges.len()).sum()
    }
}
