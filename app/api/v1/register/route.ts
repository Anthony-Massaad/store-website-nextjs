import prismaInstance from "@/lib/prisma";

export async function POST(request: Request) {
  const {
    username,
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    address,
  } = await request.json();

  const user = await prismaInstance.user.findUnique({
    where: { email: email },
  });

  if (user) {
    return new Response(
      JSON.stringify({ msg: "Email Already Taken", success: false }),
      { status: 200 }
    );
  }

  await prismaInstance.user.create({
    data: {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      username: username,
      address: address,
      cart: {
        create: {
          cartItems: {
            create: [],
          },
        },
      },
    },
  });

  return new Response(
    JSON.stringify({ msg: "Registered Account", success: true }),
    { status: 200 }
  );
}
