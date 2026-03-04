import jwt from "jsonwebtoken";
import * as usersModel from "../../models/usersModel.js";

async function createContributorAndKeepLoggedIn(agent, userData) {
  await agent.post("/auth/signup").send(userData);

  const accessToken = jwt.sign(
    { email: userData.email, username: userData.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" },
  );

  await agent.get(`/auth/confirm/${accessToken}`);

  const response = await agent.post("/auth/login").send({
    username: userData.username,
    password: userData.password,
  });

  await usersModel.update(
    { username: userData.username },
    { isContributor: true },
  );
  return response;
}

export { createContributorAndKeepLoggedIn };
