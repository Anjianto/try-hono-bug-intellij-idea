import { prisma } from "src/db";
import { testClient } from "hono/testing";
import { createApp } from "src/lib/create-app";
import { authRouter } from "src/routes/auth";

export const deleteAllUsers = async () => {
  await prisma.user.deleteMany();
};

const defaultCreateUserPayload = {
  name: "User 1",
  username: "user1",
  email: "user1@email.com",
  password: "Secret 1234",
};

const client = testClient(createApp().route("/", authRouter));

export const createUser = async (
  payload: typeof defaultCreateUserPayload = defaultCreateUserPayload,
) => {
  await client.auth.register.$post({ json: payload });
};

const getTokenPayload = {
  email: defaultCreateUserPayload.email,
  password: defaultCreateUserPayload.password,
};

export const getToken = async (
  payload: typeof getTokenPayload = getTokenPayload,
) => {
  const response = await client.auth.login.$post({ json: payload });

  return (await response.json()).data?.token || "";
};
