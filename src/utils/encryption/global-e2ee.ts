
// This file contains the global encryption keys for the public chat room

// Global E2EE key (never expose in non-compiled code in a real app)
export const GLOBAL_E2EE_KEY = '{"alg":"A256GCM","ext":true,"k":"xmcXQ9yJgUBYj8p1_X28v_iP-UBeC9mQYm1_iBZ5CWs","key_ops":["encrypt","decrypt"],"kty":"oct"}';

// Global E2EE initialization vector (never expose in non-compiled code in a real app)
export const GLOBAL_E2EE_IV = new Uint8Array([12, 45, 99, 23, 235, 111, 90, 188, 76, 108, 55, 33]).buffer;
