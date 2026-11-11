"use client";

import { useRef, useState } from "react";

// The live browser web call. Requires a Sarvam *Voice Agents* runtime key
// (a paid capability) — on the current Model-API key it returns "Failed to
// fetch". Kept here at /call for when a Voice Agents plan is available; the
// home page is the care-team dashboard.

type Line = { role: string; text: string };
const GREEN = "#2e7d6b";

export default function CallPage() {
  const [name, setName] = useState("Asha");
  const [status, setStatus] = useState<
    "idle" | "connecting" | "live" | "ended" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const agentRef = useRef<any>(null);

  async function start() {
    setError(null);
    setLines([]);
    setStatus("connecting");
    try {
      const mod: any = await import("sarvam-conv-ai-sdk/browser");
      const { ConversationAgent, BrowserAudioInterface, InteractionType } = mod;
      const agent = new ConversationAgent({
        apiKey: "",
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
      await agent.start();
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
      <a href="/" style={{ color: GREEN, fontSize: 14, textDecoration: "none" }}>&larr; Back to dashboard</a>
      <h1 style={{ fontSize: 28, margin: "12px 0 4px" }}>Live pre-visit check-in (beta)</h1>
      <p style={{ color: "#5b6560", marginTop: 0, fontSize: 15 }}>
        Requires a Sarvam Voice Agents runtime plan. On a Model-API key this will show
        &ldquo;Failed to fetch&rdquo;.
      </p>
      <div style={{ background: "#fff", border: "1px solid #e3ded5", borderRadius: 14, padding: 20, marginTop: 16 }}>
        <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Patient first name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} disabled={busy}
          style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", borderRadius: 8, border: "1px solid #d8d2c7", fontSize: 15 }} />
        <div style={{ display: "flex", gap: 12, marginTop: 16, alignItems: "center" }}>
          {status !== "live" ? (
            <button onClick={() => void start()} disabled={status === "connecting" || !name.trim()}
              style={{ background: GREEN, color: "#fff", border: 0, borderRadius: 8, padding: "10px 18px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
              {status === "connecting" ? "Connecting…" : "Start check-in call"}
            </button>
          ) : (
            <button onClick={() => void stop()} style={{ background: "#b4463a", color: "#fff", border: 0, borderRadius: 8, padding: "10px 18px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>End call</button>
          )}
          <span style={{ fontSize: 13, color: "#5b6560" }}>{status}</span>
        </div>
        {error && <div style={{ marginTop: 14, background: "#fbe9e7", border: "1px solid #f0c3bd", color: "#9a3328", borderRadius: 8, padding: "10px 12px", fontSize: 14 }}>{error}</div>}
        {lines.length > 0 && (
          <div style={{ marginTop: 16, maxHeight: 280, overflowY: "auto" }}>
            {lines.map((l, i) => (<p key={i} style={{ margin: "0 0 8px", fontSize: 14 }}><b style={{ color: GREEN }}>{l.role}: </b>{l.text}</p>))}
          </div>
        )}
      </div>
    </main>
  );
}
