import { memo } from "react";
import { Button } from "../Button";

const PostalCodeRow = memo(({ result, onChange, onSubmit, onDelete }) => {
  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-2 w-full p-2 border border-gray-200 dark:border-gray-500 rounded-md sm:border-0 sm:rounded-none sm:p-1 sm:gap-1 sm:grid-cols-5"
    >
      <div className="flex justify-between sm:justify-center items-center">
        <span className="sm:hidden font-semibold">Code</span>
        <span>{result.code}</span>
      </div>
      <input
        name="city"
        type="text"
        value={result.city || ""}
        onChange={(e) => onChange(result.code, e.target.name, e.target.value)}
        data-code={result.code}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500 invalid:border-red-500 focus:invalid:ring-red-500 focus:invalid:border-red-500 dark:invalid:border-red-500 dark:focus:invalid:ring-red-500 dark:focus:invalid:border-red-500"
        aria-label={`City for postal code ${result.code}`}
      />
      <input
        data-code={result.code}
        name="post"
        type="text"
        value={result.post || ""}
        onChange={(e) => onChange(result.code, e.target.name, e.target.value)}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500 invalid:border-red-500 focus:invalid:ring-red-500 focus:invalid:border-red-500 dark:invalid:border-red-500 dark:focus:invalid:ring-red-500 dark:focus:invalid:border-red-500"
        aria-label={`Post office for postal code ${result.code}`}
      />
      <div>
        <Button type="submit" className="w-full py-2">
          Save
        </Button>
      </div>
      <div>
        <Button
          type="button"
          data-postalcode={result.code}
          onClick={onDelete}
          className="w-full bg-red-600 py-2 hover:bg-red-700"
        >
          Delete
        </Button>
      </div>
    </form>
  );
});

export { PostalCodeRow };
