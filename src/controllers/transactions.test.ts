import { describe, it } from "vitest";
import { getMockReq, getMockRes } from "vitest-mock-express";

import {
  createTransaction,
  deleteTransactionById,
  getTransactionById,
  transactions,
  updateTransactionById,
} from "./transactions";
import { prismaMock } from "src/utils/test/prisma-singleton";

const { res, next, clearMockRes } = getMockRes({});

const transDate = Date.now();
const transDateBigInt = BigInt(transDate);

describe("transactions", () => {
  it("returns transactions correctly", async ({ expect }) => {
    const req = getMockReq();

    const transactionsList = [
      {
        id: 1,
        name: "dummy data",
        description: "dummy data",
        amount: 100,
        categoryId: 1,
        transDate: transDateBigInt,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    prismaMock.transaction.findMany.mockResolvedValue(transactionsList);

    await transactions(req, res, next);
    expect(prismaMock.transaction.findMany).toBeCalledWith();
    expect(res.json).toBeCalledWith(transactionsList);

    clearMockRes();
  });
});

describe("createTransaction", () => {
  it("creates a transaction successfully", async ({ expect }) => {
    const bodyData = {
      name: "New Transaction",
      description: "This is a new transaction",
      amount: 200,
      categoryId: 2,
      transDate,
    };

    const req = getMockReq({
      body: bodyData,
    });

    const newTransaction = {
      id: 2,
      name: "New Transaction",
      description: "This is a new transaction",
      amount: 200,
      categoryId: 2,
      transDate: transDateBigInt,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.transaction.create.mockResolvedValue(newTransaction);

    await createTransaction(req, res, next);

    const prismaCreate = {
      name: bodyData.name,
      description: bodyData.description,
      amount: bodyData.amount,
      categoryId: bodyData.categoryId,
      transDate: bodyData.transDate,
    };

    expect(prismaMock.transaction.create).toBeCalledWith({
      data: prismaCreate,
    });
    expect(res.status).toBeCalledWith(201);
    expect(res.json).toBeCalledWith({
      data: newTransaction,
      message: "Successfully created transaction",
      errors: null,
    });
    clearMockRes();
  });

  it("returns 400 if required fields are missing", async ({ expect }) => {
    const req = getMockReq({
      body: {
        name: "", // Missing required fields
        description: "",
        amount: null,
        categoryId: null,
      },
    });

    await createTransaction(req, res, next);

    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith(expect.anything());

    clearMockRes();
  });
});

describe("getTransactionById", () => {
  it("retrieves a transaction by ID successfully", async ({ expect }) => {
    const req = getMockReq({
      params: { id: "1" }, // Passing ID as a parameter
    });

    const transaction = {
      id: 1,
      name: "dummy data",
      description: "dummy data",
      amount: 100,
      categoryId: 1,
      transDate: transDateBigInt,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.transaction.findUnique.mockResolvedValue(transaction);

    await getTransactionById(req, res, next);

    expect(prismaMock.transaction.findUnique).toBeCalledWith({
      where: { id: 1 },
    });
    expect(res.json).toBeCalledWith(transaction);

    clearMockRes();
  });

  it("returns 404 if transaction is not found", async ({ expect }) => {
    const req = getMockReq({
      params: { id: "1" },
    });

    prismaMock.transaction.findUnique.mockResolvedValue(null); // Simulating no result

    await getTransactionById(req, res, next);

    expect(prismaMock.transaction.findUnique).toBeCalledWith({
      where: { id: 1 },
    });
    expect(res.status).toBeCalledWith(404);
    expect(res.json).toBeCalledWith({
      message: "Transaction not found",
      data: null,
      errors: null,
    });

    clearMockRes();
  });

  it("returns 400 if ID is invalid", async ({ expect }) => {
    const req = getMockReq({
      params: { id: "invalid-id" }, // Invalid parameter passed
    });

    await getTransactionById(req, res, next);

    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({
      message: "Invalid id",
      data: null,
      errors: null,
    });

    clearMockRes();
  });
});

describe("updateTransactionById", () => {
  it("updates a transaction successfully", async ({ expect }) => {
    const req = getMockReq({
      params: { id: "1" },
      body: {
        name: "Updated Transaction",
        description: "This is an updated transaction",
        amount: 150,
        categoryId: 3,
        transDate,
      },
    });

    const updatedTransaction = {
      id: 1,
      name: "Updated Transaction",
      description: "This is an updated transaction",
      amount: 150,
      categoryId: 3,
      transDate: transDateBigInt,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.transaction.findUnique.mockResolvedValue(updatedTransaction);
    prismaMock.transaction.update.mockResolvedValue(updatedTransaction);

    await updateTransactionById(req, res, next);

    expect(prismaMock.transaction.update).toBeCalledWith({
      where: { id: 1 },
      data: req.body,
    });

    expect(res.json).toBeCalledWith({
      data: updatedTransaction,
      errors: null,
      message: "Successfully updated transaction",
    });
    clearMockRes();
  });

  it("returns 404 if transaction to update does not exist", async ({
    expect,
  }) => {
    const req = getMockReq({
      params: { id: "1" },
      body: {
        name: "Non-existent Transaction",
        description: "This transaction does not exist",
        amount: 50,
        categoryId: 5,
        transDate: Date.now(),
      },
    });

    await updateTransactionById(req, res, next);

    expect(res.status).toBeCalledWith(404);
    expect(res.json).toBeCalledWith({
      message: "Transaction not found",
      data: null,
      errors: null,
    });

    clearMockRes();
  });

  it("returns 400 if invalid ID is provided", async ({ expect }) => {
    const req = getMockReq({
      params: { id: "invalid-id" },
      body: {
        name: "Invalid ID Transaction",
        description: "Invalid ID provided",
        amount: 200,
        categoryId: 4,
        transDate: Date.now(),
      },
    });

    await updateTransactionById(req, res, next);

    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({
      message: "Invalid id",
      data: null,
      errors: null,
    });

    clearMockRes();
  });

  it("returns 400 if required fields are missing in update data", async ({
    expect,
  }) => {
    const req = getMockReq({
      params: { id: "1" },
      body: {
        name: "", // Missing required fields
        description: "",
        amount: null,
        categoryId: null,
      },
    });

    await updateTransactionById(req, res, next);

    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({
      message: "Invalid input provided",
      data: null,
      errors: expect.anything(),
    });

    clearMockRes();
  });

  it("returns 400 if invalid data types are provided", async ({ expect }) => {
    const req = getMockReq({
      params: { id: "1" },
      body: {
        name: 123, // Invalid type
        description: true, // Invalid type
        amount: "invalid", // Invalid type
        categoryId: "wrong-type", // Invalid type
      },
    });

    await updateTransactionById(req, res, next);

    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({
      message: "Invalid input provided",
      data: null,
      errors: expect.anything(),
    });

    clearMockRes();
  });
});

describe("deleteTransactionById", () => {
  it("deletes a transaction successfully", async ({ expect }) => {
    const req = getMockReq({
      params: { id: "1" }, // Passing ID as a parameter
    });

    const transaction = {
      id: 1,
      name: "Deleted Transaction",
      description: "This transaction was deleted",
      amount: 100,
      categoryId: 2,
      transDate: transDateBigInt,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.transaction.findUnique.mockResolvedValue(transaction);
    prismaMock.transaction.delete.mockResolvedValue(transaction); // Mocking successful deletion

    await deleteTransactionById(req, res, next);

    expect(prismaMock.transaction.delete).toBeCalledWith({
      where: { id: 1 },
    });

    expect(res.json).toBeCalledWith({
      data: null,
      errors: null,
      message: "Successfully deleted transaction",
    });

    clearMockRes();
  });

  it("returns 404 if transaction to delete does not exist", async ({
    expect,
  }) => {
    const req = getMockReq({
      params: { id: "1" }, // Passing ID as a parameter
    });

    await deleteTransactionById(req, res, next);

    expect(res.status).toBeCalledWith(404);
    expect(res.json).toBeCalledWith({
      message: "Transaction not found",
      data: null,
      errors: null,
    });

    clearMockRes();
  });

  it("returns 400 if invalid ID is provided", async ({ expect }) => {
    const req = getMockReq({
      params: { id: "invalid-id" },
    });

    await deleteTransactionById(req, res, next);

    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({
      message: "Invalid id",
      data: null,
      errors: null,
    });

    clearMockRes();
  });
});
