import { useContext, useEffect, useState } from "react";
import "./Sidebar.css";
import { MyContext } from "../../Context/MyContext";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setCurrThreadId,
    setNewChat,
    setPrevChats,
    setPrompt,
    setReply,
  } = useContext(MyContext);

  const getAllThreads = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch(
        "https://saarthi-ai-assistant-backend-4.onrender.com/api/thread",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const res = await response.json();
      //we have to store ThreadId's and title threadId use to get previous chat display

      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      //console.log(filteredData);
      setAllThreads(filteredData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const getThreadChat = async (newThreadId) => {
    setCurrThreadId(newThreadId);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://saarthi-ai-assistant-backend-4.onrender.com0/api/thread/${newThreadId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const res = await response.json();
      console.log(res);
      setPrevChats(res);
      setNewChat(false);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteThread = async (threadId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://saarthi-ai-assistant-backend-4.onrender.com/api/thread/${threadId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const res = await response.json();
      console.log(res);

      //re-render all thread
      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== threadId)
      );

      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <button
        className="sidebar-toggle"
        onClick={() => setIsSidebarOpen((prev) => !prev)} // toggle true/false
      >
        {isSidebarOpen ? "×" : "☰"} {/* Show × when open, ☰ when closed */}
      </button>

      <section className={`sidebar ${isSidebarOpen ? "show" : ""}`}>
        {/* Back/close button on mobile */}

        <button className="top-btn" onClick={createNewChat}>
          <h3 className="logo">Sarthi</h3>
          <span>
            <i className="fa-solid fa-pen-to-square edit-icon"></i>
            <p>New</p>
          </span>
        </button>

        <h3 className="history-title">Your chats</h3>
        <ul className="history">
          {allThreads?.map((chat, idx) => (
            <li
              onClick={() => {
                getThreadChat(chat.threadId);
                setIsSidebarOpen(false); // auto-close sidebar on mobile
              }}
              key={idx}
              className={chat.threadId === currThreadId ? "active-chat" : ""}
            >
              {chat.title}
              <i
                className="fa-solid fa-trash-can delete-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteThread(chat.threadId);
                }}
              ></i>
            </li>
          ))}
        </ul>

        <div className="socials">
          <a href="https://linkedin.com/m/in/sarthak-bhagat-8984b9279/">
            <i className="fa-brands fa-square-linkedin"></i>
          </a>
          <a href="https://github.com/Sarthak-Bhagat2006">
            <i className="fa-brands fa-square-github"></i>
          </a>
        </div>
      </section>
    </>
  );
}

export default Sidebar;
