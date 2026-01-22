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
