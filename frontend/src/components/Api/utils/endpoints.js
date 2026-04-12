const endpoints = [
  {
    method: "GET",
    path: "/api",
    description: "Check API status.",
    params: null,
    successExample: `{
  "data": { "status": "ok" },
  "message": "API server is running"
}`,
    errorExample: null,
  },
  {
    method: "GET",
    path: "/api/v1",
    description: "Check API v1 status.",
    params: null,
    successExample: `{
  "data": { "status": "ok" },
  "message": "API v1 server is running"
}`,
    errorExample: null,
  },
  {
    method: "GET",
    path: "/api/v1/postal-codes",
    description: "Retrieve all postal codes, ordered by code ascending.",
    params: null,
    successExample: `{
  "message": "Postal codes retrieved successfully",
  "data": [
    { "id": "...", "code": 71000, "city": "Sarajevo", "post": "BH_POSTA" },
    ...
  ]
}`,
    errorExample: null,
  },
  {
    method: "GET",
    path: "/api/v1/postal-codes/search",
    description:
      "Search postal codes by numeric code (exact 5-digit match) or by city name (case-insensitive, minimum 2 characters).",
    params: [
      {
        name: "searchTerm",
        required: true,
        description:
          "A 5-digit postal code (e.g. 71000) or a city name (e.g. Sarajevo, minimum 2 characters).",
      },
    ],
    successExample: `{
  "message": "Postal codes retrieved successfully",
  "data": [
    { "id": "...", "code": 71000, "city": "Sarajevo", "post": "BH_POSTA" }
  ]
}`,
    errorExample: `// 404 — no match found
{ "error": { "message": "Postal code not found: verify the search term and try again." } }

// 400 — invalid searchTerm
{ "error": { "message": "Validation failed: Postal codes must have 5 numbers Fix the highlighted fields and try again." } }`,
  },
];

export { endpoints };
