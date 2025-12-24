export default function createNewUser(newUser) {
  if (!newUser) newUser = {};

  newUser.username = newUser.username || "test_user";
  newUser.password = newUser.password || "123123";
  newUser.email = newUser.email || "test_user@mail.com";
  newUser["confirm-password"] = newUser["confirm-password"] || "123123";

  return newUser;
}
