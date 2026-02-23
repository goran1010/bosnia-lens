import jwt from "jsonwebtoken";
import * as usersModel from "../../models/usersModel.js";

async function createAdminAndKeepLoggedIn(agent, userData) {
  await agent.post("/users/signup").send(userData);

  const accessToken = jwt.sign(
    { email: userData.email, username: userData.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" },
  );

  await agent.get(`/users/confirm/${accessToken}`);

  const response = await agent.post("/users/login").send({
    username: userData.username,
    password: userData.password,
  });

  await usersModel.update({ email: userData.email }, { isAdmin: true });
  return response;
}

export { createAdminAndKeepLoggedIn };
