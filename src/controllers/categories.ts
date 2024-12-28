import { Handler } from "express";

import { prisma } from "src/db";

export const categories: Handler = async (req, res) => {
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

  res.json({
    message: "Successfully get categories",
    data: categories,
    errors: null,
  });
};
