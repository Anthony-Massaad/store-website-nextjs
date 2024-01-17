import { ProductsData } from "@/interface/globalInterfaces";
import prismaInstance from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { category: string } }
) {
  if (params.category) {
    const products: ProductsData[] = await prismaInstance.product.findMany({
      where: {
        category: params.category,
      },
    });
    return new Response(JSON.stringify(products), {
      status: 200,
    });
  }
  return new Response("Something went wrong retrieving data", { status: 400 });
}
