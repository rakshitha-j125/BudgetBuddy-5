import { Loader2 } from "lucide-react";

const AuthButton = ({
  children,
  type = "submit",
  loading = false,
  disabled = false,
  onClick,
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`
        w-full
        rounded-xl
        bg-gradient-to-r
        from-indigo-600
        via-blue-600
        to-cyan-500
        py-3
        font-semibold
        text-white
        shadow-lg
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
        active:scale-95
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${className}
      `}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Please wait...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default AuthButton;