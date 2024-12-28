import { beforeEach, describe, expect, it } from "vitest";
import { categories } from "src/controllers/categories";
import { getMockReq, getMockRes } from "vitest-mock-express";
import { prismaMock } from "src/utils/test/prisma-singleton";

const { res, next, clearMockRes } = getMockRes();

describe("categories", () => {
  beforeEach(() => {
    clearMockRes();
  });

  it("should return expected categories", async () => {
    const req = getMockReq();

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

    await categories(req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      message: "Successfully get categories",
      data: mockCategoriesData,
      errors: null,
    });
  });
});
