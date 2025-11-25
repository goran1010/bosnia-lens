export default function MessageCard({ message, setMessage }) {
  return (
    <div className="relative">
      <div className=" p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 border border-blue-300">
        <div className="mb-1 last:mb-0">
          <h2 className="text-2xl">{message[0]}</h2>
          {message[1] && message?.length > 0 && (
            <p>
              {message[1].map((element) => {
                return <li>{element.msg}</li>;
              })}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={() => setMessage([])}
        className="absolute top-1 right-1 text-blue-800 hover:text-blue-900"
        aria-label="Close message"
      >
        <svg
          className="cursor-pointer w-4 h-4"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
