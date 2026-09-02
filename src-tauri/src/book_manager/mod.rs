pub mod deleter;
pub mod scanner;
pub mod types;
pub mod validator;

pub use deleter::delete_book_from_fs;
pub use scanner::scan_books_directory;
pub use types::{BookScanResult, BookState, DiscoveredBook};
pub use validator::{validate_book_structure, ValidationInfo};
