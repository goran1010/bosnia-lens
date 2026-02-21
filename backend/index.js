import { app } from "./app.js";

const PORT = process.env.PORT;

app.listen(PORT, (error) => {
  if (error) throw error;
  // eslint-disable-next-line no-console
  console.log(`App started at port: ${PORT}`);
});
