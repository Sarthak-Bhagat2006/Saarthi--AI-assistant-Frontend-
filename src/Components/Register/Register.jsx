import { MyContext } from "../../Context/MyContext";
import "./Register.css";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import api from "../../api";

function Register() {
  const { isLogin, setIsLogin, isRegister, setIsRegister } =
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
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const checkLogin = () => {
    setIsLogin(true);
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
        {isLogin ? (
          <h1 className="title">Login as User</h1>
        ) : (
          <h1 className="title">Register as User</h1>
        )}
        <form
          action="submit"
          onSubmit={isLogin ? handleLogin : handleRegister}
          autoComplete="off"
        >
          {isLogin ? (
            ""
          ) : (
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
          {!isLogin ? (
            <button type="submit" className="btn">
              SignUp
            </button>
          ) : (
            <button type="submit" className="btn">
              Login
            </button>
          )}
        </form>
        {!isLogin ? (
          <div className="footer">
            Already have an account? <a onClick={checkLogin}>Log in</a>
          </div>
        ) : (
          ""
        )}

        <div className="googleLogin">
          <button className="google-btn" onClick={googleLogin}>
            Continue with{" "}
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="google-icon"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
