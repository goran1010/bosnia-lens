export default function PostalCodesResult({ searchResult }) {
  return (
    <section className="flex flex-col justify-center items-center">
      <ul className="flex flex-col">
        {searchResult &&
          searchResult.map((result) => {
            return (
              <li
                className="flex flex-1 justify-between items-center"
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
