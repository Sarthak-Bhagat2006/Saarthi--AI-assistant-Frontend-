import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./VerifyEmail.css";

function VerifyEmail() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const email = state?.email;

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const backend_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${backend_URL}/api/auth/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const response = await res.json();

      if (!response.success) {
        setError(response.message);
        setLoading(false);
        return;
      }

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      setSuccess("Email verified successfully!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.log(err);
      setError("Something went wrong.");
    }

    setLoading(false);
  };

  const resendOTP = async () => {
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${backend_URL}/api/auth/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const response = await res.json();

      if (!response.success) {
        setError(response.message);
        return;
      }

      setSuccess("A new OTP has been sent to your email.");
    } catch (err) {
      console.log(err);
      setError("Unable to resend OTP.");
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-card">
        <h2 className="verify-title">Verify Your Email</h2>

        <p className="verify-text">
          Enter the 6-digit verification code sent to
        </p>

        <p className="verify-email">{email}</p>

        <label className="verify-label">
          Verification Code
          <input
            className="verify-input"
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
          />
        </label>

        {error && <p className="verify-error">{error}</p>}

        {success && <p className="verify-success">{success}</p>}

        <button className="verify-btn" onClick={verifyOTP} disabled={loading}>
          {loading ? "Verifying..." : "Verify Email"}
        </button>

        <div className="verify-footer">
          Didn't receive the code?
          <button onClick={resendOTP}>Resend OTP</button>
        </div>

        <div className="verify-timer">OTP expires in 10 minutes</div>
      </div>
    </div>
  );
}

export default VerifyEmail;
