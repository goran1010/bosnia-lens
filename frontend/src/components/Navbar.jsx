import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <ul
        className="
        flex w-full p-4 bg-gray-200
        justify-center gap-8"
      >
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/postal-codes">Postal Codes</Link>
        </li>
      </ul>
    </nav>
  );
}
