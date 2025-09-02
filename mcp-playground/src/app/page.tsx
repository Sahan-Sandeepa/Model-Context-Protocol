"use client";
import styles from "./Home.module.css";
import EmailForm from "./components/EmailForm";
import ChatMCP from "./components/ChatMCP";

export default function HomePage() {
  const API_URL = "https://model-context-protocol-production-9d8f.up.railway.app";

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Welcome to Your Dashboard</h1>

      <section className={`${styles.section} ${styles.chatSection}`}>
        <ChatMCP apiUrl={API_URL} />
      </section>

      <section className={`${styles.section} ${styles.emailSection}`}>
        <EmailForm />
      </section>
    </main>
  );
}