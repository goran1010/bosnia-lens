import { Link } from "react-router-dom";

function ErrorPage() {
  return (
    <div className="error-page">
      <p>This is a custom 404 error page.</p>
      <p>
        <Link to="/">Go Home</Link>
      </p>
    </div>
  );
}
export default ErrorPage;
