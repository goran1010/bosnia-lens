function ButtonNavbar({ children, className, ...rest }) {
  return (
    <button
      className={`bg-gray-300 dark:bg-gray-800 border border-gray-500 dark:border-gray-400 text-gray-800 dark:text-white min-w-20
        w-full relative inline-flex items-center justify-center rounded-md p-2 transition transform hover:cursor-pointer hover:bg-gray-500
        disabled:cursor-not-allowed disabled:bg-blue-500 disabled:text-gray-300 not-disabled:active:scale-95
         ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export { ButtonNavbar };
