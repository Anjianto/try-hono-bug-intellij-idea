import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "vitest-mock-extended";
import { beforeEach, vi } from "vitest";

import { prisma } from "src/db";

vi.mock("src/db", () => ({
  prisma: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = prisma as DeepMockProxy<PrismaClient>;
