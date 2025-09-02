"use client";
import { useState, useRef } from "react";
import styles from "./ChatMCP.module.css";

interface ChatMCPProps {
  apiUrl: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

const ChatMCP = ({ apiUrl }: ChatMCPProps) => {
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAsk = async () => {
    if (!question.trim()) return;
    const userMessage: ChatMessage = { role: "user", text: question };
    setChat((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      const reply: ChatMessage = {
        role: "assistant",
        text: data.answer || "No answer found.",
      };
      setChat((prev) => [...prev, reply]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Error: " + (err instanceof Error ? err.message : String(err)),
        },
      ]);
    } finally {
      setQuestion("");
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <section className={`${styles.section} ${styles.chatSection}`}>
      <h2>Chat about your CV</h2>
      <div className={styles.chatBox}>
        {chat.map((msg, i) => (
          <div
            key={i}
            className={
              msg.role === "user" ? styles.userMessage : styles.assistantMessage
            }
          >
            <strong>{msg.role === "user" ? "You" : "Assistant"}:</strong>{" "}
            {msg.text}
          </div>
        ))}
        {loading && <div className={styles.loading}>Thinking...</div>}
      </div>

      <div className={styles.chatInputRow}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Ask a question..."
          className={styles.input}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleAsk();
            }
          }}
        />
        <button
          className={`${styles.button} ${styles.chatButton}`}
          onClick={handleAsk}
          disabled={loading}
        >
          {loading ? "..." : "Ask"}
        </button>
      </div>
    </section>
  );
}

export default ChatMCP;