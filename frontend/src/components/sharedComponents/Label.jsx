function Label({ children, className = "", ...props }) {
  const baseStyles = "label-muted block text-sm font-medium mb-1";

  return (
    <label className={`${baseStyles} ${className}`} {...props}>
      {children}
    </label>
  );
}

export { Label };
