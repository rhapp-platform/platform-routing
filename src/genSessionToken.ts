import { decode, sign, verify } from "hono/jwt";

interface GenSessionToken {
  ag: string;
  an: string;
  aid: string;
  pl: number;
  reg: string;
}

const RH_SESSION_JWT_SECRET = "rush64counter648hua26gxitrocks";

export default async function genSessionToken({
  ag,
  an,
  aid = "xxxxx",
  pl = 0,
  reg = "enam",
}: GenSessionToken): Promise<string> {
  const sid = crypto.randomUUID();
  const payload = {
    sid: sid,
    ag: ag,
    an: an,
    aid: aid,
    pl: pl,
    reg: reg,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8, // Token expires in 8 hours
  };
  const sessionToken = await sign(payload, RH_SESSION_JWT_SECRET);
  return { sessionToken, sid };
}
