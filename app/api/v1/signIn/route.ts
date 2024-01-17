import prismaInstance from "@/lib/prisma";
import { signJwtAccessToken } from "@/lib/jwt";
import { UserData } from "@/interface/globalInterfaces";

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
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
    address: user.address,
  });

  const userData: UserData = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
    address: user.address,
  };

  const result = {
    userData,
    accessToken,
  };

  return new Response(JSON.stringify(result), { status: 200 });
}
