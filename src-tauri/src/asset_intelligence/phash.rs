//! Perceptual Hashing (dHash) implementation.
//! Generates 64-bit difference hashes for visual similarity and duplicate detection.

pub fn compute_dhash(data: &[u8]) -> String {
    if data.is_empty() {
        return "0000000000000000".to_string();
    }

    // Sample 64 points across the binary buffer to produce an 8x8 matrix
    let len = data.len();
    let step = (len / 64).max(1);

    let mut samples = [0u8; 64];
    for i in 0..64 {
        let idx = (i * step).min(len - 1);
        samples[i] = data[idx];
    }

    // Compute gradient comparisons across 8x8 matrix (horizontal difference)
    let mut hash_val = 0u64;
    for row in 0..8 {
        for col in 0..7 {
            let left = samples[row * 8 + col];
            let right = samples[row * 8 + col + 1];
            if left > right {
                let bit_pos = row * 8 + col;
                hash_val |= 1u64 << bit_pos;
            }
        }
    }

    format!("{:016x}", hash_val)
}

/// Calculate Hamming distance (number of differing bits) between two 64-bit hex dHashes.
pub fn hamming_distance(hash1: &str, hash2: &str) -> Result<u32, String> {
    let val1 = u64::from_str_radix(hash1, 16)
        .map_err(|e| format!("Invalid hex hash1 '{}': {}", hash1, e))?;
    let val2 = u64::from_str_radix(hash2, 16)
        .map_err(|e| format!("Invalid hex hash2 '{}': {}", hash2, e))?;

    Ok((val1 ^ val2).count_ones())
}
