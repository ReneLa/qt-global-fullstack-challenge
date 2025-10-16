import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createSign, generateKeyPairSync } from "crypto";

// ES module __dirname workaround
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KEYS_DIR =
  process.env.KEY_PATH || path.join(__dirname, "..", "..", "keys");
const PRIVATE_KEY_PATH = path.join(KEYS_DIR, "private.pem");
const PUBLIC_KEY_PATH = path.join(KEYS_DIR, "public.pem");

// Generate RSA key pair if not already present
export function initializeKeys() {
  if (!existsSync(KEYS_DIR)) {
    mkdirSync(KEYS_DIR, { recursive: true });
  }

  if (!existsSync(PRIVATE_KEY_PATH) || !existsSync(PUBLIC_KEY_PATH)) {
    const { privateKey, publicKey } = generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs1", format: "pem" }
    });

    writeFileSync(PRIVATE_KEY_PATH, privateKey);
    writeFileSync(PUBLIC_KEY_PATH, publicKey);
  }
}

// Retrieve the public key for verification
export function getPublicKeyPem() {
  return readFileSync(PUBLIC_KEY_PATH, "utf8");
}

// Sign a hex hash with the private key using RSA-SHA384
export function signHash(hexHash: string) {
  const privateKey = readFileSync(PRIVATE_KEY_PATH, "utf8");
  const sign = createSign("RSA-SHA384");
  sign.update(hexHash);
  sign.end();

  const signature = sign.sign(privateKey, "base64");
  return signature;
}
