pub mod assets;
pub mod deleter;
pub mod importer;
pub mod scanner;
pub mod types;
pub mod validator;

pub use assets::{decode_base64, delete_book_asset, save_book_asset};
pub use deleter::{delete_book_by_id, delete_book_from_fs};
pub use importer::{
    import_book_dry_run, import_book_with_sink, save_imported_book_transactional, AutoFillEntry,
    DryRunReport, ImportEventSink, ImportIssue, IssueSeverity, NoopEventSink, StdoutEventSink,
};
pub use scanner::scan_books_directory;
pub use types::{BookScanResult, BookState, DiscoveredBook};
pub use validator::{validate_book_structure, validate_content_block, ValidationInfo};
