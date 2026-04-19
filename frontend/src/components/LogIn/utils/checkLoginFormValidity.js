function checkLoginFormValidity(currentInput, emailInput, passwordInput) {
  if (currentInput === "email") {
    const emailValue = emailInput.current.value.trim();
    if (!emailValue.includes("@") || emailValue.length < 3) {
      emailInput.current.setCustomValidity(
        "Please enter a valid email address",
      );
      emailInput.current.reportValidity();
    } else emailInput.current.setCustomValidity("");
  }

  if (currentInput === "password") {
    if (passwordInput.current.value.trim().length < 6) {
      passwordInput.current.setCustomValidity(
        "Password must have at least 6 characters",
      );
      passwordInput.current.reportValidity();
    } else passwordInput.current.setCustomValidity("");
  }
}

export { checkLoginFormValidity };
