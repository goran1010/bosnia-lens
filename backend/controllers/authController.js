export async function me(req, res) {
  const user = req.user;
  delete user.password;

  res.json({ data: user });
}
