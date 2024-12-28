import { beforeAll, describe, expect, it } from "vitest";

import { createUser, deleteAllUsers, getToken } from "tests/utils/db";
import { testClient } from "hono/testing";
import { categoriesRouter } from "src/routes/categories";
import { createApp } from "src/lib/create-app";

const client = testClient(createApp().route("/", categoriesRouter));

describe("Categories", () => {
  let token: string;
  beforeAll(async () => {
    await deleteAllUsers();
    await createUser();

    token = await getToken();
  });

  describe("GET /categories", () => {
    it("should return a list of categories with a 200 status", async () => {
      const response = await client.categories.$get(undefined, {
        headers: { Authorization: `Bearer ${token}` },
      });

      expect(response.status).toBe(200);
      const json = await response.json();
      expect(Array.isArray(json.data)).toBe(true);
      json.data.forEach((category) => {
        expect(category).toHaveProperty("id");
        expect(category).toHaveProperty("name");
      });
    });

    it("should return a 401 status if no token is provided", async () => {
      const response = await client.categories.$get();

      const json = await response.json();

      expect(response.status).toBe(401);
      expect(json.message).toBe("Unauthorized");
    });
  });
});
