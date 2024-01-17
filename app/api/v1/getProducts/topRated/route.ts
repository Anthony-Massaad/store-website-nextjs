import { ProductsData } from "@/interface/globalInterfaces";
import prismaInstance from "@/lib/prisma";
import { isEmpty } from "lodash";

export async function GET(request: Request) {
  const products: ProductsData[] = await prismaInstance.product.findMany({
    orderBy: {
      rating: "desc",
    },
    take: 10,
  });
  if (isEmpty(products))
    return new Response("Something went wrong getting the top rated products", {
      status: 400,
    });
  return new Response(JSON.stringify(products));
}
