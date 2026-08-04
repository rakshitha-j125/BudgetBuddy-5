import {
  CheckCircle2,
  XCircle,
} from "lucide-react";

const PasswordStrength = ({ password }) => {
  const rules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const score = Object.values(rules).filter(Boolean).length;

  const getStrength = () => {
    if (score <= 2)
      return {
        label: "Weak",
        color: "bg-red-500",
        width: "w-1/3",
        text: "text-red-500",
      };

    if (score <= 4)
      return {
        label: "Medium",
        color: "bg-yellow-500",
        width: "w-2/3",
        text: "text-yellow-500",
      };

    return {
      label: "Strong",
      color: "bg-green-500",
      width: "w-full",
      text: "text-green-500",
    };
  };

  const strength = getStrength();

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

      <div className="mb-2 flex items-center justify-between">
        <span className="font-semibold text-slate-700">
          Password Strength
        </span>

        <span className={`font-bold ${strength.text}`}>
          {strength.label}
        </span>
      </div>

      {/* Progress Bar */}

      <div className="mb-4 h-2 w-full rounded-full bg-slate-200">

        <div
          className={`h-2 rounded-full transition-all duration-500 ${strength.color} ${strength.width}`}
        ></div>

      </div>

      <div className="space-y-2">

        <Rule
          ok={rules.length}
          text="Minimum 8 characters"
        />

        <Rule
          ok={rules.uppercase}
          text="One uppercase letter"
        />

        <Rule
          ok={rules.lowercase}
          text="One lowercase letter"
        />

        <Rule
          ok={rules.number}
          text="One number"
        />

        <Rule
          ok={rules.special}
          text="One special character"
        />

      </div>

    </div>
  );
};

const Rule = ({ ok, text }) => {
  return (
    <div className="flex items-center gap-2">

      {ok ? (
        <CheckCircle2
          size={18}
          className="text-green-500"
        />
      ) : (
        <XCircle
          size={18}
          className="text-red-500"
        />
      )}

      <span
        className={
          ok
            ? "text-green-600"
            : "text-slate-500"
        }
      >
        {text}
      </span>

    </div>
  );
};

export default PasswordStrength;