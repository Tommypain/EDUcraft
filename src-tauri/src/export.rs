use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize)]
pub struct BundlePayload {
    pub target_type: String, // "book" | "encyclopedia" | "bag"
    pub title: String,
    pub lang: String,       // "en" | "ar"
    pub dir: String,        // "ltr" | "rtl"
    pub cover_from: Option<String>,
    pub cover_to: Option<String>,
    pub data: Value,        // Full JSON data for the book(s) or bag
}

fn urlencoding_encode(s: &str) -> String {
    let mut result = String::new();
    for b in s.bytes() {
        match b {
            b'a'..=b'z' | b'A'..=b'Z' | b'0'..=b'9' | b'-' | b'_' | b'.' | b'~' => {
                result.push(b as char);
            }
            _ => {
                result.push_str(&format!("%{:02X}", b));
            }
        }
    }
    result
}

fn find_dist_dir() -> Option<PathBuf> {
    if let Ok(exe) = std::env::current_exe() {
        let mut curr = exe.parent();
        for _ in 0..6 {
            if let Some(p) = curr {
                let candidate = p.join("dist");
                if candidate.join("index.html").exists() {
                    return Some(candidate);
                }
                curr = p.parent();
            } else {
                break;
            }
        }
    }
    if let Ok(cwd) = std::env::current_dir() {
        let mut curr = Some(cwd.as_path());
        for _ in 0..6 {
            if let Some(p) = curr {
                let candidate = p.join("dist");
                if candidate.join("index.html").exists() {
                    return Some(candidate);
                }
                curr = p.parent();
            } else {
                break;
            }
        }
    }
    None
}

fn extract_attr_val<'a>(tag: &'a str, attr: &str) -> Option<&'a str> {
    let key = format!("{}=\"", attr);
    let start = tag.find(&key)? + key.len();
    let end = tag[start..].find('"')? + start;
    Some(&tag[start..end])
}

pub fn bundle_app_with_data(payload: &BundlePayload) -> Result<String, String> {
    let dist = find_dist_dir()
        .ok_or_else(|| "dist/ folder not found. Please run `npm run build` first.".to_string())?;

    let index_html = std::fs::read_to_string(dist.join("index.html"))
        .map_err(|e| format!("Cannot read dist/index.html: {e}"))?;

    // ── Inline CSS ──────────────────────────────────────────────────────────
    let mut css_blocks = String::new();
    let mut search = index_html.as_str();
    while let Some(pos) = search.find("<link") {
        search = &search[pos..];
        let tag_end = search.find('>').unwrap_or(search.len());
        let tag = &search[..tag_end + 1];
        if tag.contains("stylesheet") {
            if let Some(href) = extract_attr_val(tag, "href") {
                let path = dist.join(href.trim_start_matches('/'));
                if let Ok(css) = std::fs::read_to_string(&path) {
                    css_blocks.push_str("<style>");
                    css_blocks.push_str(&css);
                    css_blocks.push_str("</style>\n");
                }
            }
        }
        search = &search[1..];
    }

    // ── Inline JS ───────────────────────────────────────────────────────────
    let mut js_blocks = String::new();
    let mut search = index_html.as_str();
    while let Some(pos) = search.find("<script") {
        search = &search[pos..];
        let tag_end = search.find('>').unwrap_or(search.len());
        let tag = &search[..tag_end + 1];
        if let Some(src) = extract_attr_val(tag, "src") {
            let path = dist.join(src.trim_start_matches('/'));
            if let Ok(js) = std::fs::read_to_string(&path) {
                js_blocks.push_str("<script type=\"module\">");
                js_blocks.push_str(&js);
                js_blocks.push_str("</script>\n");
            }
        }
        search = &search[1..];
    }

    // ── __STANDALONE__ injection ─────────────────────────────────────────────
    let data_json = serde_json::to_string(&payload.data)
        .unwrap_or_else(|_| "{}".to_string())
        .replace("</script>", "<\\/script>");

    let from  = payload.cover_from.as_deref().unwrap_or("#E8654A");
    let to    = payload.cover_to.as_deref().unwrap_or("#F2C879");
    let title = &payload.title;
    let lang  = &payload.lang;
    let dir   = &payload.dir;
    let ttype = &payload.target_type;
    let title_json = serde_json::to_string(title).unwrap_or_else(|_| format!("\"{}\"", title));

    let standalone_script = format!(
        "<script>\nwindow.__STANDALONE__ = {{\n  targetType: \"{ttype}\",\n  title: {title_json},\n  lang: \"{lang}\",\n  dir: \"{dir}\",\n  coverFrom: \"{from}\",\n  coverTo: \"{to}\",\n  data: {data_json}\n}};\n</script>"
    );

    // ── Dynamic favicon ─────────────────────────────────────────────────────
    let letter = title.chars().next().unwrap_or('E').to_uppercase().to_string();
    let fav_svg = format!(
        "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\"><defs><linearGradient id=\"g\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"{from}\"/><stop offset=\"1\" stop-color=\"{to}\"/></linearGradient></defs><rect width=\"64\" height=\"64\" rx=\"14\" fill=\"url(#g)\"/><text x=\"32\" y=\"43\" font-family=\"Arial,sans-serif\" font-size=\"30\" font-weight=\"900\" fill=\"white\" text-anchor=\"middle\">{letter}</text></svg>"
    );
    let favicon_uri = format!("data:image/svg+xml;utf8,{}", urlencoding_encode(&fav_svg));

    // ── Assemble ─────────────────────────────────────────────────────────────
    let html = format!(
        "<!doctype html>\n<html lang=\"{lang}\" dir=\"{dir}\">\n<head>\n<meta charset=\"UTF-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n<title>{title} — EDUcraft</title>\n<link rel=\"icon\" href=\"{favicon_uri}\">\n{css_blocks}\n{standalone_script}\n</head>\n<body>\n<div id=\"root\"></div>\n{js_blocks}\n</body>\n</html>\n"
    );

    Ok(html)
}
