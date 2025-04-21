
/**
 * Static GLOBAL E2EE key/IV for use in the public chat room.
 * For demonstration ONLY. Rotate and store securely in production use.
 */

// Example: 256-bit AES-GCM key/IV
export const GLOBAL_E2EE_KEY = JSON.stringify({
  kty: "oct",
  alg: "A256GCM",
  ext: true,
  k: "Cf5QwH_q4mf1Ws8tNf1rTMkxlJAYuf9K5Tfa2Q2VrQw", // base64-encoded for test
});
export const GLOBAL_E2EE_IV = "uFzR8Z0O36trKk1F"; // base64-encoded example, 12 bytes

