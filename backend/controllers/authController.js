export function me(req, res) {
  res.json({ data: req.token });
}
