import normalizeName from "../utils/normalizeName.js";

export function status(req, res) {
  res.json({ message: "Server is running" });
}

export function getPostalCodes(req, res) {
  const postalCodes = [
    { code: 71000, place: "Sarajevo" },
    { code: 71001, place: "Sarajevo" },
    { code: 78000, place: "Banja Luka" },
  ];
  res.json({ data: postalCodes });
}

export function getPostalCodeByCode(req, res) {
  let { searchTerm } = req.params;

  if (!searchTerm || searchTerm.trim() === "") {
    return res.status(400).json({ error: "Search term is required" });
  }

  const numericSearchTerm = Number(searchTerm);
  if (!Number.isNaN(numericSearchTerm) && numericSearchTerm > 0) {
    searchTerm = numericSearchTerm;
  } else {
    searchTerm = normalizeName(searchTerm);
  }

  const postalCodeData = [
    { code: 71000, place: "Sarajevo" },
    { code: 71001, place: "Sarajevo" },
    { code: 78000, place: "Banja Luka" },
  ];

  let result = [];
  if (typeof searchTerm === "number") {
    const found = postalCodeData.find((item) => item.code === searchTerm);
    if (found) result.push(found);
  } else {
    result = postalCodeData.filter(
      (item) => normalizeName(item.place) === searchTerm,
    );
  }

  if (result.length > 0) {
    res.json({ data: result });
  } else {
    res.status(404).json({ error: "Postal code not found" });
  }
}
