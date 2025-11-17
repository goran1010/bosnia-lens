export default function normalizeName(searchTerm) {
  return searchTerm.trim().split(" ").join("").toLowerCase();
}
