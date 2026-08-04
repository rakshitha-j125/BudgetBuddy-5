import { useEffect, useRef, useState } from "react";

const OTP_LENGTH = 6;

const OTPInput = ({ onComplete }) => {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(60);

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

    if (code.length === OTP_LENGTH) {
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
      .trim()
      .slice(0, OTP_LENGTH);

    if (!/^\d+$/.test(pasted)) return;

    const newOtp = pasted.split("");

    while (newOtp.length < OTP_LENGTH) {
      newOtp.push("");
    }

    setOtp(newOtp);

    const nextIndex =
      Math.min(pasted.length, OTP_LENGTH - 1);

    inputRefs.current[nextIndex]?.focus();
  };

  // Resend OTP
  const handleResend = () => {
    setOtp(Array(OTP_LENGTH).fill(""));
    setTimer(60);
    inputRefs.current[0]?.focus();

    console.log("Resend OTP");
  };

  return (
    <div className="w-full">

      <div className="flex justify-center gap-3">

        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
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
            onClick={handleResend}
            className="
              font-semibold
              text-indigo-600
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