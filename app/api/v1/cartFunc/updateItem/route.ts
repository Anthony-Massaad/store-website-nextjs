import prismaInstance from "@/lib/prisma";

export async function POST(request: Request) {
  const { userId, productId, operation } = await request.json();
  try {
    const cartItem = await prismaInstance.cartItem.findFirst({
      where: { cart: { userId }, productId },
    });

    if (!cartItem) {
      return new Response(JSON.stringify({ msg: "Cart item not found" }), {
        status: 404,
      });
    }

    if (operation === "increment") {
      await prismaInstance.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: cartItem.quantity + 1 },
      });
    } else if (operation === "decrement") {
      if (cartItem.quantity > 1) {
        await prismaInstance.cartItem.update({
          where: { id: cartItem.id },
          data: { quantity: cartItem.quantity - 1 },
        });
      } else {
        await prismaInstance.cartItem.delete({
          where: { id: cartItem.id },
        });
      }
    } else if (operation === "remove") {
      await prismaInstance.cartItem.delete({
        where: { id: cartItem.id },
      });
    } else {
      return new Response(JSON.stringify({ msg: "operation not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ msg: "updated item" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ msg: "Internal Server Error" }), {
      status: 500,
    });
  }
}
