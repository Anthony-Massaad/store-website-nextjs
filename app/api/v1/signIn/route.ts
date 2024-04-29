import prismaInstance from "@/lib/prisma";

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

  return new Response(JSON.stringify("Good Credentials"), { status: 200 });
}
