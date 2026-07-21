/**
 * Password hashing via Web Crypto PBKDF2 — never store plaintext.
 * Same shape can be verified server-side later.
 */

const ITERATIONS = 120_000;
const HASH_BITS = 256;

function toBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary);
}

function fromBase64(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function deriveKey(
  password: string,
  salt: Uint8Array,
  iterations: number,
): Promise<ArrayBuffer> {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  return crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt as BufferSource,
      iterations,
      hash: "SHA-256",
    },
    baseKey,
    HASH_BITS,
  );
}

export async function hashPassword(password: string): Promise<{
  salt: string;
  hash: string;
  iterations: number;
}> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const bits = await deriveKey(password, salt, ITERATIONS);
  return {
    salt: toBase64(salt.buffer.slice(salt.byteOffset, salt.byteOffset + salt.byteLength)),
    hash: toBase64(bits),
    iterations: ITERATIONS,
  };
}

export async function verifyPassword(
  password: string,
  saltB64: string,
  hashB64: string,
  iterations: number,
): Promise<boolean> {
  const salt = fromBase64(saltB64);
  const expected = fromBase64(hashB64);
  const actual = new Uint8Array(await deriveKey(password, salt, iterations));
  if (actual.length !== expected.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < actual.length; i += 1) {
    diff |= actual[i]! ^ expected[i]!;
  }
  return diff === 0;
}
