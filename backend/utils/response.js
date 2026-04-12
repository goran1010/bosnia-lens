function sendSuccess(res, { status = 200, data = null, message } = {}) {
  const payload = { data };

  if (message) {
    payload.message = message;
  }

  return res.status(status).json(payload);
}

function sendError(res, { status = 400, message = "Request failed." } = {}) {
  return res.status(status).json({
    error: {
      message,
    },
  });
}

export { sendSuccess, sendError };
