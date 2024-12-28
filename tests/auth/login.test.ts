import { beforeAll, describe, expect, it } from "vitest";
import { createUser, deleteAllUsers } from "tests/utils/db";
import { testClient } from "hono/testing";
import { authRouter } from "src/routes/auth";
import { createApp } from "src/lib/create-app";

const userCredentials = {
  email: "user1@email.com",
  password: "Secret 1234",
};

const ENDPOINT = "/auth/login";

const client = testClient(createApp().route("/", authRouter));

describe(ENDPOINT, () => {
  beforeAll(async () => {
    await deleteAllUsers();
    await createUser();
  });

  it("should log in successfully with valid credentials", async () => {
    const response = await client.auth.login.$post({ json: userCredentials });

    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.data).toHaveProperty("token");
    expect(typeof json.data?.token).toBe("string");
  });

  it("should fail to log in with invalid credentials", async () => {
    const response = await client.auth.login.$post({
      json: {
        email: userCredentials.email,
        password: "wrongPassword",
      },
    });

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({
      message: "Email or password is incorrect",
      data: null,
      errors: null,
    });
  });

  it("should fail to log in with missing fields", async () => {
    const response = await client.auth.login.$post({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      json: {
        email: userCredentials.email,
      },
    });

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.message).toEqual("Invalid input provided");
    expect(json.errors).toHaveProperty("password");
  });

  it("should fail to log in when the email does not exist", async () => {
    const response = await client.auth.login.$post({
      json: {
        email: "nonexistent@email.com",
        password: userCredentials.password,
      },
    });

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({
      message: "Email or password is incorrect",
      data: null,
      errors: null,
    });
  });
});
