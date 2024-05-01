import { UserData } from "@/interface/globalInterfaces";
import prismaInstance from "@/lib/prisma";

export async function POST(request: Request) {
  const { id, email, username, firstName, lastName, address } =
    await request.json();

  try {
    const user = await prismaInstance.user.update({
      where: { id },
      data: {
        email,
        username,
        firstName,
        lastName,
        address,
      },
    });

    const userData: UserData = {
      id: id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
    };

    return new Response(
      JSON.stringify({
        msg: "Success in user update",
        success: true,
        userData: userData,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        msg: "Something went wrong updating the user",
        success: false,
      }),
      { status: 500 }
    );
  }
}
