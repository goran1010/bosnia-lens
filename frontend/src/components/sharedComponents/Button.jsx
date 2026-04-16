function Button({ children, className = "", type = "button", ...props }) {
  const baseClassName =
    "btn-primary w-full relative inline-flex items-center justify-center rounded-md p-2 text-sm cursor-pointer disabled:cursor-not-allowed";

  return (
    <button type={type} className={`${className} ${baseClassName}`} {...props}>
      {children}
    </button>
  );
}

export { Button };
