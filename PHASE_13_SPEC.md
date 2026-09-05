# PHASE 13 SPECIFICATION — WASM Extension Layer

## Objective
Establish a secure, memory-isolated, and cross-platform **WASM Extension Layer** for Titanium:
1. **Isolated Execution Sandbox**:
   - Executes WebAssembly guest modules within strict memory boundaries (bounded memory buffer, max 16MB - 64MB).
   - Prevents unauthorized access to the host filesystem, OS processes, or network.
2. **Instruction Fuel & Execution Bounds**:
   - Limits loop iterations and execution cycles ("fuel") to guarantee that malicious or buggy WASM modules cannot hang the UI or infinite-loop the core process.
3. **Standard Titanium Host ABI**:
   - Host functions exposed to WASM guest:
     - `titanium_host_log(msg)`
     - `titanium_host_read_input() -> Vec<u8>`
     - `titanium_host_write_output(Vec<u8>)`
     - `titanium_host_get_fuel() -> u64`
4. **Lightweight & Cross-Platform**:
   - Pure-Rust WASM container & runtime simulator that requires zero massive C-bindings or Cranelift/LLVM dependencies, maintaining flawless cross-compilation across Linux, macOS, and Windows.
5. **Zero Breaking Changes**:
   - All core system features continue operating independently.

---

## 1. Architecture & Data Structures

### A. WASM Module Representation (`src-tauri/src/titanium/wasm.rs`)
```rust
pub struct WasmModuleHeader {
    pub magic: [u8; 4],   // \0asm
    pub version: u32,
    pub sections_count: usize,
}

pub struct WasmExecutionConfig {
    pub max_memory_bytes: usize, // e.g. 16MB default
    pub initial_fuel: u64,       // e.g. 1,000,000 instructions
}
```

### B. Sandboxed Runtime Context (`WasmSandbox`)
- Bounded linear memory buffer (`Vec<u8>`).
- Fuel counter depleted with every simulated operation.
- Host ABI buffer exchange for input/output JSON payloads.

---

## 2. API Surface
- `WasmSandbox::new(config: WasmExecutionConfig) -> Self`
- `WasmSandbox::load_module(&mut self, wasm_bytes: &[u8]) -> Result<(), WasmError>`
- `WasmSandbox::call_export(&mut self, function_name: &str, input_payload: &[u8]) -> Result<Vec<u8>, WasmError>`
- `WasmSandbox::remaining_fuel(&self) -> u64`

---

## 3. Verification Plan
Automated test suite `src-tauri/tests/titanium_wasm_test.rs`:
1. **WASM Header & Section Parsing**: Validates standard `\0asm` magic byte header and section structure.
2. **Deterministic Computation**: Calls an exported function (e.g. data transformer or math evaluator) and receives output.
3. **Fuel Depletion Guard**: An infinite loop or excessive computation runs out of fuel and cleanly aborts with `WasmError::FuelExhausted`.
4. **Memory Boundary Enforcement**: An attempt to read or write beyond `max_memory_bytes` cleanly aborts with `WasmError::MemoryOutOfBounds`.
5. **Full Project Green Build**: Rust test suite and frontend build.
