function Label({ children, className = "", ...props }) {
  const baseStyles =
    "block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300";

  return (
    <label className={`${baseStyles} ${className}`} {...props}>
      {children}
    </label>
  );
}

export { Label };
