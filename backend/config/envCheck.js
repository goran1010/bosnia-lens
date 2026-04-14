const allRequiredVars = [
  "DATABASE_URL",
  "TEST_DATABASE_URL",
  "FRONTEND_URL",
  "BACKEND_URL",
  "PORT",
  "RESEND_API_KEY",
  "COOKIE_SECRET",
  "NODE_ENV",
];

function envCheck(requiredVars) {
  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`,
    );
  }
}

envCheck(allRequiredVars);
