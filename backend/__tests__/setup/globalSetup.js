import * as usersModel from "../../models/usersModel.js";

export async function setup() {
  process.env.NODE_ENV = "test";
  await usersModel.deleteAll();
  console.log("Database cleared before tests");
}

export async function teardown() {
  console.log("Global teardown: Database cleared after tests");
  await usersModel.deleteAll();
}
