import prismaInstance from "@/lib/prisma";

export async function POST(request: Request) {
  const { userId, productId } = await request.json();

  try {
    const cart = await prismaInstance.cart.findUnique({ where: { userId } });

    if (!cart) {
      return new Response(JSON.stringify({ msg: "Cart not found" }), {
        status: 404,
      });
    }

    const product = await prismaInstance.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return new Response(JSON.stringify({ msg: "product Not found" }), {
        status: 404,
      });
    }

    await prismaInstance.cartItem.create({
      data: {
        product: { connect: { id: productId } },
        cart: { connect: { id: cart.id } },
        quantity: 1,
      },
    });

    return new Response(
      JSON.stringify({ msg: "Item added to cart successfully" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ msg: "Internal error" }), {
      status: 500,
    });
  }
}
