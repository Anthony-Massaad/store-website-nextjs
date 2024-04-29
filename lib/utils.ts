"use server";
import { JwtPayload } from "jsonwebtoken";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const key = new TextEncoder().encode(process.env.SECRET_KEY as string);

interface DefaultFormValues {
  email: string;
  password: string;
}

export const logoutFunc = async () => {
  cookies().set("session", "", { expires: new Date(0) });
};

export const loginFunc = async (formData: DefaultFormValues) => {
  const user = { email: formData.email };
  const expires = new Date(Date.now() + 10 * 1000);
  const session = await encrypt({ user, expires });
  // read only in the server
  cookies().set("session", session, { expires, httpOnly: true });
};

export async function encrypt(payload: JwtPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1 hour from now")
    .sign(key);
}

export async function decrypt(token: string): Promise<any> {
  const { payload } = await jwtVerify(token, key, {
    algorithms: ["HS256"],
  });
  return payload;
}
