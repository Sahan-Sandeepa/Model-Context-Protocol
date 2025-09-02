"use client";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import styles from "./EmailForm.module.css";

const EmailForm = () => {
  const [emailData, setEmailData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const isValid = emailData.name && emailData.email.includes("@") && emailData.subject && emailData.message;

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      setStatus({ type: "error", text: "All fields are required and email must be valid." });
      return;
    }

    setLoading(true);
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        emailData,
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID!
      );
      setStatus({ type: "success", text: "✅ Email sent successfully!" });
      setEmailData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setStatus({
        type: "error",
        text: "Error sending email. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`${styles.section} ${styles.emailSection}`}>
      <h2>Send an Email</h2>
      <form onSubmit={handleSendEmail} className={styles.form}>
        <label>
          Name
          <input
            type="text"
            className={styles.input}
            value={emailData.name}
            onChange={(e) => setEmailData({ ...emailData, name: e.target.value })}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            className={styles.input}
            value={emailData.email}
            onChange={(e) => setEmailData({ ...emailData, email: e.target.value })}
          />
        </label>
        <label>
          Subject
          <input
            type="text"
            className={styles.input}
            value={emailData.subject}
            onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
          />
        </label>
        <label>
          Message
          <textarea
            className={styles.textarea}
            rows={4}
            value={emailData.message}
            onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
          />
        </label>
        <button
          type="submit"
          className={`${styles.button} ${styles.emailButton}`}
          disabled={loading || !isValid}
        >
          {loading ? "Sending..." : "Send Email"}
        </button>
      </form>
      {status && (
        <p
          role="status"
          className={`${styles.emailResult} ${
            status.type === "error" ? styles.error : styles.success
          }`}
        >
          {status.text}
        </p>
      )}
    </section>
  );
}

export default EmailForm;
