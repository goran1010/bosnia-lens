export function signup(req, res) {
  const { username, password } = req.body;
  // Here you would normally add logic to save the user to the database
  res.status(201).json({ message: `User ${username} signed up successfully` });
}

export function login(req, res) {
  const { username, password } = req.body;
  // Here you would normally add logic to authenticate the user
  res.json({ message: `User ${username} logged in successfully` });
}
