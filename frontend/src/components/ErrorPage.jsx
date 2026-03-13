import { Link } from "react-router-dom";

function ErrorPage() {
  return (
    <main className="flex flex-col items-center gap-4 justify-center h-screen dark:text-gray-200">
      <p className="text-gray-700 text-2xl dark:text-gray-200">
        There is nothing here, sorry.
      </p>
      <Link to="/" className="text-blue-500 underline text-2xl">
        Go Home
      </Link>
    </main>
  );
}
export { ErrorPage };
