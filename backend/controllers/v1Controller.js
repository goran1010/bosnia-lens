import { sendSuccess } from "../utils/response.js";

class V1Controller {
  status(req, res) {
    return sendSuccess(res, {
      data: {
        status: "ok",
      },
      message: "API v1 server is running",
    });
  }
}

const v1Controller = new V1Controller();

export { v1Controller };
