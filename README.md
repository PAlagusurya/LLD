# Embeddable Chat Widget (Iframe – Level 0)

This is a simple learning project to understand how a parent application communicates with an embedded iframe using the browser `postMessage` API.

The goal of Level 0 is to build confidence by making two browser contexts talk to each other.

---

## What this app does

- A Next.js parent app embeds a chat widget using an iframe
- Parent sends a message to the iframe
- Iframe displays the message and sends a response back
- Both sides log messages to the console

---

## Tech Stack

- Parent App: Next.js (React)
- Chat Widget: Plain HTML + Vanilla JavaScript
- Communication: `window.postMessage`

---

## How to Run

### Start Parent App

```bash
cd chat-parent
npm install
npm run dev
```

Different ports = **different origins**  
Different origins = **browser-enforced isolation**

---

# LEVEL 0 — Iframe Basics & postMessage

### What was built

- Parent embeds a chat widget using `<iframe>`
- Parent sends messages to iframe
- Iframe replies back using `postMessage`

### Key learning

- iframe is a **separate execution context**
- Parent cannot access iframe DOM
- iframe cannot access parent DOM
- Communication must be **event-based**

---

## Core Concepts Learned (Level 0)

### Why is the chat widget served on a different port?

Browser security is based on **origin**:

origin = protocol + domain + port

Serving the iframe on `localhost:3001` ensures:

- Real isolation
- Real browser security behavior
- Real-world widget simulation

---

### Why can’t we do `console.log(iframe.contentWindow)`?

Because:

- The iframe is cross-origin
- Browser allows **referencing** a cross-origin window
- Browser blocks **inspecting** it

> You can talk to a cross-origin iframe, but you cannot peek inside it.

---

### Why do we attach `window.addEventListener("message")` only once?

Question:

> Does always listening cause performance issues?

Answer:

- Event listeners are idle until events arrive
- Zero CPU usage when idle
- Avoids race conditions

Important distinction:

- `useEffect` runs once (setup)
- Handler runs whenever a message arrives

---

### Why does `useEffect` run once but handler runs many times?

Answer:

- `useEffect` registers the listener
- Browser owns the listener afterward
- Browser invokes handler whenever events occur

> useEffect sets up the listener; the browser triggers the handler.

# LEVEL 1 — Security (Origin Allowlist)

### Problem

By default:

- Any website can embed the iframe
- Any website can send messages

This is unsafe.

---

## Solution: Origin Allowlist (Iframe-side)

```js
const ALLOWED_ORIGINS = ["http://localhost:3000"];
```

# LEVEL 2 — Handshake & Race Conditions (MOST IMPORTANT)

## HANDSHAKE FLOW

Iframe loads
↓
Iframe attaches message listener
↓
Iframe sends IFRAME_READY
↓
Parent receives READY
↓
Parent flushes queued messages
↓
Normal communication starts

> Iframe communication is asynchronous and can suffer from race conditions if messages are sent before listeners are attached. We solve this using a handshake protocol where the iframe sends a READY signal and the parent queues messages until readiness is confirmed.
