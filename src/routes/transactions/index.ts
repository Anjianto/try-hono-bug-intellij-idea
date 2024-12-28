import { createRouter } from "src/lib/create-app";
import * as routes from "./routes";
import * as handlers from "./handlers";

export const transactionsRouter = createRouter()
  .openapi(routes.transactions, handlers.transactions)
  .openapi(routes.createTransaction, handlers.createTransaction)
  .openapi(routes.transaction, handlers.transaction)
  .openapi(routes.updateTransaction, handlers.updateTransactionById)
  .openapi(routes.deleteTransaction, handlers.deleteTransactionById);
