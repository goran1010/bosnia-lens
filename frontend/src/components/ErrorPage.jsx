import { Link } from "react-router-dom";

function ErrorPage() {
  return (
    <div className="error-page">
      <p>There is nothing here, sorry.</p>
      <p>
        <Link to="/">Go Home</Link>
      </p>
    </div>
  );
}
export { ErrorPage };
