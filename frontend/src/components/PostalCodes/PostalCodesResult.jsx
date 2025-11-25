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
                <div>{result.place}</div>
                <div>{result.code}</div> <div>{result.entity}</div>
              </li>
            );
          })}
      </ul>
    </section>
  );
}
