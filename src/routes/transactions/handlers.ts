import type { AppRouteHandler } from "src/lib/types";
import { prisma } from "src/db";
import type {
  CreateTransactionRoute,
  DeleteTransactionRoute,
  TransactionRoute,
  TransactionsRoute,
  UpdateTransactionRoute,
} from "src/routes/transactions/routes";
import { HttpStatusCodes } from "src/lib/http-status-codes";

export const transactions: AppRouteHandler<TransactionsRoute> = async (c) => {
  const transactions = await prisma.transaction.findMany();

  return c.json({
    message: "Successfully get transactions",
    data: transactions,
    errors: null,
  });
};

export const createTransaction: AppRouteHandler<
  CreateTransactionRoute
> = async (c) => {
  const validated = await c.req.valid("json");

  const result = await prisma.transaction.create({ data: validated });

  return c.json(
    {
      message: "Successfully created transaction",
      data: result,
      errors: null,
    },
    HttpStatusCodes.CREATED,
  );
};

const findTransactionById = async (id: number) => {
  return prisma.transaction.findUnique({ where: { id } });
};

export const transaction: AppRouteHandler<TransactionRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const transaction = await findTransactionById(id);

  if (!transaction) {
    return c.json(
      { message: "Transaction not found", errors: null, data: null },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(
    {
      data: transaction,
      errors: null,
      message: "Successfully get transaction",
    },
    HttpStatusCodes.OK,
  );
};

export const updateTransactionById: AppRouteHandler<
  UpdateTransactionRoute
> = async (c) => {
  const { id } = c.req.valid("param");
  const validated = c.req.valid("json");

  const transactions = await findTransactionById(id);

  if (!transactions) {
    return c.json(
      { message: "Transaction not found", data: null, errors: null },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  const result = await prisma.transaction.update({
    where: { id },
    data: validated,
  });

  return c.json(
    {
      message: "Successfully updated transaction",
      data: result,
      errors: null,
    },
    HttpStatusCodes.OK,
  );
};

export const deleteTransactionById: AppRouteHandler<
  DeleteTransactionRoute
> = async (c) => {
  const { id } = c.req.valid("param");

  const transactions = await findTransactionById(id);

  if (!transactions) {
    return c.json(
      { message: "Transaction not found", data: null, errors: null },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  await prisma.transaction.delete({
    where: { id },
  });

  return c.json(
    {
      message: "Successfully deleted transaction",
      data: null,
      errors: null,
    },
    HttpStatusCodes.OK,
  );
};
