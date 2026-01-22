"use client";
import { useEffect, useRef, useState } from "react";

const Home = () => {
  const iframeREF = useRef<HTMLIFrameElement>(null);
  const messageQueue = useRef<any[]>([]);
  const [isIframeReady, setIsIframeReady] = useState(false);

  const now = () => new Date().toLocaleTimeString();

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === "IFRAME_READY") {
        console.log(`[${now()}] ✅ Parent received IFRAME_READY`);
        setIsIframeReady(true);

        console.log(
          `[${now()}] 🔁 Flushing ${
            messageQueue.current.length
          } queued messages`
        );

        //Flush the queued message
        messageQueue.current.forEach((msg) => {
          console.log(`[${now()}] 🚀 Sending queued message`, msg);
          iframeREF.current?.contentWindow?.postMessage(
            msg,
            "http://localhost:3001"
          );
        });
        messageQueue.current = [];
        return;
      }
      console.log(`[${now()}] 👨‍💻 Parent received:`, event.data);
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const sendMessage = () => {
    //const iframe = document.getElementById("chat-iframe") as HTMLIFrameElement;

    //You are not allowed to inspect this window - because it belongs to different origin.
    //You are allowed to reference a cross-origin window,
    //but NOT allowed to inspect it.
    //console.log("IFRAME:", iframe.contentWindow);

    //postMessage(data,targetOrigin)
    //Because postMessage is a special safe API designed for cross-origin communication.
    const message = {
      type: "SEND_MESSAGE",
      payload: {
        text: `Hello from parent 👋🏻 ${new Date()}`,
        sentAt: now(),
      },
    };

    if (!isIframeReady) {
      console.log(`[${now()}] ⏳ Iframe not ready → queueing message`);
      messageQueue.current.push(message);
      return;
    }

    iframeREF?.current?.contentWindow?.postMessage(
      message,
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
          ref={iframeREF}
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
