import { UserData } from "@/interface/globalInterfaces";
import prismaInstance from "@/lib/prisma";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (!email || !password)
    return new Response("Bad Credentials", { status: 400 });

  const user = await prismaInstance.user.findUnique({
    where: { email: email },
  });

  if (!user || user.password !== password) {
    return new Response(
      JSON.stringify({ msg: "Bad Credentials", success: false }),
      { status: 200 }
    );
  }

  const userData: UserData = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    address: user.address,
    username: user.username,
  };

  return new Response(JSON.stringify({ msg: userData, success: true }), {
    status: 200,
  });
}
