function PostalCodesResult({ searchResult }) {
  if (!searchResult || searchResult.length === 0) {
    return (
      <section className="flex justify-center items-center p-4">
        <p className="text-gray-500 dark:text-gray-300">
          No results to display.
        </p>
      </section>
    );
  }
  return (
    <section className="flex flex-col justify-center items-center w-full">
      <ul className="w-full max-w-4xl max-h-150 overflow-auto border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700">
        <li className="text-center grid gap-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md font-bold text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-600 grid-cols-3 mb-3">
          <div>Code</div>
          <div>City</div>
          <div>Post</div>
        </li>
        {searchResult.map((result) => {
          return (
            <li
              className="grid gap-1 w-full p-2 grid-cols-3 rounded border border-transparent hover:border-gray-200 dark:hover:border-gray-500"
              key={result.code}
            >
              <div>{result.code}</div>
              <div>{result.city}</div> <div>{result.post}</div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export { PostalCodesResult };
