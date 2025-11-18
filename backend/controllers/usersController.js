import bcrypt from "bcryptjs";
import prisma from "../db/prisma.js";
import jwt from "jsonwebtoken";
const SECRET = process.env.SECRET;

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

export async function login(req, res) {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return res.status(400).json({ error: "Invalid username or password" });
  }

  const passwordMatch = bcrypt.compareSync(password, user.password);
  if (!passwordMatch) {
    return res.status(400).json({ error: "Invalid username or password" });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET, {
    expiresIn: "15m",
  });

  res.setHeader("Authorization", `Bearer ${token}`);
  res.json({ message: `User ${username} logged in successfully` });
}
