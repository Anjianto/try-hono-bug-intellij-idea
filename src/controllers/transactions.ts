import { Handler } from "express";

import { prisma } from "src/db";
import {
  transactionSchema,
  updateTransactionSchema,
} from "src/schema/transactions";
import { validate } from "src/utils/validate";

export const transactions: Handler = async (req, res) => {
  const transactions = await prisma.transaction.findMany();
  res.json(transactions);
};

export const createTransaction: Handler = async (req, res) => {
  const resultSchema = await validate(transactionSchema, req.body);

  if (!resultSchema.success) {
    res.status(400).json({ data: null, errors: resultSchema.errors });
    return;
  }

  const result = await prisma.transaction.create({ data: resultSchema.data });

  res.status(201).json({
    message: "Successfully created transaction",
    data: result,
    errors: null,
  });
};

const findTransactionById = async (id: number) => {
  return prisma.transaction.findUnique({ where: { id } });
};

export const getTransactionById: Handler = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res
      .status(400)
      .json({ message: "Invalid id", errors: null, data: null });
  }

  const transaction = await findTransactionById(id);

  if (!transaction) {
    return res
      .status(404)
      .json({ message: "Transaction not found", errors: null, data: null });
  }

  res.json(transaction);
};

export const updateTransactionById: Handler = async (req, res) => {
  const resultSchema = await validate(updateTransactionSchema, req.body);

  if (!resultSchema.success) {
    res.status(400).json({
      message: "Invalid input provided",
      errors: resultSchema.errors,
      data: null,
    });
    return;
  }

  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res
      .status(400)
      .json({ message: "Invalid id", errors: null, data: null });
  }

  const transactions = await findTransactionById(id);

  if (!transactions) {
    return res
      .status(404)
      .json({ message: "Transaction not found", data: null, errors: null });
  }

  const result = await prisma.transaction.update({
    where: { id: parseInt(req.params.id, 10) },
    data: resultSchema.data,
  });

  res.json({
    message: "Successfully updated transaction",
    data: result,
    errors: null,
  });
};

export const deleteTransactionById: Handler = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res
      .status(400)
      .json({ message: "Invalid id", errors: null, data: null });
  }

  const transactions = await findTransactionById(id);

  if (!transactions) {
    res
      .status(404)
      .json({ message: "Transaction not found", data: null, errors: null });
    return;
  }

  await prisma.transaction.delete({
    where: { id },
  });

  res.json({
    message: "Successfully deleted transaction",
    data: null,
    errors: null,
  });
};
