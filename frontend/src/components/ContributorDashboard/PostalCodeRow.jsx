import { memo } from "react";

const PostalCodeRow = memo(function PostalCodeRow({
  result,
  onChange,
  onSubmit,
  onDelete,
}) {
  return (
    <form onSubmit={onSubmit} className="grid gap-1 w-full p-1 grid-cols-5">
      <div className="flex justify-center items-center">{result.code}</div>
      <input
        name="city"
        type="text"
        value={result.city || ""}
        onChange={(e) => onChange(result.code, e.target.name, e.target.value)}
        data-code={result.code}
      />
      <input
        data-code={result.code}
        name="post"
        type="text"
        value={result.post || ""}
        onChange={(e) => onChange(result.code, e.target.name, e.target.value)}
      />
      <div>
        <button
          type="submit"
          className="w-full bg-blue-400 text-white p-2 rounded-md hover:bg-blue-700 hover:cursor-pointer active:scale-98"
        >
          Save
        </button>
      </div>
      <div>
        <button
          type="button"
          data-postalcode={result.code}
          onClick={onDelete}
          className="w-full bg-red-400 text-white p-2 rounded-md hover:bg-red-700 hover:cursor-pointer active:scale-98"
        >
          Delete
        </button>
      </div>
    </form>
  );
});

export { PostalCodeRow };
