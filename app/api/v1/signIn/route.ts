import prismaInstance from "@/lib/prisma";
import { signJwtAccessToken } from "@/lib/jwt";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (!email || !password)
    return new Response("Bad Credentials", { status: 400 });

  const user = await prismaInstance.user.findUnique({
    where: { email: email },
  });

  if (!user || user.password !== password) {
    return new Response("Bad Credentials", { status: 400 });
  }

  // generate token and send to the client
  const accessToken = signJwtAccessToken({
    id: user.id,
    email: user.email,
    username: user.username,
    firtname: user.firstName,
    lastName: user.lastName,
  });

  const result = {
    accessToken,
  };

  return new Response(JSON.stringify(result), { status: 200 });
}
