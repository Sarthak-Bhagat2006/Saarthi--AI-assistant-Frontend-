// Context/MyProvider.jsx
import { createContext, useState, useEffect } from "react";
import { v1 as uuidv1 } from "uuid";

export const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [lastAssistantText, setLastAssistantText] = useState("");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isRegister, setIsRegister] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  // Load token and user from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken) setToken(savedToken);
    if (savedUser && savedUser !== "undefined") {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("Failed to parse saved user:", err);
        setUser(null);
      }
    }
  }, []);

  return (
    <MyContext.Provider
      value={{
        prompt,
        setPrompt,
        reply,
        setReply,
        currThreadId,
        setCurrThreadId,
        prevChats,
        setPrevChats,
        newChat,
        setNewChat,
        allThreads,
        setAllThreads,
        typedText,
        setTypedText,
        isTyping,
        setIsTyping,
        lastAssistantText,
        setLastAssistantText,
        user,
        setUser,
        token,
        setToken,
        isRegister,
        setIsRegister,
        isLogin,
        setIsLogin,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
