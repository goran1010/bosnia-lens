import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT;

if (!PORT) {
  throw new Error("Missing required environment variable: PORT");
}

app.listen(PORT, (error) => {
  if (error) throw error;
  // eslint-disable-next-line no-console
  console.log(`App started at port: ${PORT}`);
});
