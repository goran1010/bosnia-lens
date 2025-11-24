export function me(req, res) {
  res.json({ data: { accessToken: req.token } });
}
