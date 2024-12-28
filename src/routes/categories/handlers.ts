import type { AppRouteHandler } from "src/lib/types";
import type { GetCategoriesRoute } from "src/routes/categories/routes";
import { prisma } from "src/db";

export const categories: AppRouteHandler<GetCategoriesRoute> = async (c) => {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    select: {
      id: true,
      name: true,
      categories: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return c.json({
    message: "Successfully get categories",
    data: categories,
    errors: null,
  });
};
