export default function checkFormValidityClick(
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

  const emailValue = emailInput.current.value.trim();

  if (emailValue.length < 3) {
    emailInput.current.setCustomValidity(
      "Email must have at least 3 characters"
    );
    emailInput.current.reportValidity();
  } else if (!emailValue.includes("@")) {
    emailInput.current.setCustomValidity(
      `Please include an '@' in the email address. '${emailValue}' is missing an '@'.`
    );
    emailInput.current.reportValidity();
  } else if (emailValue.split("@")[1]?.length === 0) {
    emailInput.current.setCustomValidity(
      `Please enter a part following '@'. ${emailValue} is incomplete.`
    );
    emailInput.current.reportValidity();
  } else {
    emailInput.current.setCustomValidity("");
  }

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
