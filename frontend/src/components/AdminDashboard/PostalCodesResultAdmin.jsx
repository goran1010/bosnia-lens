import { useRef } from "react";

const currentUrl = import.meta.env.VITE_BACKEND_URL;

function PostalCodesResultAdmin({ searchResult, setSearchResult }) {
  const codeInput = useRef();
  const cityInput = useRef();
  const postInput = useRef();

  async function handleEdit() {
    try {
      const code = codeInput.current.textContent;
      const city = cityInput.current.value;
      const post = postInput.current.value;

      const response = await fetch(
        `${currentUrl}/admin/postal-codes/?city=${city}&code=${code}&post=${post}`,
        {
          mode: "cors",
          method: "put",
          credentials: "include",
        },
      );
      const result = await response.json();

      console.log(result);

      //   if (response.ok) {
      //     const filteredSearchResult = searchResult.filter((result) => {
      //       return result.code !== Number(code);
      //     });
      //     setSearchResult(filteredSearchResult);
      //     return;
      //   }
      //   console.warn(result.error);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(e) {
    try {
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

      if (response.ok) {
        const filteredSearchResult = searchResult.filter((result) => {
          return result.code !== Number(code);
        });
        setSearchResult(filteredSearchResult);
        return;
      }
      console.warn(result.error);
    } catch (err) {
      console.error(err);
    }
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
        <li className="grid gap-1 w-full p-2 border border-gray-300 rounded-md mb-4 grid-cols-5 font-bold">
          <div>Code</div>
          <div>City</div>
          <div>Post</div>
        </li>
        {searchResult.map((result) => {
          return (
            <li className="grid gap-1 w-full p-1 grid-cols-5" key={result.code}>
              <div className="flex justify-center items-center" ref={codeInput}>
                {result.code}
              </div>
              <input
                type="text"
                defaultValue={result.city}
                id="city"
                ref={cityInput}
              />
              <input
                type="text"
                defaultValue={result.post}
                id="post"
                ref={postInput}
              />
              <div>
                <button
                  onClick={handleEdit}
                  className="bg-blue-400 text-white p-2 rounded-md hover:bg-blue-700 hover:cursor-pointer active:scale-98"
                >
                  Save Edit
                </button>
              </div>
              <div>
                <button
                  data-postalcode={result.code}
                  onClick={handleDelete}
                  className="bg-red-400 text-white p-2 rounded-md hover:bg-red-700 hover:cursor-pointer active:scale-98"
                >
                  Delete
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
