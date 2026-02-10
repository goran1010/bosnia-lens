const allRequiredVars = [
  "DATABASE_URL",
  "TEST_DATABASE_URL",
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
  "URL",
  "PORT",
  "RESEND_API_KEY",
  "CLIENT_ID",
  "CLIENT_SECRET",
  "COOKIE_SECRET",
];

export default function envCheck(requiredVars) {
  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`,
    );
  }
}

envCheck(allRequiredVars);
