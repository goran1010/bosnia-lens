import jwt from "jsonwebtoken";

async function createAndLoginUser(agent, newUser) {
  const createUserData = {
    username: newUser.username,
    password: "123123",
    email: newUser.email,
    role: newUser.role || "USER",
    ["confirm-password"]: "123123",
    isAdmin: newUser.isAdmin || false,
  };
  await agent.post("/auth/signup").send(createUserData);

  const accessToken = jwt.sign(
    { email: createUserData.email, username: createUserData.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" },
  );

  await agent.get(`/auth/confirm/${accessToken}`);

  const response = await agent.post("/auth/login").send({
    username: createUserData.username,
    password: createUserData.password,
  });

  return response;
}

export { createAndLoginUser };
