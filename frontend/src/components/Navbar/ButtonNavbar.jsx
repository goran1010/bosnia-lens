function ButtonNavbar({ children, className = "", ...rest }) {
  return (
    <button
      className={`btn-surface min-w-20
        w-full relative inline-flex items-center justify-center rounded-md p-2 transition transform hover:cursor-pointer
        disabled:cursor-not-allowed
         ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export { ButtonNavbar };
