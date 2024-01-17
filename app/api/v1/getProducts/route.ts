import { ProductsData } from "@/interface/globalInterfaces";
import prismaInstance from "@/lib/prisma";

// get all the products
export async function GET(request: Request) {
  const products: ProductsData[] = await prismaInstance.product.findMany();
  if (!products)
    return new Response("Oops something went wrong getting all the products!", {
      status: 400,
    });
  return new Response(JSON.stringify(products), { status: 200 });
}
