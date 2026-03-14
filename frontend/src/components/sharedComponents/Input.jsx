import { forwardRef } from "react";

const Input = forwardRef(function Input({ className = "", ...props }, ref) {
  const baseStyles =
    "block w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm " +
    "placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 " +
    "sm:text-sm dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 " +
    "dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500 " +
    "invalid:border-red-500 focus:invalid:ring-red-500 focus:invalid:border-red-500 " +
    "dark:invalid:border-red-500 dark:focus:invalid:ring-red-500 dark:focus:invalid:border-red-500";

  return (
    <input ref={ref} className={`${baseStyles} ${className}`} {...props} />
  );
});

export { Input };
