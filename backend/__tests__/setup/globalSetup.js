/* eslint-disable no-console */
import { usersModel } from "../../models/usersModel.js";

export default async function () {
  process.env.NODE_ENV = "test";

  await usersModel.deleteAll();
  console.log("Test database cleared before tests");

  return async () => {
    console.log("Global teardown: Test database cleared after tests");
    await usersModel.deleteAll();
  };
}
