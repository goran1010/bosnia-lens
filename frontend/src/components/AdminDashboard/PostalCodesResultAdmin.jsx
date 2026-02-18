function PostalCodesResultAdmin({ searchResult }) {
  if (searchResult.length === 0) {
    return (
      <section className="flex justify-center items-center p-4">
        <p className="text-gray-500">No results to display.</p>
      </section>
    );
  }
  return (
    <section className="flex flex-col justify-center items-center">
      <ul className=" min-w-m max-w-4xl max-h-96 overflow-y-auto border border-gray-300 rounded-md p-2">
        <li className="grid gap-1 w-full p-2 border border-gray-300 rounded-md mb-4 grid-cols-3 font-bold">
          <div>Code</div>
          <div>City</div>
          <div>Post</div>
        </li>
        {searchResult.map((result) => {
          return (
            <li className="grid gap-1 w-full p-1 grid-cols-3" key={result.code}>
              <div>{result.code}</div>
              <div>{result.city}</div> <div>{result.post}</div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export { PostalCodesResultAdmin };
