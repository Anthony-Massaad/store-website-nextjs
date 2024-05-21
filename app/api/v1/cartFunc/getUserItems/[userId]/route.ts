import { ProductsData } from "@/interface/globalInterfaces";
import prismaInstance from "@/lib/prisma";
import { parseInt } from "lodash";

type CartItemsFormatted = {
  [key: number]: ProductsData;
};

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId);
    if (!userId) {
      return new Response(JSON.stringify({ msg: "User Id does not exist" }), {
        status: 404,
      });
    }

    const cart = await prismaInstance.cart.findUnique({
      where: { userId: userId },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      return new Response(JSON.stringify({ msg: "Cart does not exist" }), {
        status: 404,
      });
    }

    const cartItemsFormatted: CartItemsFormatted = cart.cartItems.reduce(
      (acc: CartItemsFormatted, item) => {
        acc[item.productId] = {
          ...item.product,
          quantity: item.quantity,
        };
        return acc;
      },
      {}
    );

    return new Response(JSON.stringify(cartItemsFormatted), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ msg: "Internal Server Error" }), {
      status: 500,
    });
  }
}
