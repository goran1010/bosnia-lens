const allRequiredVars = [
  "DATABASE_URL",
  "FRONTEND_URL",
  "BACKEND_URL",
  "PORT",
  "RESEND_API_KEY",
  "COOKIE_SECRET",
  "NODE_ENV",
  "GITHUB_CLIENT_ID",
  "GITHUB_CLIENT_SECRET",
];

function envCheck(requiredVars) {
  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`,
    );
  }

  if (process.env.NODE_ENV !== "production") {
    if (!process.env.TEST_DATABASE_URL) {
      throw new Error(
        "Missing required environment variable: TEST_DATABASE_URL",
      );
    }
  }
}

envCheck(allRequiredVars);
