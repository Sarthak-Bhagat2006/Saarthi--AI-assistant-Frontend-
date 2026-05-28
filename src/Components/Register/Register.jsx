import { MyContext } from "../../Context/MyContext";
import "./Register.css";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import api from "../../api";

function Register() {
  const { isLogin, setIsLogin, isForgotPass, setForgotPass } =
    useContext(MyContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const responseGoogle = async (authResult) => {
    try {
      if (!authResult.code) {
        throw new Error("Google authentication failed");
      }

      // Send code to backend
      const response = await api(authResult.code);
      console.log("Google backend response:", response);

      if (!response.success) {
        setErrorMsg(response.message || "Google login failed");
        setIsError(true);
        return;
      }

      // Save auth data
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      setIsLogin(true);

      navigate("/dashboard");
    } catch (error) {
      console.error("Google login error:", error);
      setErrorMsg("Google login failed");
      setIsError(true);
    }
  };

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    redirect_uri: window.location.origin,
    onSuccess: responseGoogle,
    onError: responseGoogle,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const checkLogin = () => {
    setIsLogin(true);
    setIsError(false);
    setForgotPass(false);
  };

  const checkRegister = () => {
    setIsLogin(false);
    setIsError(false);
    setForgotPass(false);
  };

  const resetPass = (e) => {
    setForgotPass(true);
    setIsError(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "https://saarthi-ai-assistant-backend-4.onrender.com/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email,
          }),
        }
      );

      const response = await res.json();

      if (!response.success) {
        setErrorMsg(response.message);
        setIsError(true);
        return;
      }

      alert("Reset link sent to your email");
    } catch (error) {
      setErrorMsg(error.message);
      setIsError(true);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setIsError(false);
    setErrorMsg("");

    try {
      const res = await fetch(
        "https://saarthi-ai-assistant-backend-4.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        }
      );

      const response = await res.json();
      console.log(response);

      if (!response.success) {
        setErrorMsg(response.message || "Something went wrong");
        setIsError(true);
        return;
      }

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      // Mark as logged in
      setIsLogin(true);

      // Navigate to dashboard
      navigate("/dashboard");
      window.location.reload();
    } catch (error) {
      console.log(error);
      setErrorMsg(error.message);
      setIsError(true);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setIsError(false);
    setErrorMsg("");

    try {
      const res = await fetch(
        "https://saarthi-ai-assistant-backend-4.onrender.com/api/auth/signUp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: form.name,
            email: form.email,
            password: form.password,
          }),
        }
      );

      const response = await res.json();
      console.log(response);

      // If error
      if (!response.success) {
        setErrorMsg(response.message || "Something went wrong");
        setIsError(true);
        return;
      }

      // Save token
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      navigate("/dashboard");
      // Mark as logged in
      setIsLogin(true);
      window.location.reload();
    } catch (error) {
      console.log(error);
      setErrorMsg(error.message);
      setIsError(true);
    }
  };

  return (
    <div className="register-container">
      <div className="card">
        <h1 className="title">
          {isForgotPass
            ? "Forgot Password"
            : isLogin
            ? "Login as User"
            : "Register as User"}
        </h1>

        {isForgotPass ? (
          <form onSubmit={handleForgotPassword}>
            <label className="label">
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                placeholder="you@company.com"
                onChange={handleChange}
              />
            </label>

            <div className="error">
              <p>{isError ? errorMsg : ""}</p>
            </div>

            <button type="submit" className="btn">
              Send Reset Link
            </button>

            <div className="footer">
              Remember password?
              <a type="button" onClick={checkLogin}>
                Login
              </a>
            </div>
          </form>
        ) : (
          // LOGIN / REGISTER FORM

          <form onSubmit={isLogin ? handleLogin : handleRegister}>
            {!isLogin && (
              <label className="label">
                Username
                <input
                  name="name"
                  value={form.name}
                  placeholder="JohnDoe123"
                  onChange={handleChange}
                />
              </label>
            )}

            <label className="label">
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                placeholder="you@company.com"
                onChange={handleChange}
              />
            </label>

            <label className="label">
              Password
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
              />
            </label>

            <div className="error">
              <p>{isError ? errorMsg : ""}</p>
            </div>

            {isLogin && (
              <div className="footer">
                <a type="button" onClick={resetPass}>
                  Forgot Password?
                </a>
              </div>
            )}

            <button type="submit" className="btn">
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>
        )}

        {!isForgotPass && (
          <div className="footer">
            {isLogin ? (
              <>
                Don't have an account?
                <a type="button" onClick={checkRegister}>
                  Register
                </a>
              </>
            ) : (
              <>
                Already have an account?
                <a type="button" onClick={checkLogin}>
                  Login
                </a>
              </>
            )}
          </div>
        )}

        {/* GOOGLE LOGIN */}

        {!isForgotPass && (
          <div className="googleLogin">
            <button className="google-btn" onClick={googleLogin}>
              Continue with
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
                className="google-icon"
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;
