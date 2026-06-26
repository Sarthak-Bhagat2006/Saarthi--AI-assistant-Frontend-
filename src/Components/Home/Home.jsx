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

  const backend_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

  const handleGuest = async () => {
    try {
      const res = await fetch(`${backend_URL}/api/auth/guest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Guest login failed");
      }

      setToken(data.token);
      setUser(data.user);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err) {
      console.error("Guest login failed:", err);
      alert(err.message);
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
