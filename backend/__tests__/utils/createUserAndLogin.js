import jwt from "jsonwebtoken";
import { createNewUser } from "./createNewUser";
import { usersModel } from "../../models/usersModel.js";

async function createAndLoginUser(agent, newUser) {
  const userData = createNewUser(newUser);

  if (!agent) throw new Error("Agent is required to create and login user.");

  await agent.post("/auth/signup").send(userData);

  const accessToken = jwt.sign(
    { email: userData.email, username: userData.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" },
  );

  await agent.get(`/auth/confirm/${accessToken}`);

  if (userData.role !== "USER") {
    await usersModel.update(
      { username: userData.username },
      { role: userData.role },
    );
  }

  const response = await agent.post("/auth/login").send({
    username: userData.username,
    password: userData.password,
  });

  return response;
}

export { createAndLoginUser };
