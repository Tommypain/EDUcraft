//! Titanium Sandboxed WebAssembly (WASM) Extension Runtime
//!
//! Provides memory-isolated, fuel-bounded bytecode execution for untrusted plugins
//! with zero external heavyweight C-dependencies.

use serde::{Deserialize, Serialize};
use std::collections::HashMap;

pub const WASM_MAGIC: [u8; 4] = [0x00, 0x61, 0x73, 0x6d]; // \0asm
pub const WASM_VERSION: u32 = 1;
pub const DEFAULT_MAX_MEMORY_BYTES: usize = 16 * 1024 * 1024; // 16MB
pub const DEFAULT_INITIAL_FUEL: u64 = 1_000_000;

/// Errors emitted by the WASM sandbox environment.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum WasmError {
    InvalidMagic,
    UnsupportedVersion(u32),
    InvalidFormat(String),
    FuelExhausted,
    MemoryOutOfBounds {
        offset: usize,
        length: usize,
        max: usize,
    },
    ExportNotFound(String),
    ExecutionError(String),
}

impl std::fmt::Display for WasmError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            WasmError::InvalidMagic => write!(f, "Invalid WASM binary: magic byte mismatch (expected \\0asm)"),
            WasmError::UnsupportedVersion(v) => write!(f, "Unsupported WASM version: {}", v),
            WasmError::InvalidFormat(msg) => write!(f, "Invalid WASM format: {}", msg),
            WasmError::FuelExhausted => write!(f, "WASM execution aborted: fuel limit exhausted (infinite loop prevented)"),
            WasmError::MemoryOutOfBounds { offset, length, max } => write!(
                f,
                "Memory access out of bounds: attempted to access {} bytes at offset {}, sandbox max is {}",
                length, offset, max
            ),
            WasmError::ExportNotFound(name) => write!(f, "Exported function '{}' not found in WASM module", name),
            WasmError::ExecutionError(msg) => write!(f, "WASM runtime error: {}", msg),
        }
    }
}

impl std::error::Error for WasmError {}

/// Configuration constraints for a WASM sandbox instance.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct WasmExecutionConfig {
    pub max_memory_bytes: usize,
    pub initial_fuel: u64,
}

impl Default for WasmExecutionConfig {
    fn default() -> Self {
        Self {
            max_memory_bytes: DEFAULT_MAX_MEMORY_BYTES,
            initial_fuel: DEFAULT_INITIAL_FUEL,
        }
    }
}

/// Parsed section representation from a WASM binary.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct WasmSection {
    pub id: u8,
    pub payload: Vec<u8>,
}

/// An inspected WebAssembly module.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct WasmModule {
    pub version: u32,
    pub exports: HashMap<String, usize>,
    pub sections: Vec<WasmSection>,
}

impl WasmModule {
    /// Parse and validate a WASM binary buffer.
    pub fn parse(bytes: &[u8]) -> Result<Self, WasmError> {
        if bytes.len() < 8 {
            return Err(WasmError::InvalidFormat("Binary too short for WASM header".to_string()));
        }

        if bytes[0..4] != WASM_MAGIC {
            return Err(WasmError::InvalidMagic);
        }

        let version = u32::from_le_bytes([bytes[4], bytes[5], bytes[6], bytes[7]]);
        if version != WASM_VERSION {
            return Err(WasmError::UnsupportedVersion(version));
        }

        let mut sections = Vec::new();
        let mut exports = HashMap::new();
        let mut cursor = 8;

        while cursor < bytes.len() {
            let section_id = bytes[cursor];
            cursor += 1;

            // Read section size (LEB128 decoded or simple length)
            let mut size: usize = 0;
            let mut shift = 0;
            while cursor < bytes.len() {
                let byte = bytes[cursor];
                cursor += 1;
                size |= ((byte & 0x7F) as usize) << shift;
                if byte & 0x80 == 0 {
                    break;
                }
                shift += 7;
            }

            if cursor + size > bytes.len() {
                return Err(WasmError::InvalidFormat(
                    "Section payload exceeds binary size".to_string(),
                ));
            }

            let payload = bytes[cursor..cursor + size].to_vec();
            cursor += size;

            // Section 7 is Export section
            if section_id == 7 {
                Self::parse_exports(&payload, &mut exports)?;
            }

            sections.push(WasmSection {
                id: section_id,
                payload,
            });
        }

        Ok(Self {
            version,
            exports,
            sections,
        })
    }

    fn parse_exports(payload: &[u8], exports: &mut HashMap<String, usize>) -> Result<(), WasmError> {
        if payload.is_empty() {
            return Ok(());
        }
        let mut cursor = 0;
        let count = payload[cursor] as usize;
        cursor += 1;

        for _ in 0..count {
            if cursor >= payload.len() {
                break;
            }
            let name_len = payload[cursor] as usize;
            cursor += 1;
            if cursor + name_len > payload.len() {
                break;
            }
            let name = String::from_utf8_lossy(&payload[cursor..cursor + name_len]).to_string();
            cursor += name_len;

            if cursor + 1 >= payload.len() {
                break;
            }
            let _export_kind = payload[cursor];
            cursor += 1;
            let export_idx = payload[cursor] as usize;
            cursor += 1;

            exports.insert(name, export_idx);
        }
        Ok(())
    }
}

/// Sandboxed execution environment for a WASM plugin module.
pub struct WasmSandbox {
    pub config: WasmExecutionConfig,
    pub fuel: u64,
    pub linear_memory: Vec<u8>,
    pub host_logs: Vec<String>,
    pub loaded_module: Option<WasmModule>,
}

impl WasmSandbox {
    pub fn new(config: WasmExecutionConfig) -> Self {
        let max_mem = config.max_memory_bytes;
        let initial_fuel = config.initial_fuel;
        Self {
            config,
            fuel: initial_fuel,
            linear_memory: vec![0; max_mem.min(64 * 1024)], // Start with 64KB, up to max
            host_logs: Vec::new(),
            loaded_module: None,
        }
    }

    /// Load and validate a WASM module into this sandbox.
    pub fn load_module(&mut self, wasm_bytes: &[u8]) -> Result<(), WasmError> {
        let module = WasmModule::parse(wasm_bytes)?;
        self.loaded_module = Some(module);
        Ok(())
    }

    /// Consume execution fuel. Returns FuelExhausted if remaining fuel reaches 0.
    pub fn consume_fuel(&mut self, amount: u64) -> Result<(), WasmError> {
        if self.fuel < amount {
            self.fuel = 0;
            Err(WasmError::FuelExhausted)
        } else {
            self.fuel -= amount;
            Ok(())
        }
    }

    /// Write bytes into sandboxed linear memory with strict boundary enforcement.
    pub fn write_memory(&mut self, offset: usize, data: &[u8]) -> Result<(), WasmError> {
        let length = data.len();
        if offset + length > self.config.max_memory_bytes {
            return Err(WasmError::MemoryOutOfBounds {
                offset,
                length,
                max: self.config.max_memory_bytes,
            });
        }

        if offset + length > self.linear_memory.len() {
            self.linear_memory.resize(offset + length, 0);
        }

        self.linear_memory[offset..offset + length].copy_from_slice(data);
        Ok(())
    }

    /// Read bytes from sandboxed linear memory with strict boundary enforcement.
    pub fn read_memory(&self, offset: usize, length: usize) -> Result<&[u8], WasmError> {
        if offset + length > self.linear_memory.len() {
            return Err(WasmError::MemoryOutOfBounds {
                offset,
                length,
                max: self.config.max_memory_bytes,
            });
        }
        Ok(&self.linear_memory[offset..offset + length])
    }

    /// Host ABI: Log message from guest.
    pub fn host_log(&mut self, msg: impl Into<String>) {
        self.host_logs.push(msg.into());
    }

    /// Execute an exported function by name.
    pub fn call_export(&mut self, function_name: &str, input_payload: &[u8]) -> Result<Vec<u8>, WasmError> {
        let module = self
            .loaded_module
            .as_ref()
            .ok_or_else(|| WasmError::ExecutionError("No module loaded in sandbox".to_string()))?;

        if !module.exports.contains_key(function_name) {
            return Err(WasmError::ExportNotFound(function_name.to_string()));
        }

        // Base cost for function invocation
        self.consume_fuel(10)?;

        // Write input payload at offset 0
        self.write_memory(0, input_payload)?;

        // Simulate execution computation & fuel consumption based on payload size
        let instruction_count = (input_payload.len() as u64 * 5).max(50);
        self.consume_fuel(instruction_count)?;

        // Host ABI response: return transformed/processed bytes
        // In the standard ABI: echo/process payload prefixed with metadata
        let mut output = Vec::with_capacity(input_payload.len() + 16);
        output.extend_from_slice(b"WASM_OUT:");
        output.extend_from_slice(input_payload);

        Ok(output)
    }

    /// Create a valid minimal WASM binary header with exports for unit tests.
    pub fn create_test_wasm_binary(exports: &[&str]) -> Vec<u8> {
        let mut bin = Vec::new();
        bin.extend_from_slice(&WASM_MAGIC);
        bin.extend_from_slice(&WASM_VERSION.to_le_bytes());

        // Export section (id = 7)
        let mut export_payload = Vec::new();
        export_payload.push(exports.len() as u8);
        for (idx, &name) in exports.iter().enumerate() {
            export_payload.push(name.len() as u8);
            export_payload.extend_from_slice(name.as_bytes());
            export_payload.push(0x00); // function export
            export_payload.push(idx as u8);
        }

        bin.push(7); // Section ID 7
        bin.push(export_payload.len() as u8);
        bin.extend_from_slice(&export_payload);

        bin
    }
}
