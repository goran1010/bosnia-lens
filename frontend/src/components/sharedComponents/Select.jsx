function Select({ children, className = "", ...props }) {
  const baseClassName =
    "control-input p-2 rounded cursor-pointer focus:ring-2 text-sm";

  return (
    <select className={`${baseClassName} ${className}`} {...props}>
      {children}
    </select>
  );
}

export { Select };
