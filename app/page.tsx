"use client";

import { useState } from "react";
import { useChat } from "ai/react";

export default function Home() {
  const [balance, setBalance] = useState<string | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  const [contextUrl, setContextUrl] = useState("");
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({ body: { contextUrl } });

  const [agentUrl, setAgentUrl] = useState("");
  const [agentResult, setAgentResult] = useState<string | null>(null);
  const [agentLoading, setAgentLoading] = useState(false);
  const [agentError, setAgentError] = useState<string | null>(null);

  const checkBalance = async () => {
    setBalanceLoading(true);
    setBalanceError(null);
    try {
      const res = await fetch("/api/balance");
      const data = await res.json();
      if (data.error) {
        setBalanceError(data.error);
      } else {
        setBalance(`${data.balanceSats} sats`);
      }
    } catch {
      setBalanceError("Failed to fetch balance");
    } finally {
      setBalanceLoading(false);
    }
  };

  const fetchUrl = async () => {
    if (!agentUrl.trim()) return;
    setAgentLoading(true);
    setAgentError(null);
    setAgentResult(null);
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: agentUrl }),
      });
      const data = await res.json();
      if (data.error) {
        setAgentError(data.error);
      } else {
        setAgentResult(JSON.stringify(data, null, 2));
      }
    } catch {
      setAgentError("Request failed");
    } finally {
      setAgentLoading(false);
    }
  };

  const accent = "#00ff88";
  const bg = "#0a0a0a";
  const text = "#ededed";
  const muted = "#777";
  const border = "#1e1e1e";
  const inputBg = "#111";

  const sectionStyle: React.CSSProperties = {
    borderTop: `1px solid ${border}`,
    padding: "32px 0",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: accent,
    marginBottom: 12,
    display: "block",
  };

  const inputStyle: React.CSSProperties = {
    background: inputBg,
    border: `1px solid ${border}`,
    color: text,
    fontFamily: "monospace",
    fontSize: 14,
    padding: "10px 14px",
    borderRadius: 4,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };

  const buttonStyle: React.CSSProperties = {
    background: accent,
    color: "#0a0a0a",
    border: "none",
    fontFamily: "monospace",
    fontSize: 13,
    fontWeight: 700,
    padding: "10px 20px",
    borderRadius: 4,
    cursor: "pointer",
    letterSpacing: "0.04em",
  };

  const buttonDisabled: React.CSSProperties = {
    ...buttonStyle,
    opacity: 0.5,
    cursor: "not-allowed",
  };

  const errorStyle: React.CSSProperties = {
    color: "#ff4444",
    fontSize: 13,
    marginTop: 8,
  };

  const resultStyle: React.CSSProperties = {
    background: inputBg,
    border: `1px solid ${border}`,
    borderRadius: 4,
    padding: "12px 16px",
    fontSize: 13,
    color: text,
    marginTop: 12,
    overflowX: "auto",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  };

  return (
    <div
      style={{
        background: bg,
        color: text,
        fontFamily: "monospace",
        minHeight: "100vh",
        margin: 0,
        padding: 0,
      }}
    >
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "48px 24px 80px",
        }}
      >
        {/* ── Header ── */}
        <header style={{ paddingBottom: 40 }}>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              margin: "0 0 12px",
              letterSpacing: "-0.02em",
            }}
          >
            ZBD{" "}
            <span style={{ color: accent, fontWeight: 400 }}>×</span>{" "}
            Vercel Agent Template
          </h1>
          <p
            style={{
              color: muted,
              fontSize: 14,
              lineHeight: 1.6,
              margin: 0,
              maxWidth: 540,
            }}
          >
            A Next.js starter for building AI agents that can pay for premium
            content and sell their own. Check your wallet, chat with context,
            and explore the payment endpoints below.
          </p>
        </header>

        {/* ── 1. Balance ── */}
        <section style={sectionStyle}>
          <span style={labelStyle}>Wallet Balance</span>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button
              onClick={checkBalance}
              disabled={balanceLoading}
              style={balanceLoading ? buttonDisabled : buttonStyle}
            >
              {balanceLoading ? "Checking…" : "Check Balance"}
            </button>
            {balance && (
              <span style={{ fontSize: 15, color: accent, fontWeight: 600 }}>
                {balance}
              </span>
            )}
          </div>
          {balanceError && <p style={errorStyle}>{balanceError}</p>}
        </section>

        {/* ── 2. Chat ── */}
        <section style={sectionStyle}>
          <span style={labelStyle}>Chat Demo</span>
          <p
            style={{
              color: muted,
              fontSize: 13,
              margin: "0 0 16px",
              lineHeight: 1.5,
            }}
          >
            Streaming chat powered by the Vercel AI SDK. Optionally provide a
            paid context URL — the agent will fetch it via{" "}
            <span style={{ color: accent }}>zbdFetch</span> before responding.
          </p>

          <input
            type="text"
            placeholder="Context URL (optional, e.g. a paywalled endpoint)"
            value={contextUrl}
            onChange={(e) => setContextUrl(e.target.value)}
            style={{ ...inputStyle, marginBottom: 12 }}
          />

          <div
            style={{
              background: inputBg,
              border: `1px solid ${border}`,
              borderRadius: 4,
              height: 240,
              overflowY: "auto",
              padding: "12px 16px",
              marginBottom: 12,
            }}
          >
            {messages.length === 0 && (
              <p style={{ color: muted, fontSize: 13, margin: 0 }}>
                No messages yet. Type below to start chatting.
              </p>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  marginBottom: 12,
                  fontSize: 13,
                  lineHeight: 1.55,
                }}
              >
                <span
                  style={{
                    color: m.role === "user" ? muted : accent,
                    fontWeight: 600,
                    marginRight: 8,
                  }}
                >
                  {m.role === "user" ? "you" : "ai"}
                </span>
                <span style={{ color: text }}>{m.content}</span>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", gap: 8 }}
          >
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Send a message…"
              style={{ ...inputStyle, flex: 1 }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              style={
                isLoading || !input.trim() ? buttonDisabled : buttonStyle
              }
            >
              {isLoading ? "…" : "Send"}
            </button>
          </form>
        </section>

        {/* ── 3. Buy-side Agent ── */}
        <section style={sectionStyle}>
          <span style={labelStyle}>Buy-Side Agent</span>
          <p
            style={{
              color: muted,
              fontSize: 13,
              margin: "0 0 16px",
              lineHeight: 1.5,
            }}
          >
            Fetch any URL through the agent — if it hits a 402 paywall, the
            agent pays automatically with sats.
          </p>

          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              placeholder="https://example.com/api/premium"
              value={agentUrl}
              onChange={(e) => setAgentUrl(e.target.value)}
              style={{ ...inputStyle, flex: 1 }}
            />
            <button
              onClick={fetchUrl}
              disabled={agentLoading || !agentUrl.trim()}
              style={
                agentLoading || !agentUrl.trim()
                  ? buttonDisabled
                  : buttonStyle
              }
            >
              {agentLoading ? "Fetching…" : "Fetch"}
            </button>
          </div>

          {agentError && <p style={errorStyle}>{agentError}</p>}
          {agentResult && (
            <pre style={resultStyle}>{agentResult}</pre>
          )}
        </section>

        {/* ── 4. Sell-side Info ── */}
        <section style={sectionStyle}>
          <span style={labelStyle}>Sell-Side Endpoint</span>
          <p
            style={{
              color: muted,
              fontSize: 13,
              margin: "0 0 16px",
              lineHeight: 1.5,
            }}
          >
            Your app includes a paywalled endpoint at{" "}
            <span style={{ color: accent }}>/api/premium</span>. It returns a
            402 with an L402 challenge — any agent with{" "}
            <span style={{ color: accent }}>zbdFetch</span> can pay and
            access it automatically.
          </p>
          <pre
            style={{
              background: inputBg,
              border: `1px solid ${border}`,
              borderRadius: 4,
              padding: "14px 18px",
              fontSize: 13,
              color: text,
              margin: 0,
              overflowX: "auto",
            }}
          >
            curl http://localhost:3000/api/premium
          </pre>
        </section>
      </div>
    </div>
  );
}
