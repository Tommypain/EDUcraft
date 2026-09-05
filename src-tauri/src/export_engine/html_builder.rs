//! Pure Rust port of the standalone HTML document builder.
//!
//! This module has NO Tauri dependency — it takes typed data and returns a String.
//! It is fully unit-testable without a running Tauri context.

use std::borrow::Cow;
use super::bundle_loader::{get_ui_bundle_css, get_ui_bundle_js};
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
#[derive(Debug, Clone)]
pub struct ExportHtmlOptions<'a> {
    pub title: &'a str,
    pub favicon: &'a str,
    pub lang: &'a str,
    pub dir: &'a str,
    pub seed_json: &'a str,
    pub custom_js: Option<&'a str>,
    pub custom_css: Option<&'a str>,
}

impl<'a> ExportHtmlOptions<'a> {
    pub fn new(title: &'a str, favicon: &'a str, lang: &'a str, dir: &'a str, seed_json: &'a str) -> Self {
        Self {
            title,
            favicon,
            lang,
            dir,
            seed_json,
            custom_js: None,
            custom_css: None,
        }
    }
}

/// Determine image MIME type from Data URI or default to image/png.
pub fn mime_type_from_data_uri(uri: &str) -> &'static str {
    if uri.starts_with("data:image/svg+xml") {
        "image/svg+xml"
    } else if uri.starts_with("data:image/jpeg") || uri.starts_with("data:image/jpg") {
        "image/jpeg"
    } else if uri.starts_with("data:image/webp") {
        "image/webp"
    } else if uri.starts_with("data:image/gif") {
        "image/gif"
    } else {
        "image/png"
    }
}

/// Build an inline SVG favicon data URI from a book's cover gradient colours and icon.
pub fn build_svg_favicon(book_extra: &std::collections::HashMap<String, serde_json::Value>) -> String {
    let from = book_extra
        .get("cover")
        .and_then(|c| c.get("from"))
        .and_then(|v| v.as_str())
        .unwrap_or("#38BDF8");
    let to = book_extra
        .get("cover")
        .and_then(|c| c.get("to"))
        .and_then(|v| v.as_str())
        .unwrap_or("#0284C7");
    let icon = book_extra
        .get("cover")
        .and_then(|c| c.get("icon"))
        .and_then(|v| v.as_str())
        .unwrap_or("code");

    let icon_path = if icon == "code" {
        r#"<path d="M12 15 L7 20 L12 25 M20 15 L25 20 L20 25 M18 13 L14 27" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.95"/>"#
    } else {
        r#"<path d="M10 13 C7 13 7 19 10 20 C13 21 13 27 10 27" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.95"/><circle cx="16" cy="15" r="1.5" fill="white"/><circle cx="16" cy="25" r="1.5" fill="white"/>"#
    };

    let svg = format!(
        r#"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="{from}"/><stop offset="100%" stop-color="{to}"/></linearGradient></defs><rect width="32" height="32" rx="7" fill="url(#g)"/><rect x="2" y="2" width="28" height="28" rx="5.5" fill="none" stroke="white" stroke-opacity="0.3" stroke-width="1"/>{icon_path}</svg>"#,
        from = from,
        to = to,
        icon_path = icon_path
    );

    format!(
        "data:image/svg+xml,{}",
        svg.chars()
            .map(|c| match c {
                '<' => "%3C".to_string(),
                '>' => "%3E".to_string(),
                '#' => "%23".to_string(),
                '"' => "'".to_string(),
                _ => c.to_string(),
            })
            .collect::<String>()
    )
}

/// Fallback default SVG favicon data URI.
pub fn build_default_svg_favicon() -> String {
    let svg = r##"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#4f46e5"/><path d="M9 16 L16 9 L23 16 L16 23 Z" fill="white" opacity="0.9"/></svg>"##;
    format!(
        "data:image/svg+xml,{}",
        svg.chars()
            .map(|c| match c {
                '<' => "%3C".to_string(),
                '>' => "%3E".to_string(),
                '#' => "%23".to_string(),
                '"' => "'".to_string(),
                _ => c.to_string(),
            })
            .collect::<String>()
    )
}

/// Resolve the best cover image / favicon for an export seed.
/// Checks custom user-uploaded covers in seed.covers, then book gradient/icon cover,
/// then fallback default.
pub fn resolve_seed_cover_favicon(seed: &ExportSeed, target_book_id: Option<&str>) -> String {
    // 1. Try to find a custom uploaded cover in seed.covers for the target book
    if let Some(bid) = target_book_id {
        if let Some(c) = seed.covers.get(bid) {
            if !c.trim().is_empty() && c.starts_with("data:image/") {
                return c.clone();
            }
        }
    }
    // 2. Try start_book_id in seed.covers
    if !seed.start_book_id.is_empty() {
        if let Some(c) = seed.covers.get(&seed.start_book_id) {
            if !c.trim().is_empty() && c.starts_with("data:image/") {
                return c.clone();
            }
        }
    }
    // 3. Try any book in seed.covers
    for (_bid, c) in &seed.covers {
        if !c.trim().is_empty() && c.starts_with("data:image/") {
            return c.clone();
        }
    }
    // 4. Try the target book's extra cover field
    let target_book = target_book_id
        .and_then(|bid| seed.books.iter().find(|b| b.id == bid))
        .or_else(|| seed.books.first());

    if let Some(book) = target_book {
        return build_svg_favicon(&book.extra);
    }

    // 5. Default fallback
    build_default_svg_favicon()
}

/// Build the complete standalone HTML document.
///
/// The returned String is a fully self-contained HTML file that:
/// - Embeds the minified React bundle (from dynamic loader or custom_js)
/// - Embeds the compiled Tailwind CSS (from dynamic loader or custom_css)
/// - Injects `window.__EDUCRAFT_EXPORT__` with the serialised book data
/// - Embeds custom book cover image in favicon, apple-touch-icon, and OpenGraph tags
/// - Works offline in any modern browser
pub fn build_export_html(opts: &ExportHtmlOptions<'_>) -> String {
    let escaped_title = escape_html(opts.title);
    let bundle_js = match opts.custom_js {
        Some(js) => Cow::Borrowed(js),
        None => get_ui_bundle_js(),
    };
    let bundle_css = match opts.custom_css {
        Some(css) => Cow::Borrowed(css),
        None => get_ui_bundle_css(),
    };
    let safe_bundle = escape_script_close(&bundle_js);
    let mime = mime_type_from_data_uri(opts.favicon);

    let cover_meta_tags = if !opts.favicon.is_empty() && opts.favicon != "data:," {
        format!(
            concat!(
                r#"<link rel="icon" type="{mime}" href="{favicon}">"#, "\n",
                r#"<link rel="apple-touch-icon" href="{favicon}">"#, "\n",
                r#"<meta property="og:title" content="{title}">"#, "\n",
                r#"<meta property="og:image" content="{favicon}">"#, "\n",
                r#"<meta name="twitter:card" content="summary_large_image">"#, "\n",
                r#"<meta name="twitter:title" content="{title}">"#, "\n",
                r#"<meta name="twitter:image" content="{favicon}">"#, "\n",
                r#"<meta name="thumbnail" content="{favicon}">"#
            ),
            mime = mime,
            favicon = opts.favicon,
            title = escaped_title
        )
    } else {
        format!(r#"<link rel="icon" href="{favicon}">"#, favicon = opts.favicon)
    };

    format!(
        r#"<!DOCTYPE html>
<html lang="{lang}" dir="{dir}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover">
<meta name="application-name" content="EDUcraft">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="educraft-title" content="{title}">
<meta name="educraft-lang" content="{lang}">
<meta name="educraft-dir" content="{dir}">
<title>{title}</title>
{cover_meta}
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
        cover_meta = cover_meta_tags,
        font_links = EXPORT_FONT_LINKS,
        css = bundle_css,
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
