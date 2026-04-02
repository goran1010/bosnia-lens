function Button({ children, className = "", type = "button", ...props }) {
  const baseClassName =
    "w-full relative inline-flex items-center justify-center rounded-md bg-blue-600 p-2 transition transform hover:cursor-pointer hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-500 disabled:text-gray-300 not-disabled:active:scale-95";

  return (
    <button type={type} className={`${className} ${baseClassName}`} {...props}>
      {children}
    </button>
  );
}

export { Button };
