export default function checkFormValidity(
  currentInput,
  usernameInput,
  passwordInput,
  confirmPasswordInput
) {
  if (currentInput === "username") {
    if (usernameInput.current.value.trim().length < 6) {
      usernameInput.current.setCustomValidity(
        "Username must have at least 6 characters"
      );
      usernameInput.current.reportValidity();
    } else usernameInput.current.setCustomValidity("");
  }

  if (currentInput === "password") {
    if (passwordInput.current.value.trim().length < 6) {
      passwordInput.current.setCustomValidity(
        "Password must have at least 6 characters"
      );
      passwordInput.current.reportValidity();
    } else passwordInput.current.setCustomValidity("");
  }

  if (currentInput === "confirm-password") {
    if (
      passwordInput.current.value.trim() !==
      confirmPasswordInput.current.value.trim()
    ) {
      confirmPasswordInput.current.setCustomValidity(
        "Password and confirm password fields must match"
      );
      confirmPasswordInput.current.reportValidity();
    } else confirmPasswordInput.current.setCustomValidity("");
  }
}
