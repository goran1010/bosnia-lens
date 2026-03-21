import { app } from "./app.js";

const PORT = process.env.PORT;

const server = app.listen(PORT, (error) => {
  if (error) throw error;
  // eslint-disable-next-line no-console
  console.log(`App started at port: ${PORT}`);
});

// process.on("SIGTERM", () => {
//   console.warn("SIGTERM received. Shutting down gracefully...");

//   server.close(() => {
//     console.warn("Process terminated");
//     process.exit(0);
//   });
// });
