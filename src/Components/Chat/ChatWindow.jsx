import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "../../Context/MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { PropagateLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    setCurrThreadId,
    currThreadId,
    setPrevChats,
    setNewChat,
    setToken,
    setUser,
    setIsRegister,
    setAllThreads,
  } = useContext(MyContext);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const getReply = async () => {
    if (!prompt) return;
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not authenticated. Please login.");
      navigate("/");
      return;
    }
    setLoading(true);
    setNewChat(false);
    try {
      const response = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: prompt, threadId: currThreadId }),
      });

      const res = await response.json();
      setReply(res.reply);
    } catch (e) {
      console.log("Fetch Error:", e);
    }

    setLoading(false);
  };

  // FIXED useEffect
  useEffect(() => {
    if (!reply) return;

    setPrevChats((prev) => [
      ...prev,
      { role: "user", content: prompt },
      { role: "assistant", content: reply },
    ]);

    setPrompt("");
    setReply(null); // important fix
  }, [reply]);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Clear React state
    setToken(null);
    setUser(null);
    setPrevChats([]);
    setNewChat(true);
    setCurrThreadId(null);
    setAllThreads([]);

    // Redirect
    navigate("/");
  };

  const handleAbout = () => {
    setIsRegister(false);
    navigate("/");
  };

  return (
    <div className="chatWindow">
      <div className="navbar">
        <button className="about-btn" onClick={handleAbout}>
          About <i className="fa-solid fa-arrow-right"></i>
        </button>

        <div className="btns">
          <button className="nav-btn logout" onClick={handleLogout}>
            <span>Logout</span>
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
          </button>
        </div>
      </div>

      <Chat />

      <PropagateLoader color="white" loading={loading} />

      <div className="chatInput">
        <div className="userBox">
          <input
            type="text"
            placeholder="Ask anything..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && getReply()}
          />

          <div
            id="submit"
            onClick={!loading ? getReply : null}
            style={{ cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? (
              <i className="fa-solid fa-circle"></i>
            ) : (
              <i className="fa-solid fa-paper-plane"></i>
            )}
          </div>
        </div>

        <p className="assistant-note">
          Sarthi can make mistakes. It might take some time to answer.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
