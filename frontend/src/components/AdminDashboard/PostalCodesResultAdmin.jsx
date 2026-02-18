const currentUrl = import.meta.env.VITE_BACKEND_URL;

function PostalCodesResultAdmin({ searchResult }) {
  async function handleDelete(e) {
    const code = e.target.dataset.postalcode;
    const response = await fetch(
      `${currentUrl}/admin/postal-codes/?code=${code}`,
      {
        mode: "cors",
        method: "delete",
        credentials: "include",
      },
    );
    const result = await response.json();

    console.log(result);
  }

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
        <li className="grid gap-1 w-full p-2 border border-gray-300 rounded-md mb-4 grid-cols-4 font-bold">
          <div>Code</div>
          <div>City</div>
          <div>Post</div>
        </li>
        {searchResult.map((result) => {
          return (
            <li className="grid gap-1 w-full p-1 grid-cols-4" key={result.code}>
              <div>{result.code}</div>
              <div>{result.city}</div> <div>{result.post}</div>{" "}
              <div>
                <button
                  data-postalcode={result.code}
                  onClick={handleDelete}
                  className="bg-red-400 text-white p-2 rounded-md hover:bg-red-700 hover:cursor-pointer active:scale-98"
                >
                  Delete row
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export { PostalCodesResultAdmin };
