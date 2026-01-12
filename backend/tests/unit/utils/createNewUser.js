export default function createNewUser(user = {}) {
  const newUser = {};

  newUser.username = user.username || "test_user";
  newUser.password = user.password || "123123";
  newUser.email = user.email || "test_user@mail.com";
  newUser["confirm-password"] = user["confirm-password"] || "123123";

  return newUser;
}
