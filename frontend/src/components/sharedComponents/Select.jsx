function Select({ children, className = "", ...props }) {
  const baseClassName =
    "text-gray-800 dark:text-gray-200 p-2 rounded cursor-pointer border border-gray-400 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <select className={`${baseClassName} ${className}`.trim()} {...props}>
      {children}
    </select>
  );
}

export { Select };
