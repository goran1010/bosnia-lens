import { forwardRef } from "react";

const Input = forwardRef(function Input({ className = "", ...props }, ref) {
  const baseStyles =
    "control-input block w-full px-3 py-2 rounded-md shadow-sm " +
    "sm:text-sm " +
    "invalid:border-red-500 focus:invalid:ring-red-500 focus:invalid:border-red-500 " +
    "dark:invalid:border-red-500 dark:focus:invalid:ring-red-500 dark:focus:invalid:border-red-500";

  return (
    <input ref={ref} className={`${baseStyles} ${className}`} {...props} />
  );
});

export { Input };
