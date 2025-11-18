export function checkAuth(req, res) {
  // Dummy authentication check
  const isAuthenticated = true; // Replace with real authentication logic
  if (isAuthenticated) {
    res.json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false, message: "Unauthorized" });
  }
}
