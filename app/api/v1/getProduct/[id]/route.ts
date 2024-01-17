import prismaInstance from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const product = await prismaInstance.product.findUnique({
    where: {
      id: parseInt(params.id),
    },
  });
  if (!product)
    return new Response(
      `Something went wrong retrieving a product. id: ${params.id}`,
      { status: 400 }
    );
  return new Response(JSON.stringify(product), { status: 200 });
}
