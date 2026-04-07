function createNewUser(user = {}) {
  const newUser = {};
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 10000);

  newUser.username = user.username || `test_user_${timestamp}_${randomSuffix}`;
  newUser.password = user.password || "123123";
  newUser.role = user.role || "USER";
  newUser.email =
    user.email ||
    `test_user_${timestamp}_${randomSuffix}@non-existent-mail.comms`;
  newUser["confirm-password"] = user["confirm-password"] || "123123";
  newUser.isConfirmedEmail = user.isConfirmedEmail || false;
  newUser.requestedContributor = user.requestedContributor || false;

  return newUser;
}

export { createNewUser };
