export default function checkPostalCodesValidity(searchInput) {
  const searchInputValue = searchInput.current.value.trim();

  if (Number.isInteger(Number(searchInputValue))) {
    if (searchInputValue.length !== 5) {
      searchInput.current.setCustomValidity("Postal codes must have 5 numbers");
      searchInput.current.reportValidity();
    } else searchInput.current.setCustomValidity("");
  } else if (searchInputValue.length < 2) {
    searchInput.current.setCustomValidity(
      "Search must have at least 2 characters",
    );
    searchInput.current.reportValidity();
  } else searchInput.current.setCustomValidity("");
}
