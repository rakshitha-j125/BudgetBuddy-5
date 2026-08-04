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
    <div className="w-full mb-5">
      {/* Label */}
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      {/* Input Box */}
      <div
        className={`flex items-center rounded-xl border bg-white px-4 py-3 transition-all duration-200
        ${
          error
            ? "border-red-500"
            : "border-slate-300 focus-within:border-indigo-600"
        }
        focus-within:ring-2 focus-within:ring-indigo-200`}
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
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
        />

        {/* Password Toggle */}
        {type === "password" && (
          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            className="text-slate-500 hover:text-indigo-600"
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