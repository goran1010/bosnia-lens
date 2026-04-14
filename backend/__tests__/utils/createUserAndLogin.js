import crypto from "crypto";
import { createNewUser } from "./createNewUser";
import { usersModel } from "../../models/usersModel.js";

async function createAndLoginUser(agent, newUser) {
  const userData = createNewUser(newUser);

  if (!agent) throw new Error("Agent is required to create and login user.");

  await agent.post("/auth/signup").send(userData);

  const token = crypto.randomBytes(32).toString("hex");

  await agent.get(`/auth/confirm/${token}`);

  if (userData.role !== "USER") {
    await usersModel.update(
      { username: userData.username },
      { role: userData.role },
    );
  }

  if (userData.requestedContributor === true) {
    await usersModel.update(
      { username: userData.username },
      { requestedContributor: true },
    );
  }

  const response = await agent.post("/auth/login").send({
    username: userData.username,
    password: userData.password,
  });

  return response;
}

export { createAndLoginUser };
