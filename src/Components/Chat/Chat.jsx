import "./Chat.css";
import { useContext, useState, useEffect } from "react";
import { MyContext } from "../../Context/MyContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/atom-one-dark.css";

function Chat() {
  const { newChat, prevChats, isTyping, setIsTyping } = useContext(MyContext);
  const [typingIndex, setTypingIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [lastAssistantText, setLastAssistantText] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Detect NEW API message
  useEffect(() => {
    if (!prevChats || prevChats.length === 0) return;

    const lastMsg = prevChats[prevChats.length - 1];

    // Only start typing if a NEW assistant message appears
    if (lastMsg.role === "assistant" && lastMsg.content !== lastAssistantText) {
      setLastAssistantText(lastMsg.content);
      setIsTyping(true);
      setTypedText("");
      setTypingIndex(0);
    }
  }, [prevChats]);

  // Word-by-word typing
  useEffect(() => {
    if (!isTyping) return;

    const words = lastAssistantText.split(" ");

    if (typingIndex < words.length) {
      const timeout = setTimeout(() => {
        setTypedText((prev) => prev + words[typingIndex] + " ");
        setTypingIndex((i) => i + 1);
      }, 70); // typing speed

      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
    }
  }, [typingIndex, isTyping, lastAssistantText]);

  const copyMessage = async (text, idx) => {
    try {
      await navigator.clipboard.writeText(text);

      setCopiedIndex(idx);

      setTimeout(() => {
        setCopiedIndex(null);
      }, 1500);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {newChat && (
        <h1 className="welcome-text">
          Your personal assistant is here. What’s next?
        </h1>
      )}

      <div className="chats">
        {prevChats?.map((chat, idx) => {
          const isLast = idx === prevChats.length - 1;
          const showTyping = isLast && chat.role === "assistant" && isTyping;

          const displayText = showTyping ? typedText : chat.content;

          return (
            <div
              className={chat.role === "user" ? "userDiv" : "gptDiv"}
              key={idx}
            >
              {chat.role === "user" ? (
                <div className="userMessage">
                  {chat.content}

                  <button
                    className="copyBtn"
                    onClick={() => copyMessage(chat.content, idx)}
                  >
                    {copiedIndex === idx ? (
                      <i className="fa-solid fa-check"></i>
                    ) : (
                      <i className="fa-solid fa-copy"></i>
                    )}
                  </button>
                </div>
              ) : (
                <div className="gptMessage">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  >
                    {displayText}
                  </ReactMarkdown>

                  <button
                    className="copyBtn"
                    onClick={() => copyMessage(chat.content, idx)}
                  >
                    {copiedIndex === idx ? (
                      <i className="fa-solid fa-check"></i>
                    ) : (
                      <i className="fa-solid fa-copy"></i>
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Chat;
