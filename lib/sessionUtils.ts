import { NextRequest, NextResponse } from "next/server";
import { decrypt, encrypt } from "./utils";
import { cookies } from "next/headers";

export const getSession = async (): Promise<{
  decrypted: any;
  token: string;
} | null> => {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return { decrypted: await decrypt(session), token: session };
};

export const updateSession = async (request: NextRequest) => {
  const session = request.cookies.get("session")?.value;

  if (!session) return;

  const parsedSession = await decrypt(session);
  parsedSession.expires = new Date(Date.now() + 10 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsedSession),
    httpOnly: true,
    expires: parsedSession.expires,
  });

  return res;
};
