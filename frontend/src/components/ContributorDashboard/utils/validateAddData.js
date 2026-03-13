function validateAddData(e) {
  if (e.target.name === "code") {
    const value = e.target.value;

    if (isNaN(Number(value))) {
      e.target.setCustomValidity("Postal code must be a number");
      e.target.reportValidity();
    } else if (value.length !== 5) {
      e.target.setCustomValidity("Postal code must have 5 digits");
      e.target.reportValidity();
    } else {
      e.target.setCustomValidity("");
    }
  }
}

export { validateAddData };
