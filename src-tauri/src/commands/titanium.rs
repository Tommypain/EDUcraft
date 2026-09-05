use crate::asset_resolver::{resolve_asset, AssetIndex, AssetResolutionQuery, AssetResolutionResult};
use crate::contracts::{AssetRole, KnowledgeAssetManifest};
use crate::titanium::{AggregatedContributions, RegisteredPlugin, TitaniumRegistry};
use std::sync::{Mutex, OnceLock};

static REGISTRY: OnceLock<Mutex<TitaniumRegistry>> = OnceLock::new();

/// Global singleton instance of the TitaniumRegistry.
pub fn get_titanium_registry() -> &'static Mutex<TitaniumRegistry> {
    REGISTRY.get_or_init(|| Mutex::new(TitaniumRegistry::new("0.0.9.0")))
}

/// List all plugins registered in the Titanium runtime.
#[tauri::command]
pub fn titanium_list_plugins() -> Vec<RegisteredPlugin> {
    let reg = get_titanium_registry().lock().unwrap();
    reg.list_plugins().into_iter().cloned().collect()
}

/// Activate a plugin by ID along with its dependencies.
#[tauri::command]
pub fn titanium_activate_plugin(plugin_id: String) -> Result<Vec<String>, String> {
    let mut reg = get_titanium_registry().lock().unwrap();
    reg.activate_with_dependencies(&plugin_id)
        .map_err(|e| e.to_string())
}

/// Deactivate an active plugin by ID.
#[tauri::command]
pub fn titanium_deactivate_plugin(plugin_id: String) -> Result<(), String> {
    let mut reg = get_titanium_registry().lock().unwrap();
    reg.deactivate(&plugin_id).map_err(|e| e.to_string())
}

/// Retrieve all aggregated contributions from currently active plugins.
#[tauri::command]
pub fn titanium_get_contributions() -> AggregatedContributions {
    let reg = get_titanium_registry().lock().unwrap();
    reg.get_active_contributions()
}

/// Query and resolve a knowledge asset using the semantic asset resolver.
#[tauri::command]
pub fn titanium_resolve_asset(
    manifest: KnowledgeAssetManifest,
    topic: Option<String>,
    role: Option<String>,
    min_score: Option<f32>,
) -> AssetResolutionResult {
    let index = AssetIndex::build(&manifest);

    let parsed_role = role.and_then(|r| match r.to_lowercase().as_str() {
        "figure" => Some(AssetRole::Figure),
        "diagram" => Some(AssetRole::Diagram),
        "hero" => Some(AssetRole::Hero),
        "card" => Some(AssetRole::Card),
        "solution" => Some(AssetRole::Solution),
        "icon" => Some(AssetRole::Icon),
        "decorative" => Some(AssetRole::Decorative),
        _ => None,
    });

    let mut query = AssetResolutionQuery::default();
    query.topic = topic;
    query.role = parsed_role;
    query.min_score = min_score;

    resolve_asset(&manifest, &index, &query)
}

