//! Source extractors for HTML, PPTX, and PDF.

pub mod html;
pub mod pdf;
pub mod pptx;

pub use html::extract_from_html;
pub use pdf::extract_from_pdf;
pub use pptx::extract_from_pptx;
