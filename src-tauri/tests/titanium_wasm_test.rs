use educraft_lib::titanium::*;

#[test]
fn test_wasm_header_and_export_parsing() {
    let binary = WasmSandbox::create_test_wasm_binary(&["compile_latex", "eval_formula"]);

    let mut sandbox = WasmSandbox::new(WasmExecutionConfig::default());
    assert!(sandbox.load_module(&binary).is_ok());

    let module = sandbox.loaded_module.as_ref().unwrap();
    assert_eq!(module.version, 1);
    assert!(module.exports.contains_key("compile_latex"));
    assert!(module.exports.contains_key("eval_formula"));
    assert!(!module.exports.contains_key("nonexistent_func"));
}

#[test]
fn test_wasm_invalid_magic_rejection() {
    let mut corrupt = WasmSandbox::create_test_wasm_binary(&["test"]);
    corrupt[0] = 0xFF; // Corrupt magic byte

    let mut sandbox = WasmSandbox::new(WasmExecutionConfig::default());
    let err = sandbox.load_module(&corrupt).expect_err("Should reject invalid magic");
    assert_eq!(err, WasmError::InvalidMagic);
}

#[test]
fn test_wasm_function_invocation_and_abi() {
    let binary = WasmSandbox::create_test_wasm_binary(&["transform_text"]);

    let mut sandbox = WasmSandbox::new(WasmExecutionConfig::default());
    sandbox.load_module(&binary).unwrap();

    let input = b"E=mc^2";
    let output = sandbox
        .call_export("transform_text", input)
        .expect("Execution should succeed");

    assert!(output.starts_with(b"WASM_OUT:"));
    assert!(output.ends_with(input));

    // Nonexistent export should error
    let err = sandbox.call_export("unknown_func", input).expect_err("Should fail");
    assert!(matches!(err, WasmError::ExportNotFound(_)));
}

#[test]
fn test_wasm_fuel_exhaustion_guard() {
    let binary = WasmSandbox::create_test_wasm_binary(&["infinite_loop"]);

    // Allocate sandbox with very tiny fuel (e.g. 5 fuel units)
    let config = WasmExecutionConfig {
        max_memory_bytes: 1024 * 1024,
        initial_fuel: 5,
    };
    let mut sandbox = WasmSandbox::new(config);
    sandbox.load_module(&binary).unwrap();

    // Invocation requires at least 10 fuel
    let err = sandbox
        .call_export("infinite_loop", b"test")
        .expect_err("Should abort with fuel exhaustion");

    assert_eq!(err, WasmError::FuelExhausted);
}

#[test]
fn test_wasm_memory_bounds_enforcement() {
    let binary = WasmSandbox::create_test_wasm_binary(&["mem_test"]);

    // Restrict max memory to 256 bytes
    let config = WasmExecutionConfig {
        max_memory_bytes: 256,
        initial_fuel: 1000,
    };
    let mut sandbox = WasmSandbox::new(config);
    sandbox.load_module(&binary).unwrap();

    // Normal write within bounds
    assert!(sandbox.write_memory(0, b"Safe data").is_ok());

    // Out-of-bounds write
    let err = sandbox
        .write_memory(250, &[1u8; 10]) // 250 + 10 = 260 > 256
        .expect_err("Should fail out of bounds");

    assert!(matches!(err, WasmError::MemoryOutOfBounds { .. }));
}
