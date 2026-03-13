function validateSubmitAddData(cityInput, codeInput) {
  if (!cityInput.current.value.trim()) {
    cityInput.current.setCustomValidity("City name cannot be empty");
    cityInput.current.reportValidity();
    return false;
  } else {
    cityInput.current.setCustomValidity("");
  }
  if (!codeInput.current.value.trim()) {
    codeInput.current.setCustomValidity("Postal code cannot be empty");
    codeInput.current.reportValidity();
    return false;
  } else if (
    isNaN(Number(codeInput.current.value)) ||
    codeInput.current.value.length !== 5
  ) {
    codeInput.current.setCustomValidity("Postal code must be a 5-digit number");
    codeInput.current.reportValidity();
    return false;
  } else {
    codeInput.current.setCustomValidity("");
  }
  return true;
}
export { validateSubmitAddData };
