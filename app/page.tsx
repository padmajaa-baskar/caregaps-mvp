"use client";

import { useRef, useState } from "react";

type Line = { role: string; text: string };
const GREEN = "#2e7d6b";

export default function Page() {
  const [name, setName] = useState("Asha");
  const [status, setStatus] = useState<
    "idle" | "connecting" | "live" | "ended" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  // SDK types aren't known at build time.
  const agentRef = useRef<any>(null);

  async function start() {
    setError(null);
    setLines([]);
    setStatus("connecting");
    try {
      const mod: any = await import("sarvam-conv-ai-sdk/browser");
      const { ConversationAgent, BrowserAudioInterface, InteractionType } = mod;
      const agent = new ConversationAgent({
        apiKey: "", // the server proxy injects the real key
        baseUrl: "/api/sarvam/",
        config: {
          org_id: process.env.NEXT_PUBLIC_SARVAM_ORG_ID,
          workspace_id: process.env.NEXT_PUBLIC_SARVAM_WORKSPACE_ID,
          app_id: process.env.NEXT_PUBLIC_SARVAM_APP_ID,
          version: Number(process.env.NEXT_PUBLIC_SARVAM_APP_VERSION) || undefined,
          user_identifier: "evaluator",
          user_identifier_type: "custom",
          interaction_type: InteractionType?.CALL ?? "call",
          input_sample_rate: 16000,
          output_sample_rate: 16000,
          agent_variables: { patient_first_name: name },
        },
        audioInterface: new BrowserAudioInterface(),
        transcriptCallback: (t: any) => {
          const text = t?.text ?? t?.transcript ?? "";
          if (text)
            setLines((p) => [
              ...p,
              { role: String(t?.role ?? t?.speaker ?? "agent"), text: String(text) },
            ]);
        },
        endCallback: () => setStatus("ended"),
      });
      agentRef.current = agent;
      await agent.start(); // inside the click handler so audio can play
      await agent.waitForConnect?.(10);
      setStatus("live");
    } catch (e: any) {
      setError(e?.message ?? String(e));
      setStatus("error");
    }
  }

  async function stop() {
    try {
      await agentRef.current?.stop?.();
    } finally {
      setStatus("ended");
    }
  }

  const busy = status === "connecting" || status === "live";

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "48px 20px" }}>
      <div
        style={{
          fontSize: 13,
          letterSpacing: 1,
          textTransform: "uppercase",
          color: GREEN,
          fontWeight: 700,
        }}
      >
        CareGaps CCM
      </div>
      <h1 style={{ fontSize: 30, margin: "6px 0 4px" }}>Live pre-visit check-in</h1>
      <p style={{ color: "#5b6560", marginTop: 0 }}>
        A browser call with the care-gap voice agent. It reads a validated asthma
        check-in (ACT), records answers in the patient&apos;s own words, and never states
        a score. All data is synthetic.
      </p>

      <div
        style={{
          background: "#fff",
          border: "1px solid #e3ded5",
          borderRadius: 14,
          padding: 20,
          marginTop: 20,
        }}
      >
        <label
          style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6 }}
        >
          Patient first name (test variable)
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={busy}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #d8d2c7",
            fontSize: 15,
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
          {status !== "live" ? (
            <button
              onClick={() => void start()}
              disabled={status === "connecting" || !name.trim()}
              style={{
                background: GREEN,
                color: "#fff",
                border: 0,
                borderRadius: 8,
                padding: "10px 18px",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {status === "connecting" ? "Connecting…" : "Start check-in call"}
            </button>
          ) : (
            <button
              onClick={() => void stop()}
              style={{
                background: "#b4463a",
                color: "#fff",
                border: 0,
                borderRadius: 8,
                padding: "10px 18px",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              End call
            </button>
          )}
          <span style={{ fontSize: 13, color: "#5b6560" }}>
            {status === "idle" && "Allow the microphone when prompted."}
            {status === "connecting" && "Connecting…"}
            {status === "live" && "● Live — speak into your mic."}
            {status === "ended" && "Call ended."}
            {status === "error" && "Could not start the call."}
          </span>
        </div>

        {error && (
          <div
            style={{
              marginTop: 14,
              background: "#fbe9e7",
              border: "1px solid #f0c3bd",
              color: "#9a3328",
              borderRadius: 8,
              padding: "10px 12px",
              fontSize: 14,
              whiteSpace: "pre-wrap",
            }}
          >
            {error}
          </div>
        )}

        {lines.length > 0 && (
          <div
            style={{
              marginTop: 16,
              maxHeight: 280,
              overflowY: "auto",
              borderTop: "1px solid #eee",
              paddingTop: 12,
            }}
          >
            {lines.map((l, i) => (
              <p key={i} style={{ margin: "0 0 8px", fontSize: 14 }}>
                <b style={{ color: GREEN }}>{l.role}: </b>
                {l.text}
              </p>
            ))}
          </div>
        )}
      </div>

      <p style={{ fontSize: 12, color: "#8a9088", marginTop: 20 }}>
        Prototype on synthetic data. The agent collects only; scoring and clinician
        review happen separately in CARE.
      </p>
    </main>
  );
}
