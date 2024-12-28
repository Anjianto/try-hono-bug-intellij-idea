import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

import { viteNodeApp as app } from "src";
import { createUser, deleteAllUsers, getToken } from "tests/utils/db";
import { faker } from "@faker-js/faker";
import { testClient } from "hono/testing";
import { createApp } from "src/lib/create-app";
import { transactionsRouter } from "src/routes/transactions";
import { HttpStatusCodes } from "src/lib/http-status-codes";

const GET_ENDPOINT = "/transactions";
const POST_ENDPOINT = "/transactions";
const GET_DETAIL_ENDPOINT = "/transactions/:id";
const UPDATE_ENDPOINT = "/transactions/:id";
const DELETE_ENDPOINT = "/transactions/:id";

const client = testClient(createApp().route("/", transactionsRouter));

describe("Transactions", () => {
  let token: string;
  let transactionId: number;
  beforeAll(async () => {
    await deleteAllUsers();
    await createUser();

    token = await getToken();
  });

  describe(`POST ${POST_ENDPOINT}`, () => {
    it("should create a transaction and return 201 for authenticated users", async () => {
      const requestBody = {
        name: faker.commerce.productName(),
        amount: Number(faker.commerce.price({ dec: 0 })),
        description: faker.commerce.productDescription(),
        transDate: faker.date.past().valueOf(),
        categoryId: 1,
      };

      const response = await client.transactions.$post(
        { json: requestBody },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.status === HttpStatusCodes.CREATED) {
        const json = await response.json();
        transactionId = json.data.id;

        expect(response.status).toBe(201);
        expect(json).toEqual({
          message: "Successfully created transaction",
          data: {
            id: expect.any(Number),
            name: requestBody.name,
            description: requestBody.description,
            amount: requestBody.amount,
            transDate: requestBody.transDate,
            categoryId: requestBody.categoryId,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
          errors: null,
        });
      }
    });

    it("should return 400 if the request body is invalid", async () => {
      const invalidRequestBody = { description: "Missing amount and date" };

      const response = await client.transactions.$post(
        { json: invalidRequestBody },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      expect(response.status).toBe(400);
    });

    it("should return 401 if the user is not authenticated", async () => {
      const requestBody = {
        amount: 100,
        description: "Test transaction",
        date: new Date().toISOString(),
      };

      const response = await client.transactions.$post({ json: requestBody });

      expect(response.status).toBe(401);
    });
  });

  describe(`GET ${GET_ENDPOINT}`, () => {
    it("should return 200 and a list of transactions for authenticated users", async () => {
      const response = await request(app)
        .get(GET_ENDPOINT)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty("id");
        expect(response.body[0]).toHaveProperty("name");
        expect(response.body[0]).toHaveProperty("amount");
        expect(response.body[0]).toHaveProperty("description");
        expect(response.body[0]).toHaveProperty("transDate");
      }
    });

    it("should return 401 if the user is not authenticated", async () => {
      await request(app).get(GET_ENDPOINT).expect(401);
    });

    it("should return 401 if the token is invalid", async () => {
      const invalidToken = "invalid.token.value";

      await request(app)
        .get(GET_ENDPOINT)
        .set("Authorization", `Bearer ${invalidToken}`)
        .expect(401);
    });
  });

  describe(`GET ${GET_DETAIL_ENDPOINT}`, () => {
    it("should return 200 and the transaction details for an authenticated user", async () => {
      const response = await request(app)
        .get(`/transactions/${transactionId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty("id", transactionId);
      expect(response.body).toHaveProperty("name");
      expect(response.body).toHaveProperty("amount");
      expect(response.body).toHaveProperty("description");
      expect(response.body).toHaveProperty("transDate");
    });

    it("should return 404 if the transaction does not exist", async () => {
      const nonExistentId = 9999;

      await request(app)
        .get(`/transactions/${nonExistentId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
    });

    it("should return 400 if the transaction ID is invalid", async () => {
      const invalidTransactionId = "invalid-id";

      await request(app)
        .get(`/transactions/${invalidTransactionId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
    });

    it("should return 401 if the user is not authenticated", async () => {
      await request(app).get(`/transactions/${transactionId}`).expect(401);
    });

    it("should return 401 if the token is invalid", async () => {
      const invalidToken = "invalid.token.value";

      await request(app)
        .get(`/transactions/${transactionId}`)
        .set("Authorization", `Bearer ${invalidToken}`)
        .expect(401);
    });
  });

  describe(`PATCH ${UPDATE_ENDPOINT}`, () => {
    it("should update a transaction and return 200 for authenticated users", async () => {
      const updateRequestBody = {
        name: "Updated Transaction Name",
        amount: 150,
        description: "Updated transaction description",
      };

      const response = await request(app)
        .patch(`/transactions/${transactionId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateRequestBody)
        .expect(200);

      expect(response.body).toEqual({
        message: "Successfully updated transaction",
        data: {
          id: transactionId,
          name: updateRequestBody.name,
          description: updateRequestBody.description,
          amount: updateRequestBody.amount,
          transDate: expect.any(Number),
          categoryId: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        errors: null,
      });
    });

    it("should return 400 if the request body is invalid", async () => {
      const invalidUpdateRequestBody = { amount: "invalid-amount" };

      await request(app)
        .patch(`/transactions/${transactionId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(invalidUpdateRequestBody)
        .expect(400);
    });

    it("should return 404 if the transaction does not exist", async () => {
      const nonExistentId = 9999;
      const updateRequestBody = { name: "Non-existent Transaction" };

      await request(app)
        .patch(`/transactions/${nonExistentId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateRequestBody)
        .expect(404);
    });

    it("should return 400 if the transaction ID is invalid", async () => {
      const invalidTransactionId = "invalid-id";
      const updateRequestBody = { name: "Invalid ID Transaction" };

      await request(app)
        .patch(`/transactions/${invalidTransactionId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateRequestBody)
        .expect(400);
    });

    it("should return 401 if the user is not authenticated", async () => {
      const updateRequestBody = { name: "Unauthorized Transaction" };

      await request(app)
        .patch(`/transactions/${transactionId}`)
        .send(updateRequestBody)
        .expect(401);
    });

    it("should return 401 if the token is invalid", async () => {
      const invalidToken = "invalid.token.value";
      const updateRequestBody = { name: "Invalid Token Transaction" };

      await request(app)
        .patch(`/transactions/${transactionId}`)
        .set("Authorization", `Bearer ${invalidToken}`)
        .send(updateRequestBody)
        .expect(401);
    });
  });

  describe(`DELETE ${DELETE_ENDPOINT}`, () => {
    it("should delete a transaction and return 200 for authenticated users", async () => {
      const response = await request(app)
        .delete(`/transactions/${transactionId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body).toEqual({
        message: "Successfully deleted transaction",
        data: null,
        errors: null,
      });
    });

    it("should return 404 if the transaction does not exist", async () => {
      const nonExistentId = 9999;

      await request(app)
        .delete(`/transactions/${nonExistentId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
    });

    it("should return 400 if the transaction ID is invalid", async () => {
      const invalidTransactionId = "invalid-id";

      await request(app)
        .delete(`/transactions/${invalidTransactionId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(400);
    });

    it("should return 401 if the user is not authenticated", async () => {
      await request(app).delete(`/transactions/${transactionId}`).expect(401);
    });

    it("should return 401 if the token is invalid", async () => {
      const invalidToken = "invalid.token.value";

      await request(app)
        .delete(`/transactions/${transactionId}`)
        .set("Authorization", `Bearer ${invalidToken}`)
        .expect(401);
    });
  });
});
