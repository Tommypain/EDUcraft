//! EDUcraft Asset Extraction Engine Test Suite
//! Tests HTML, PPTX, and PDF extraction, classification heuristics,
//! decorative asset filtering, and cross-source deduplication.

use educraft_lib::asset_engine::extractors::{extract_from_html, extract_from_pdf, extract_from_pptx};
use educraft_lib::asset_engine::models::ExtractionOptions;
use educraft_lib::asset_engine::pipeline::process_raw_assets;
use educraft_lib::contracts::{AssetRole, AssetType, KnowledgeAssetManifest};
use std::io::Write;

#[test]
fn test_html_extraction_data_uri_and_svg() {
    let sample_html = r#"
        <!DOCTYPE html>
        <html>
        <body>
            <figure>
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" alt="Animal Cell Diagram" width="100" height="100" />
                <figcaption>Figure 1: The Animal Cell Membrane</figcaption>
            </figure>
            <div class="vector-container">
                <svg viewBox="0 0 100 100" width="100" height="100">
                    <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />
                </svg>
            </div>
            <img src="spacer.gif" width="1" height="1" alt="spacer bullet" />
        </body>
        </html>
    "#;

    let raw_assets = extract_from_html(sample_html);
    assert_eq!(raw_assets.len(), 3, "Expected 3 raw assets (image, svg, spacer)");

    let mut manifest = KnowledgeAssetManifest::new("biology_curriculum");
    let options = ExtractionOptions::default();

    let report = process_raw_assets(raw_assets, &options, &mut manifest, None).expect("Pipeline must succeed");

    assert_eq!(report.total_found, 3);
    assert_eq!(report.decorative_count, 1, "Spacer gif should be classified as decorative");
    assert_eq!(report.educational_count, 2, "Animal cell and SVG should be educational");
    assert_eq!(report.unique_stored, 3);

    // Verify cell figure caption
    let cell_asset = manifest
        .assets
        .values()
        .find(|a| a.caption.is_some())
        .expect("Cell asset must have caption");
    assert_eq!(cell_asset.role, AssetRole::Figure);
    let cap = cell_asset.caption.as_ref().unwrap();
    assert!(cap.en.as_ref().unwrap().contains("Animal Cell Membrane"));

    // Verify SVG diagram
    let svg_asset = manifest
        .assets
        .values()
        .find(|a| a.asset_type == AssetType::Diagram)
        .expect("SVG diagram must be present");
    assert_eq!(svg_asset.mime_type, "image/svg+xml");
    assert!(!svg_asset.is_decorative);
}

#[test]
fn test_pptx_extraction_and_decorative_detection() {
    // Create an in-memory zip archive mimicking PPTX OpenXML layout
    let mut zip_buffer = std::io::Cursor::new(Vec::new());
    {
        let mut zip_writer = zip::ZipWriter::new(&mut zip_buffer);

        let options = zip::write::SimpleFileOptions::default()
            .compression_method(zip::CompressionMethod::Deflated);

        // 1. Educational slide figure
        zip_writer.start_file("ppt/media/slide_figure_1.png", options).unwrap();
        zip_writer.write_all(b"PNG_SAMPLE_EDUCATIONAL_DIAGRAM_DATA").unwrap();

        // 2. Decorative company logo
        zip_writer.start_file("ppt/media/university_logo.png", options).unwrap();
        zip_writer.write_all(b"PNG_SAMPLE_UNIVERSITY_LOGO_HEADER").unwrap();

        // 3. Educational SVG chart
        zip_writer.start_file("ppt/media/growth_chart.svg", options).unwrap();
        zip_writer.write_all(b"<svg><rect width='50' height='50'/></svg>").unwrap();

        zip_writer.finish().unwrap();
    }

    let pptx_bytes = zip_buffer.into_inner();
    let raw_assets = extract_from_pptx(&pptx_bytes).expect("PPTX extraction must succeed");
    assert_eq!(raw_assets.len(), 3);

    let mut manifest = KnowledgeAssetManifest::new("lecture_slides");
    let options = ExtractionOptions::default();

    let report = process_raw_assets(raw_assets, &options, &mut manifest, None).expect("Pipeline must succeed");

    assert_eq!(report.total_found, 3);
    assert_eq!(report.decorative_count, 1, "Logo should be detected as decorative");
    assert_eq!(report.educational_count, 2);

    let logo_asset = manifest
        .assets
        .values()
        .find(|a| a.original_filename.contains("logo"))
        .expect("Logo asset must be present");
    assert!(logo_asset.is_decorative);
    assert_eq!(logo_asset.role, AssetRole::Decorative);
}

#[test]
fn test_pdf_extraction_streams() {
    // Build a minimal valid PDF with an embedded XObject Image using lopdf
    let mut doc = lopdf::Document::with_version("1.5");
    let pages_id = doc.new_object_id();

    // Create an XObject Image stream
    let mut image_dict = lopdf::Dictionary::new();
    image_dict.set("Type", lopdf::Object::Name(b"XObject".to_vec()));
    image_dict.set("Subtype", lopdf::Object::Name(b"Image".to_vec()));
    image_dict.set("Width", 640i64);
    image_dict.set("Height", 480i64);
    image_dict.set("ColorSpace", lopdf::Object::Name(b"DeviceRGB".to_vec()));
    image_dict.set("BitsPerComponent", 8i64);
    image_dict.set("Filter", lopdf::Object::Name(b"DCTDecode".to_vec()));

    let image_stream = lopdf::Stream::new(
        image_dict,
        b"\xFF\xD8\xFF\xE0\x00\x10JFIF\x00\x01\x01\x01\x00`\x00`\x00\x00\xFF\xDB".to_vec(),
    );
    let image_id = doc.add_object(image_stream);

    // Create page referencing the image
    let mut xobject_dict = lopdf::Dictionary::new();
    xobject_dict.set("Im1", image_id);

    let mut resources_dict = lopdf::Dictionary::new();
    resources_dict.set("XObject", lopdf::Object::Dictionary(xobject_dict));

    let mut page_dict = lopdf::Dictionary::new();
    page_dict.set("Type", lopdf::Object::Name(b"Page".to_vec()));
    page_dict.set("Parent", pages_id);
    page_dict.set("Resources", lopdf::Object::Dictionary(resources_dict));
    let page_id = doc.add_object(page_dict);

    let mut pages_dict = lopdf::Dictionary::new();
    pages_dict.set("Type", lopdf::Object::Name(b"Pages".to_vec()));
    pages_dict.set("Count", 1i64);
    pages_dict.set("Kids", vec![page_id.into()]);
    doc.objects.insert(pages_id, lopdf::Object::Dictionary(pages_dict));

    let mut catalog_dict = lopdf::Dictionary::new();
    catalog_dict.set("Type", lopdf::Object::Name(b"Catalog".to_vec()));
    catalog_dict.set("Pages", pages_id);
    let catalog_id = doc.add_object(catalog_dict);
    doc.trailer.set("Root", catalog_id);

    let mut pdf_bytes = Vec::new();
    doc.save_to(&mut pdf_bytes).expect("PDF save must succeed");

    let raw_assets = extract_from_pdf(&pdf_bytes).expect("PDF extraction must succeed");
    assert_eq!(raw_assets.len(), 1);

    let raw = &raw_assets[0];
    assert_eq!(raw.mime_type, "image/jpeg");
    assert_eq!(raw.width, Some(640));
    assert_eq!(raw.height, Some(480));

    let mut manifest = KnowledgeAssetManifest::new("radiology_textbook");
    let options = ExtractionOptions::default();

    let report = process_raw_assets(raw_assets, &options, &mut manifest, None).expect("Pipeline must succeed");

    assert_eq!(report.educational_count, 1);
    assert_eq!(report.unique_stored, 1);
}

#[test]
fn test_cross_source_deduplication_pipeline() {
    let shared_data = b"SHARED_REUSABLE_EDUCATIONAL_DIAGRAM_PAYLOAD";

    let raw1 = educraft_lib::asset_engine::models::RawExtractedAsset {
        original_filename: "slide3_chart.png".to_string(),
        mime_type: "image/png".to_string(),
        data: shared_data.to_vec(),
        width: Some(400),
        height: Some(300),
        caption: None,
        alt: None,
        provenance_tags: vec!["source:pptx".to_string()],
        hinted_type: Some(AssetType::Image),
        hinted_role: None,
    };

    let raw2 = educraft_lib::asset_engine::models::RawExtractedAsset {
        original_filename: "web_chart_copy.png".to_string(),
        mime_type: "image/png".to_string(),
        data: shared_data.to_vec(),
        width: Some(400),
        height: Some(300),
        caption: None,
        alt: None,
        provenance_tags: vec!["source:html".to_string()],
        hinted_type: Some(AssetType::Image),
        hinted_role: None,
    };

    let mut manifest = KnowledgeAssetManifest::new("cross_dedup_test");
    let options = ExtractionOptions::default();

    let report = process_raw_assets(vec![raw1, raw2], &options, &mut manifest, None).expect("Pipeline must succeed");

    assert_eq!(report.total_found, 2);
    assert_eq!(report.unique_stored, 1, "Only 1 unique asset should be stored");
    assert_eq!(report.deduplicated_count, 1, "Second occurrence should be deduplicated");
    assert_eq!(manifest.assets.len(), 1, "Manifest should contain exactly 1 canonical asset");
    assert_eq!(report.asset_ids[0], report.asset_ids[1], "Both occurrences must resolve to the identical canonical ID");
}
