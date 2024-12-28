import { serve } from "@hono/node-server";
import { authRouter } from "src/routes/auth";
import { categoriesRouter } from "src/routes/categories";
import { configureOpenApi } from "src/lib/configure-open-api";
import { transactionsRouter } from "src/routes/transactions";
import { createApp } from "src/lib/create-app";

// Add conversion from BigInt to Number for Prisma to JSON response
BigInt.prototype.toJSON = function () {
  return Number.parseInt(this.toString());
};

const app = createApp();

configureOpenApi(app);

// app.use(bodyParser.json());
// app.use(
//   cors({
//     credentials: true,
//     origin: (origin, callback) => {
//       // Allow requests from any origin
//       callback(null, true);
//     },
//   }),
// );

// app.use("/categories", authMiddleware, categoriesRouter);
// app.use("/transactions", authMiddleware, transactionsRouter);
// app.use("/auth", authRouter);

const routes = [authRouter, categoriesRouter, transactionsRouter] as const;

for (const route of routes) {
  app.route("/", route);
}

// app.use(errorMiddleware);
//
// app.post("/auth/login", zValidator("json", loginSchema), async (c) => {
//   const validated = await c.req.valid("json");
//
//   const result = await prisma.user.findUnique({
//     where: { email: validated.email },
//   });
//
//   if (!result) {
//     c.status(400);
//     return c.json({
//       message: "Email or password is incorrect",
//       data: null,
//       errors: null,
//     });
//   }
//
//   const isPasswordCorrect = await bcrypt.compare(
//     validated.password,
//     result.password,
//   );
//
//   if (!isPasswordCorrect) {
//     c.status(400);
//     return c.json({
//       message: "Email or password is incorrect",
//       data: null,
//       errors: null,
//     });
//   }
//
//   const token = jwt.sign(
//     { username: result.username },
//     process.env.JWT_SECRET as string,
//   );
//
//   return c.json({
//     data: { token },
//     errors: null,
//     message: "Successfully logged in",
//   });
// });

const port = 3000;
// eslint-disable-next-line no-console
console.log(`Server is running on http://localhost:${port}`);

serve({ fetch: app.fetch, port });

export type AppType = (typeof routes)[number];

// if (import.meta.env.PROD) {
//   app.listen(3000, () => {
//     // eslint-disable-next-line
//     console.log("Server is running on port http://localhost:3000");
//   });
// }

// export const viteNodeApp = app;
