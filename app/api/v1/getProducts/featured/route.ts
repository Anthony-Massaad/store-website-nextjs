import { ProductsData } from "@/interface/globalInterfaces";
import prismaInstance from "@/lib/prisma";
import { isEmpty } from "lodash";

export async function GET(request: Request) {
  const products: ProductsData[] = await prismaInstance.product.findMany({
    orderBy: {
      price: "desc",
    },
    take: 2,
  });
  if (!isEmpty(products))
    new Response("Something went wrong getting featured products", {
      status: 400,
    });
  return new Response(JSON.stringify(products));
}
