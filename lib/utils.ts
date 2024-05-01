"use server";
import { JwtPayload } from "jsonwebtoken";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { UserData } from "@/interface/globalInterfaces";

const key = new TextEncoder().encode(process.env.SECRET_KEY as string);

export const logoutFunc = async () => {
  cookies().set("session", "", { expires: new Date(0) });
};

export const loginFunc = async (formData: UserData) => {
  const user: UserData = {
    email: formData.email,
    id: formData.id,
    username: formData.username,
    address: formData.address,
    firstName: formData.firstName,
    lastName: formData.lastName,
  };
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

export const changeUserDataSession = async (data: UserData) => {
  const user: UserData = {
    email: data.email,
    id: data.id,
    username: data.username,
    address: data.address,
    firstName: data.firstName,
    lastName: data.lastName,
  };
  const expires = new Date(Date.now() + 10 * 1000);
  const session = await encrypt({ user, expires });
  // read only in the server
  cookies().set("session", session, { expires, httpOnly: true });
};
