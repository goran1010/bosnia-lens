export function me(req, res) {
  res.json(req.token);
}
