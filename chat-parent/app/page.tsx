"use client";
import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      console.log("👨‍💻 Parent received:", event.data);
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const sendMessage = () => {
    const iframe = document.getElementById("chat-iframe") as HTMLIFrameElement;
    //You are not allowed to inspect this window - because it belongs to different origin.
    //You are allowed to reference a cross-origin window,
    //but NOT allowed to inspect it.
    //console.log("IFRAME:", iframe.contentWindow);

    //postMessage(data,targetOrigin)
    //Because postMessage is a special safe API designed for cross-origin communication.
    iframe?.contentWindow?.postMessage(
      {
        type: "SEND_MESSAGE",
        payload: {
          text: "Hello from parent 👋🏻",
        },
      },
      "http://localhost:3001" //targetOrigin
    );
  };

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        padding: 24,
        minHeight: "100vh",
        background: "#f5f7fb",
      }}
    >
      <h1 style={{ marginBottom: 8 }}>Host Application</h1>
      <p style={{ color: "#555", marginBottom: 24 }}>
        This represents the main website embedding a chat widget.
      </p>

      <button
        onClick={sendMessage}
        style={{
          padding: "10px 16px",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          marginBottom: 40,
        }}
      >
        Send Message to Chat Widget
      </button>

      {/* Chat Widget */}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 320,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "10px 14px",
            background: "#111827",
            color: "#fff",
            fontSize: 14,
          }}
        >
          Embedded Chat Widget
        </div>

        <iframe
          id="chat-iframe"
          src="http://localhost:3001/chat.html"
          style={{
            width: "100%",
            height: 220,
            border: "none",
          }}
        />
      </div>
    </div>
  );
};

export default Home;
