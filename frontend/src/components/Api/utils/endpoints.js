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
{ "error": { "message": "Validation failed: Postal codes must have 5 numbers. Fix the highlighted fields and try again." } }`,
  },
];

const authenticatedGroups = [
  {
    title: "CSRF",
    endpoints: [
      {
        method: "GET",
        path: "/csrf-token",
        description:
          "Issue a CSRF token used in the x-csrf-token header for mutating requests.",
      },
    ],
  },
  {
    title: "Auth",
    endpoints: [
      {
        method: "POST",
        path: "/auth/signup",
        description:
          "Register a pending account and send a confirmation email.",
      },
      {
        method: "GET",
        path: "/auth/confirm/:token",
        description: "Confirm signup token and create the user account.",
      },
      {
        method: "POST",
        path: "/auth/login",
        description: "Log in with email/password.",
      },
      {
        method: "GET",
        path: "/auth/github",
        description: "Start GitHub OAuth login flow.",
      },
      {
        method: "GET",
        path: "/auth/github/callback",
        description: "Complete GitHub OAuth login flow.",
      },
    ],
  },
  {
    title: "Users (Authenticated)",
    endpoints: [
      {
        method: "GET",
        path: "/users/me",
        description: "Get current user profile.",
      },
      {
        method: "POST",
        path: "/users/logout",
        description: "End session.",
      },
    ],
  },
  {
    title: "Contributions (Authenticated Users)",
    endpoints: [
      {
        method: "POST",
        path: "/users/contribution/postal-codes",
        description: "Suggest a new postal code (stored as pending change).",
      },
      {
        method: "PUT",
        path: "/users/contribution/postal-codes",
        description:
          "Suggest an edit to a postal code (stored as pending change).",
      },
      {
        method: "DELETE",
        path: "/users/contribution/postal-codes",
        description:
          "Suggest deletion of a postal code (stored as pending change).",
      },
      {
        method: "GET",
        path: "/users/contribution/pending-changes/postal-codes",
        description: "List your own pending suggestions.",
      },
      {
        method: "DELETE",
        path: "/users/contribution/pending-changes/postal-codes",
        description: "Remove one of your own pending suggestions.",
      },
    ],
  },
  {
    title: "Admin (Authenticated Admin Users)",
    endpoints: [
      {
        method: "GET",
        path: "/users/admin/pending-changes",
        description: "List all pending suggestions.",
      },
      {
        method: "POST",
        path: "/users/admin/approve-pending-change",
        description:
          "Approve a pending suggestion and apply it to the live dataset.",
      },
      {
        method: "DELETE",
        path: "/users/admin/decline-pending-change",
        description: "Reject a pending suggestion.",
      },
    ],
  },
];

export { endpoints, authenticatedGroups };
