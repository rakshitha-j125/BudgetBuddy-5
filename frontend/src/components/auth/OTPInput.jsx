import { useEffect, useRef, useState } from "react";

const OTP_LENGTH = 6;
const RESEND_TIME = 60;

const OTPInput = ({
  onComplete,
  onResend,
}) => {
  const [otp, setOtp] = useState(
    Array(OTP_LENGTH).fill("")
  );

  const [timer, setTimer] = useState(RESEND_TIME);

  const inputRefs = useRef([]);

  // Countdown Timer
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // OTP Completed
  useEffect(() => {
    const code = otp.join("");

    if (code.length === OTP_LENGTH && !code.includes("")) {
      onComplete?.(code);
    }
  }, [otp, onComplete]);

  // Handle Input
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace
  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      otp[index]
    ) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle Paste
  const handlePaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) return;

    const newOtp = Array(OTP_LENGTH).fill("");

    pasted.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);

    const focusIndex = Math.min(
      pasted.length,
      OTP_LENGTH - 1
    );

    inputRefs.current[focusIndex]?.focus();
  };

  // Resend OTP
  const handleResend = () => {
    setOtp(Array(OTP_LENGTH).fill(""));
    setTimer(RESEND_TIME);

    inputRefs.current[0]?.focus();

    if (onResend) {
      onResend();
    }
  };

  return (
    <div>
      <div className="flex justify-center gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={digit}
            onChange={(e) =>
              handleChange(e.target.value, index)
            }
            onKeyDown={(e) =>
              handleKeyDown(e, index)
            }
            onPaste={handlePaste}
            className="
              h-14
              w-14
              rounded-xl
              border
              border-slate-300
              text-center
              text-xl
              font-bold
              outline-none
              transition-all
              duration-300
              focus:border-indigo-600
              focus:ring-4
              focus:ring-indigo-200
            "
          />
        ))}
      </div>

      <div className="mt-6 text-center">
        {timer > 0 ? (
          <p className="text-slate-500">
            Resend OTP in{" "}
            <span className="font-semibold text-indigo-600">
              {timer}s
            </span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="
              font-semibold
              text-indigo-600
              transition
              hover:text-indigo-700
            "
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
};

export default OTPInput;