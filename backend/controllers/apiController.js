class APIController {
  status(req, res) {
    res.json({ message: "API server is running" });
  }
}

const apiController = new APIController();

export { apiController };
