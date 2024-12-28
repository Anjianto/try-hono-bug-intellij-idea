import { describe, expect, it } from "vitest";

import { categories } from "./handlers";
import { prismaMock } from "src/utils/test/prisma-singleton";
import { createMockContext, nextMock } from "src/lib/mock";

describe("categories", () => {
  it("should return expected categories", async () => {
    const cMock = createMockContext();

    const mockCategoriesData = [
      {
        id: 1,
        name: "Category 1",
        color: "blue",
        uniqueIdentifier: "Category 1",
        parentId: null,
        categories: [
          {
            id: 2,
            name: "Category 2",
          },
        ],
      },
    ];
    prismaMock.category.findMany.mockResolvedValue(mockCategoriesData);

    await categories(cMock, nextMock);

    expect(cMock.json).toHaveBeenCalledWith({
      message: "Successfully get categories",
      data: mockCategoriesData,
      errors: null,
    });
  });
});
