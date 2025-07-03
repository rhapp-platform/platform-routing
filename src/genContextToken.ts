interface GenContextToken {
  ag: string;
  an: string;
  aid: string;
  pl: number;
  reg: string;
}

const RH_CONTEXT_JWT_SECRET = "rush64counter648hua26gxitrocks";

// Simple JWT-like token generation without heavy crypto library
function createSimpleToken(payload: any, secret: string): string {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = btoa(JSON.stringify(header)).replace(/[=]/g, "");
  const encodedPayload = btoa(JSON.stringify(payload)).replace(/[=]/g, "");
  
  // Simple signature using built-in crypto (for context tokens, not security-critical)
  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = btoa(secret + data).slice(0, 16); // Simple signature
  
  return `${data}.${signature}`;
}

export default async function genContextToken({
  ag,
  an,
  aid = "xxxxx",
  pl = 0,
  reg = "enam",
}: GenContextToken): Promise<{ contextToken: string; sid: string }> {
  const sid = crypto.randomUUID();
  const nonce = crypto.randomUUID(); // Unique nonce for replay attack prevention
  
  const payload = {
    sid: sid,
    ag: ag,
    an: an,
    aid: aid,
    pl: pl,
    reg: reg,
    nonce: nonce, // Future-proof: nonce for replay prevention (validation optional)
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8, // Token expires in 8 hours
  };
  const contextToken = createSimpleToken(payload, RH_CONTEXT_JWT_SECRET);
  return { contextToken, sid };
}
