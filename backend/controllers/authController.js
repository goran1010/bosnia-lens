async function me(req, res) {
  const user = req.user;
  delete user.password;

  res.json({ message: "User info retrieved", data: user });
}

export { me };
