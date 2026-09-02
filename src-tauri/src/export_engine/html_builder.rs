//! Pure Rust port of the standalone HTML document builder.
//!
//! This module has NO Tauri dependency — it takes typed data and returns a String.
//! It is fully unit-testable without a running Tauri context.

use super::bundle_loader::{UI_BUNDLE_CSS, UI_BUNDLE_JS};
use super::types::ExportSeed;

const EXPORT_FONT_LINKS: &str = concat!(
    r#"<link rel="preconnect" href="https://fonts.googleapis.com">"#,
    r#"<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>"#,
    r#"<link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700"#,
    r#"&family=Press+Start+2P&family=Inter:wght@400;500;600;700"#,
    r#"&family=Cairo:wght@500;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700"#,
    r#"&display=swap" rel="stylesheet">"#
);

/// Escape HTML special characters (for title / attribute values).
pub fn escape_html(s: &str) -> String {
    s.replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
        .replace('"', "&quot;")
}

/// Prevent `</script>` from closing the inline script tag prematurely.
/// Case-insensitive, UTF-8 safe (never corrupts non-ASCII Arabic or emojis).
pub fn escape_script_close(s: &str) -> String {
    let needle = b"</script";
    let bytes = s.as_bytes();
    let mut out = String::with_capacity(s.len() + 32);
    let mut last = 0;
    let mut i = 0;

    while i + 8 <= bytes.len() {
        if bytes[i..i + 8].eq_ignore_ascii_case(needle) {
            out.push_str(&s[last..i]);
            out.push_str(r"<\/");
            out.push_str(&s[i + 2..i + 8]); // script / SCRIPT preserved
            i += 8;
            last = i;
        } else {
            i += 1;
        }
    }

    out.push_str(&s[last..]);
    out
}

/// Options for building the export HTML document.
pub struct ExportHtmlOptions<'a> {
    pub title: &'a str,
    pub favicon: &'a str,
    pub lang: &'a str,
    pub dir: &'a str,
    pub seed_json: &'a str,
}

/// Build the complete standalone HTML document.
///
/// The returned String is a fully self-contained HTML file that:
/// - Embeds the minified React bundle (from `UI_BUNDLE_JS`)
/// - Embeds the compiled Tailwind CSS (from `UI_BUNDLE_CSS`)
/// - Injects `window.__EDUCRAFT_EXPORT__` with the serialised book data
/// - Works offline in any modern browser
pub fn build_export_html(opts: &ExportHtmlOptions<'_>) -> String {
    let escaped_title = escape_html(opts.title);
    let safe_bundle = escape_script_close(UI_BUNDLE_JS);

    format!(
        r#"<!DOCTYPE html>
<html lang="{lang}" dir="{dir}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<link rel="icon" href="{favicon}">
{font_links}
<style>{css}</style>
</head>
<body>
<div id="root"></div>
<script>window.__EDUCRAFT_EXPORT__ = {seed};</script>
<script>{bundle}</script>
</body>
</html>"#,
        lang = opts.lang,
        dir = opts.dir,
        title = escaped_title,
        favicon = opts.favicon,
        font_links = EXPORT_FONT_LINKS,
        css = UI_BUNDLE_CSS,
        seed = opts.seed_json,
        bundle = safe_bundle,
    )
}

/// Derive the RTL/LTR direction from the language code.
pub fn lang_to_dir(lang: &str) -> &'static str {
    if lang == "ar" { "rtl" } else { "ltr" }
}

/// Simple ASCII slug: lowercase, spaces→hyphens, strip non-alphanum.
pub fn slugify(s: &str) -> String {
    s.chars()
        .map(|c| if c.is_alphanumeric() { c.to_ascii_lowercase() } else { '-' })
        .collect::<String>()
        .split('-')
        .filter(|p| !p.is_empty())
        .collect::<Vec<_>>()
        .join("-")
}

/// Serialise the seed to JSON, escaping `<` to `\u003c` to prevent XSS
/// and premature script closure when the payload is inlined into a `<script>` tag.
pub fn seed_to_safe_json(seed: &ExportSeed) -> Result<String, serde_json::Error> {
    let raw = serde_json::to_string(seed)?;
    Ok(raw.replace('<', "\\u003c"))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn escape_html_handles_all_chars() {
        assert_eq!(
            escape_html("<div class=\"x\">a&b</div>"),
            "&lt;div class=&quot;x&quot;&gt;a&amp;b&lt;/div&gt;"
        );
    }

    #[test]
    fn escape_script_close_case_insensitive_and_unicode_safe() {
        let input = r#"كتاب برمجة: </script><SCRIPT> console.log("مرحبا");</sCripT>"#;
        let out = escape_script_close(input);
        assert!(!out.contains("</script"));
        assert!(!out.contains("</SCRIPT"));
        assert!(!out.contains("</sCripT"));
        assert!(out.contains("كتاب برمجة:"));
        assert!(out.contains("مرحبا"));
    }

    #[test]
    fn slugify_basic() {
        assert_eq!(slugify("Hello World! 123"), "hello-world-123");
        assert_eq!(slugify("  spaces  "), "spaces");
        assert_eq!(slugify("كتاب"), "كتاب");
    }

    #[test]
    fn lang_to_dir_works() {
        assert_eq!(lang_to_dir("ar"), "rtl");
        assert_eq!(lang_to_dir("en"), "ltr");
    }
}
