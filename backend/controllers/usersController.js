import bcrypt from "bcryptjs";
import prisma from "../db/prisma.js";

export async function signup(req, res) {
  try {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const userExists = await prisma.user.findUnique({
      where: { username },
    });

    if (userExists) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    if (!user) {
      return res.status(400).json({ error: "User could not be created" });
    }

    res
      .status(201)
      .json({ message: `User ${username} signed up successfully` });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export function login(req, res) {
  const { username, password } = req.body;
  console.log(`Signing up user: ${username}`);
  console.log(`Password: ${password}`);
  // Here you would normally add logic to authenticate the user
  res.json({ message: `User ${username} logged in successfully` });
}
