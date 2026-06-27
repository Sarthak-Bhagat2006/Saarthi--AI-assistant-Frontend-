import { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MyContext } from "../../Context/MyContext";
import axios from "axios";

import "./ResetPassword.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { isLogin, setIsLogin } = useContext(MyContext);

  const backend_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      return setError("Passwords do not match");
    }

    try {
      const res = await axios.post(
        `${backend_URL}/api/auth/reset-password/${token}`,
        { password }
      );
      setMessage(res.data.message);
      setIsLogin(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="reset-wrapper">
      <div className="reset-card">
        <h2 className="reset-title">Reset Password</h2>

        <p className="reset-subtitle">
          Enter your new password below to secure your account.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            className="reset-input"
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            required
          />

          <input
            className="reset-input"
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value);
              setError("");
            }}
            required
          />

          {error && <p className="error-msg">{error}</p>}

          {message && <p className="success-msg">{message}</p>}

          <button className="reset-btn" type="submit">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
