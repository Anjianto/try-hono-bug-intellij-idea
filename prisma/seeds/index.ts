import { PrismaClient } from "@prisma/client";

import { categoriesData, type Category } from "./categoriesData";

const prisma = new PrismaClient();

const createOrUpdateChildCategories = async (
  parentId: number,
  data: NonNullable<Category["children"]>[number][],
) => {
  const parentCategory = await prisma.category.findUnique({
    where: { id: parentId },
  });

  if (!parentCategory) {
    return;
  }

  for (const childCategory of data) {
    const currentChildCategory = await prisma.category.findUnique({
      where: { id: childCategory.id },
    });

    const uniqueIdentifier = `${parentCategory.name}_${childCategory.name}`;

    if (!currentChildCategory) {
      await prisma.category.create({
        data: {
          id: childCategory.id,
          name: childCategory.name,
          color: parentCategory.color,
          parentId: parentCategory.id,
          uniqueIdentifier,
        },
      });
      continue;
    }

    if (
      currentChildCategory.name !== childCategory.name ||
      currentChildCategory.color !== parentCategory.color ||
      currentChildCategory.uniqueIdentifier !== uniqueIdentifier
    ) {
      await prisma.category.update({
        where: { id: childCategory.id },
        data: {
          id: childCategory.id,
          name: childCategory.name,
          color: parentCategory.color,
          parentId: parentCategory.id,
          uniqueIdentifier,
        },
      });
    }
  }
};

async function main() {
  for (const category of categoriesData) {
    const currentCategory = await prisma.category.findUnique({
      where: { id: category.id },
    });

    if (!currentCategory) {
      await prisma.category.create({
        data: {
          id: category.id,
          name: category.name,
          color: category.color,
          uniqueIdentifier: category.name,
        },
      });

      if ((category.children?.length || 0) > 0) {
        await createOrUpdateChildCategories(category.id, category.children!);
      }

      continue;
    }

    if (
      currentCategory.name !== category.name ||
      currentCategory.color !== category.color
    ) {
      await prisma.category.update({
        where: { id: category.id },
        data: {
          id: category.id,
          name: category.name,
          color: category.color,
          uniqueIdentifier: category.name,
        },
      });

      if ((category.children?.length || 0) > 0) {
        await createOrUpdateChildCategories(category.id, category.children!);
      }

      continue;
    }

    if ((category.children?.length || 0) > 0) {
      await createOrUpdateChildCategories(category.id, category.children!);
    }
  }
}

main()
  .catch((e) => console.log(e))
  .finally(() => {
    prisma.$disconnect();
  });
