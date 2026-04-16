import { Spinner } from "../../utils/Spinner";

function Button({
  children,
  className = "",
  type = "button",
  loading = false,
  ...props
}) {
  const baseClassName =
    "btn-primary w-full relative inline-flex items-center justify-center rounded-md p-2 text-sm cursor-pointer disabled:cursor-not-allowed";

  return (
    <button
      type={type}
      className={`${className} ${baseClassName}`}
      disabled={loading || props.disabled}
      {...props}
    >
      <div
        className={`h-full w-full flex justify-center items-center absolute`}
      >
        {loading && <Spinner />}
      </div>
      <span className={`${loading ? "invisible" : "visible"}`}>{children}</span>
    </button>
  );
}

export { Button };
