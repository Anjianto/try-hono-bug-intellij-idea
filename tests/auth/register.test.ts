import { beforeAll, describe, expect, it } from "vitest";
import { faker } from "@faker-js/faker";
import { testClient } from "hono/testing";
import { deleteAllUsers } from "tests/utils/db";
import { createApp } from "src/lib/create-app";
import { authRouter } from "src/routes/auth";

const ENDPOINT = "/auth/register";

const PAYLOAD = {
  username: faker.internet.username(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
};

const client = testClient(createApp().route("/", authRouter));

describe("/auth/register", () => {
  beforeAll(async () => {
    await deleteAllUsers();
  });

  it("should can register user", async () => {
    const response = await client.auth.register.$post({ json: PAYLOAD });

    const json = await response.json();

    expect(response.status).toEqual(201);
    expect(json).toEqual({ message: "Successfully registered" });
  });

  it("should not register user if process.env.ENABLED_REGISTER is not true", async () => {
    // Temporarily change process.env.ENABLED_REGISTER
    const originalEnvValue = process.env.ENABLED_REGISTER;
    process.env.ENABLED_REGISTER = "false";

    const response = await client.auth.register.$post({ json: PAYLOAD });

    const json = await response.json();

    expect(response.status).toEqual(404);
    expect(json).toEqual({
      message: `Cannot POST http://localhost${ENDPOINT}`,
    });

    // Restore original environment variable value
    process.env.ENABLED_REGISTER = originalEnvValue;
  });
});
