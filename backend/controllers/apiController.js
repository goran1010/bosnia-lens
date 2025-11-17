import normalizeName from "../utils/normalizeName.js";

export function status(req, res) {
  res.json({ status: "Success", message: "Server is running" });
}

export function getPostalCodes(req, res) {
  const postalCodes = [
    { code: 71000, place: "Sarajevo" },
    { code: 78000, place: "Banja Luka" },
  ];
  res.json(postalCodes);
}

export function getPostalCodeByCode(req, res) {
  let { searchTerm } = req.params;

  const numericSearchTerm = Number(searchTerm);
  if (!Number.isNaN(numericSearchTerm) && numericSearchTerm > 0) {
    searchTerm = numericSearchTerm;
  } else {
    searchTerm = normalizeName(searchTerm);
  }

  const postalCodeData = [
    { code: 71000, place: "Sarajevo" },
    { code: 78000, place: "Banja Luka" },
  ];

  let result = null;
  if (typeof searchTerm === "number") {
    result = postalCodeData.find((item) => item.code === searchTerm);
  } else {
    result = postalCodeData.find(
      (item) => normalizeName(item.place) === searchTerm,
    );
  }

  if (result) {
    res.json(result);
  } else {
    res.status(404).json({ error: "Postal code not found" });
  }
}
