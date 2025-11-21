export default function checkFormValidityClick(
  currentInput,
  usernameInput,
  passwordInput,
  confirmPasswordInput,
  emailInput
) {
  if (usernameInput.current.value.trim().length < 6) {
    usernameInput.current.setCustomValidity(
      "Username must have at least 6 characters"
    );
    usernameInput.current.reportValidity();
  } else usernameInput.current.setCustomValidity("");

  if (emailInput.current.value.trim().length < 6) {
    emailInput.current.setCustomValidity(
      "Email must have at least 3 characters"
    );
    emailInput.current.reportValidity();
  } else emailInput.current.setCustomValidity("");

  if (passwordInput.current.value.trim().length < 6) {
    passwordInput.current.setCustomValidity(
      "Password must have at least 6 characters"
    );
    passwordInput.current.reportValidity();
  } else passwordInput.current.setCustomValidity("");

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
