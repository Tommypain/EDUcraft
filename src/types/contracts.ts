/**
 * EDUcraft Master Architecture — Core Data Contracts
 * Version: 1.1.0
 *
 * Formal contracts for Book, Node, ContentBlock, Question,
 * KnowledgeAssetManifest, Collection, and Titanium PluginManifest.
 */

export type SchemaVersion = "1.0" | "1.1" | string;

export interface LocalizedString {
  ar?: string;
  en?: string;
}

export interface BookLocaleContract {
  title: string;
  tagline?: string;
  description?: string;
  [key: string]: unknown;
}

export interface BookCoverContract {
  from: string;
  to: string;
  icon?: string;
}

export interface BookAssetsMeta {
  manifest_path?: string;
  total_count?: number;
  [key: string]: unknown;
}

export interface BookMetadataContract {
  author?: string;
  created_at?: string;
  updated_at?: string;
  version?: string;
  license?: string;
  tags?: string[];
  [key: string]: unknown;
}

export interface BookContract {
  schema_version?: SchemaVersion; // defaults to "1.0" if absent
  id: string;
  ar: BookLocaleContract;
  en: BookLocaleContract;
  cover?: BookCoverContract;
  flavorId?: string;
  skinId?: string;
  crossLinks?: [string, string][];
  capabilities?: string[];
  assets?: BookAssetsMeta;
  metadata?: BookMetadataContract;
  nodes: BookNodeContract[];
  [key: string]: unknown;
}

export type NodeLevel = "branch" | "sub" | "leaf";

export interface BookNodeContract {
  id: string;
  level: NodeLevel;
  parent?: string;
  ar?: { title: string; summary?: string } | string;
  en?: { title: string; summary?: string } | string;
  pagePaletteId?: string;
  pageBlocks?: ContentBlockContract[];
  cards?: CardContract[];
  questions?: QuestionContract[];
  [key: string]: unknown;
}

export type ContentBlockKind =
  | "sectionTitle"
  | "text"
  | "keyterm"
  | "note"
  | "warning"
  | "important"
  | "code"
  | "table"
  | "image"
  | "pagebreak";

export interface ContentBlockContract {
  id?: string;
  kind: ContentBlockKind;
  text?: string;
  term?: string;
  definition?: string;
  language?: string;
  headers?: string[];
  rows?: string[][];
  // Image Block attributes
  imageUrl?: string;        // legacy direct URL or data URI
  asset_id?: string;        // stable unique asset identifier
  isPlaceholder?: boolean;
  caption?: string;
  width?: "25%" | "50%" | "75%" | "100%";
  align?: "left" | "center" | "right";
  [key: string]: unknown;
}

export type QuestionType =
  | "single"
  | "multi"
  | "tf"
  | "short"
  | "essay"
  | "fill"
  | "cloze"
  | "match"
  | "order"
  | "sort"
  | "numeric"
  | "rating"
  | "slider";

export interface QuestionContract {
  id: string;
  type: QuestionType;
  stem?: string;
  prompt?: string;
  options?: any[];
  answer?: any;
  explanation?: string;
  points?: number;
  asset_ids?: string[];
  content?: ContentBlockContract[];
  en?: Record<string, unknown>;
  ar?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface QuestionGroupContract {
  id?: string;
  title?: string;
  questions: QuestionContract[];
}

export interface CardContract {
  id?: string;
  title?: string;
  questionGroups?: QuestionGroupContract[];
  questions?: QuestionContract[];
  [key: string]: unknown;
}

export type AssetType =
  | "image"
  | "diagram"
  | "chart"
  | "table"
  | "audio"
  | "video"
  | "document"
  | "pdfFigure"
  | "model3d"
  | "interactiveDiagram"
  | "unknown";

export type AssetRole =
  | "figure"
  | "diagram"
  | "hero"
  | "card"
  | "solution"
  | "icon"
  | "decorative"
  | "unknown";

export interface KnowledgeAsset {
  id: string;
  asset_type?: AssetType;
  role?: AssetRole;
  original_filename: string;
  storage_path: string;
  mime_type: string;
  byte_size: number;
  sha256: string;
  width?: number;
  height?: number;
  aspect_ratio?: number;
  duration_seconds?: number;
  is_decorative?: boolean;
  caption?: LocalizedString;
  alt?: LocalizedString;
  tags?: string[];
  intelligence?: AssetIntelligence;
  extra?: Record<string, unknown>;
}

export type ConfidenceLevel = "high" | "medium" | "low";

export interface ConfidenceScore {
  score: number;
  level: ConfidenceLevel;
  basis: string[];
}

export interface AssetProvenance {
  source_file?: string;
  page_number?: number;
  slide_number?: number;
  container_tag?: string;
}

export interface AssetIntelligence {
  title?: LocalizedString;
  caption?: LocalizedString;
  description?: LocalizedString;
  ocr_text?: string;
  topics: string[];
  concepts: string[];
  pedagogical_role: AssetRole;
  provenance: AssetProvenance;
  confidence: ConfidenceScore;
  perceptual_hash?: string;
}

export interface KnowledgeAssetManifest {
  manifest_version: string;
  book_id: string;
  generated_at?: string;
  assets: Record<string, KnowledgeAsset>;
  [key: string]: unknown;
}

export type CollectionKind = "folder" | "encyclopedia";

export interface CollectionContract {
  id: string;
  kind: CollectionKind;
  title: string;
  itemIds: string[];
  [key: string]: unknown;
}

export interface PluginManifestContract {
  id: string;
  name: string;
  version: string;
  author?: string;
  description?: string;
  entry_point: string;
  target_engine?: string;
  capabilities?: string[];
  permissions?: string[];
  contributions?: {
    views?: Array<{ id: string; title: string; icon?: string }>;
    themes?: Array<{ id: string; name: string; file: string }>;
    content_blocks?: Array<{ kind: string; title: string }>;
    question_types?: Array<{ type: string; title: string }>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface AssetResolutionQuery {
  topic?: string;
  asset_type?: AssetType;
  role?: AssetRole;
  concept?: string;
  context?: string;
  min_score?: number;
}

export interface ScoredCandidate {
  asset_id: string;
  score: number;
  match_reasons: string[];
}

export interface AssetResolutionResult {
  resolved: boolean;
  asset_id?: string;
  score: number;
  candidates: ScoredCandidate[];
  reason?: string;
}

// ============================================================================
// Knowledge Graph Contract
// ============================================================================

export type GraphNodeKind =
  | "book"
  | "branch"
  | "subbranch"
  | "leaf"
  | "contentblock"
  | "concept"
  | "question"
  | "asset"
  | "studyrecord";

export type EdgeKind =
  | "contains"
  | "prerequisiteof"
  | "illustrates"
  | "tests"
  | "coversconcept"
  | "recordedstudy";

export interface GraphNodeContract {
  id: string;
  kind: GraphNodeKind;
  label: string;
  attributes?: Record<string, unknown>;
}

export interface GraphEdgeContract {
  source: string;
  target: string;
  kind: EdgeKind;
  weight?: number;
  metadata?: Record<string, unknown>;
}

export interface StudyAttemptContract {
  id: string;
  leaf_id: string;
  question_id: string;
  is_correct: boolean;
  score: number;
  timestamp?: string;
}

export interface ConceptTraceContract {
  concept_id: string;
  label: string;
  leaves: string[];
  content_blocks: string[];
  assets: string[];
  questions: string[];
  mastery: number;
}

export interface KnowledgeGraphContract {
  nodes: Record<string, GraphNodeContract>;
  outgoing: Record<string, GraphEdgeContract[]>;
  incoming: Record<string, GraphEdgeContract[]>;
  concept_mastery: Record<string, number>;
  study_records: StudyAttemptContract[];
}

