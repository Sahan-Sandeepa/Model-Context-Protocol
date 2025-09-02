# 📄 CV Chat & Email App

This is a **Next.js 15+ application** that allows users to:
- 💬 Ask questions about their CV via a Chat interface.
- 📧 Send emails using EmailJS integration.

---

## ✨ Features
- **ChatMCP Component** → Sends questions to a backend API and displays answers.
- **EmailForm Component** → Sends structured emails through EmailJS.
- **Environment-based configuration** for easy deployment.
- **TypeScript + CSS Modules** for type safety and modular styling.

---

## 🛠️ Technologies Used:
- Next.js 15+
- React 19+
- TypeScript
- CSS Modules
- EmailJS
- Fetch API

---

## 📦 Installation

```bash
git clone <this-repo>
cd mcp-playground && cd mcp-cv-server
npm install
```

## 🚀 Run the Project

Start the client server:
```bash
npm run dev
```
Start the backend server:
```bash
npm run dev
```

## 🔐 Environment Variables

Create a .env.local file in the project root:
```bash
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_USER_ID=your_public_key
NEXT_PUBLIC_CHAT_API_URL=http://localhost:5000   # or your API endpoint
```
