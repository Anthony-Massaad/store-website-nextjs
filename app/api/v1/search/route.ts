import prismaInstance from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const queryParams = url.searchParams;

  const query = queryParams.get("query");
  const operation = queryParams.get("operation");

  if (!query || !operation) {
    return new Response(JSON.stringify({ msg: "Invalid params" }), {
      status: 404,
    });
  }

  try {
    if (operation === "limit") {
      const nameResults = await prismaInstance.product.findMany({
        where: {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        take: 10,
      });

      if (nameResults.length >= 5) {
        return new Response(JSON.stringify(nameResults), { status: 200 });
      }

      const descriptionResults = await prismaInstance.product.findMany({
        where: {
          AND: [
            {
              description: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              id: {
                notIn: nameResults.map((product) => product.id),
              },
            },
          ],
        },
        take: 10 - nameResults.length,
      });

      const combinedResults = [...nameResults, ...descriptionResults];

      return new Response(JSON.stringify(combinedResults), { status: 200 });
    } else if (operation === "all") {
      const allResults = await prismaInstance.product.findMany({
        where: {
          OR: [
            {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
        },
      });

      return new Response(JSON.stringify(allResults), { status: 200 });
    } else {
      return new Response(JSON.stringify({ msg: "Invalid operation" }), {
        status: 404,
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ msg: "Internal Server Error" }), {
      status: 500,
    });
  }
}
