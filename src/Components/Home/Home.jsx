import "./Home.css";
import { useContext, useState, useEffect } from "react";
import { MyContext } from "../../Context/MyContext";
import { useNavigate } from "react-router-dom";
import Info from "./Info";
import Register from "../Register/Register";

function Home() {
  const { setUser, setToken, isRegister, setIsRegister, isLogin, setIsLogin } =
    useContext(MyContext);
  const navigate = useNavigate();
  const handleGuest = async () => {
    try {
      const res = await fetch(
        "https://saarthi-ai-assistant-backend-2.onrender.com/api/auth/guest",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await res.json();

      // Save in context
      setToken(data.token);
      setUser(data.user);

      // Save in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect
      navigate("/dashboard");
      window.location.reload();

      // Auto logout after 5 mins
      setTimeout(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
      }, 5 * 60 * 1000);
    } catch (err) {
      console.error("Guest login failed:", err);
    }
  };

  const [today, setToday] = useState("");

  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setToday(formatted);
  }, []);

  const showRegister = () => {
    setIsRegister(true);
    setIsLogin(false);
  };
  const showInfo = () => setIsRegister(false);

  return (
    <div className="container">
      <div className="nav">
        <span className="logo">
          <img src="/logo.png" className="logo-png" />
          <h3>Saarthi</h3>
        </span>
        <div className="auth-btn">
          <button className="signup" onClick={handleGuest}>
            Guest
          </button>
          <button className="signup" onClick={showRegister}>
            SignUp
          </button>
        </div>
      </div>

      <div className="section-wrapper">
        <div className="intro">
          <div className="date">{today}</div>
          <span className="heading">
            <h1>Introducing Saarthi</h1>
            <img src="/logo.png" className="logo-png" />
          </span>
          <button className="guest-btn" onClick={handleGuest}>
            Try Saarthi as{" "}
            <span>
              Guest <i className="fa-solid fa-location-arrow"></i>
            </span>
          </button>
        </div>
        {isRegister ? <Register /> : <Info />}
      </div>
    </div>
  );
}

export default Home;
