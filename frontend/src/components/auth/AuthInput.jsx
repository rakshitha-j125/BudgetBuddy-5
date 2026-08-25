import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const AuthInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password"
      ? showPassword
        ? "text"
        : "password"
      : type;

  return (
    <div className="mb-5">
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}

      {/* Input Box */}
      <div
        className={`flex items-center rounded-xl border bg-white px-4 py-3 transition-all duration-200 ${
          error
            ? "border-red-500 ring-2 ring-red-100"
            : "border-slate-300 focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-200"
        }`}
      >
        {/* Left Icon */}
        {Icon && (
          <Icon
            size={20}
            className="mr-3 text-slate-500"
          />
        )}

        {/* Input */}
        <input
          id={name}
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={type === "password" ? "current-password" : "off"}
          className="w-full bg-transparent text-slate-700 placeholder:text-slate-400 outline-none"
        />

        {/* Password Toggle */}
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="ml-2 text-slate-500 transition hover:text-indigo-600"
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
          >
            {showPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="mt-2 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default AuthInput;