export function importPublicKey(pem: string) {
  console.log("Raw PEM:", pem);
  const b64 = pem
    .replace(/-----BEGIN PUBLIC KEY-----/g, "")
    .replace(/-----END PUBLIC KEY-----/g, "")
    .replace(/\s/g, "");
  console.log("Extracted base64:", b64);

  // Validate base64 string
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  if (!base64Regex.test(b64)) {
    throw new Error(`Invalid base64 string: ${b64.substring(0, 50)}...`);
  }

  const binaryDer = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey(
    "spki",
    binaryDer.buffer,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: { name: "SHA-384" }
    },
    false,
    ["verify"]
  );
}

export async function verifySignature(
  publicKey: CryptoKey,
  messageHex: string,
  signatureBase64: string
) {
  // The backend signs the hex string as UTF-8 text
  const encoder = new TextEncoder();
  const data = encoder.encode(messageHex);

  const sig = Uint8Array.from(atob(signatureBase64), (c) =>
    c.charCodeAt(0)
  ).buffer;

  try {
    const result = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      publicKey,
      sig,
      data
    );

    return result;
  } catch (error) {
    return false;
  }
}
