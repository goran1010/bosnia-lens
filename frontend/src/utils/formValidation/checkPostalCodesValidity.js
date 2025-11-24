export default function checkPostalCodesValidity(searchInput) {
  if (Number(searchInput.current.value.trim())) {
    if (searchInput.current.value.trim().length !== 6) {
      searchInput.current.setCustomValidity("Postal codes must have 6 numbers");
      searchInput.current.reportValidity();
    } else searchInput.current.setCustomValidity("");
  } else if (searchInput.current.value.trim().length < 2) {
    searchInput.current.setCustomValidity(
      "Search must have at least 2 characters"
    );
    searchInput.current.reportValidity();
  } else searchInput.current.setCustomValidity("");
}
