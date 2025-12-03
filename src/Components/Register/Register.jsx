import { MyContext } from "../../Context/MyContext";
import "./Register.css";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

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
            password
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
      </div>
    </div>
  );
}

export default Register;
