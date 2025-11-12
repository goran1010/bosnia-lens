export default function PostalCodes() {
  return (
    <main className="flex justify-center">
      <form action="">
        <label
          htmlFor="search-term"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Postal Code or Municipality
        </label>
        <div className="flex">
          <input
            type="text"
            name="search-term"
            id="search-term"
            className="block border border-gray-300 rounded-md p-2"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 hover:cursor-pointer active:scale-98"
          >
            Search
          </button>
        </div>
      </form>
    </main>
  );
}
