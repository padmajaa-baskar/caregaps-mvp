// CareGaps CCM — care-team dashboard (demo / synthetic data).
// Static mock data so evaluators understand the product without a live call.

const KPIS = [
  { n: "128", l: "Open care gaps", s: "diabetes · asthma · depression" },
  { n: "86", l: "Calls placed this week", s: "+14 vs last week" },
  { n: "61", l: "Check-ins completed", s: "71% of reached" },
  { n: "47", l: "Gaps closed", s: "booked or completed" },
  { n: "9", l: "Flagged for call-back", s: "routed to care team" },
];

const FUNNEL = [
  { l: "Reached", v: 86, pct: 100, c: "#2e7d6b" },
  { l: "Completed check-in", v: 61, pct: 71, c: "#4f9a88" },
  { l: "Gap closed / booked", v: 47, pct: 55, c: "#6fb3a3" },
  { l: "Flagged for call-back", v: 9, pct: 10, c: "#d99a2b" },
];

const WEEK = [
  { d: "Mon", v: 12 }, { d: "Tue", v: 18 }, { d: "Wed", v: 15 },
  { d: "Thu", v: 14 }, { d: "Fri", v: 11 }, { d: "Sat", v: 9 }, { d: "Sun", v: 7 },
];

type Pill = "crisis" | "critical" | "escalated" | "routine" | "done" | "booked" | "noanswer" | "callback";

const QUEUE: { name: string; cond: string; result: string; flag: string; flagType: Pill; when: string }[] = [
  { name: "Rahul Menon", cond: "Depression · PHQ-9", result: "Crisis pathway — item 9 endorsed", flag: "Crisis — routed now", flagType: "crisis", when: "3h ago" },
  { name: "Asha Pillai", cond: "Asthma · ACT", result: "ACT 5 / 25 — very poorly controlled", flag: "Reliever overuse · critical", flagType: "critical", when: "2h ago" },
  { name: "Vikram Shah", cond: "Asthma · ACT", result: "ACT 13 / 25 — poorly controlled", flag: "Escalated", flagType: "escalated", when: "5h ago" },
  { name: "Meena Rao", cond: "Depression · PHQ-9", result: "PHQ-9 8 / 27 — mild", flag: "Routine", flagType: "routine", when: "1d ago" },
  { name: "Imran Qureshi", cond: "Asthma · ACT", result: "ACT 19 / 25 — well controlled", flag: "No action", flagType: "routine", when: "1d ago" },
];

const LOG: { name: string; cond: string; status: string; statusType: Pill; dur: string; when: string }[] = [
  { name: "Asha Pillai", cond: "Asthma", status: "Completed", statusType: "done", dur: "4:12", when: "2h ago" },
  { name: "Rahul Menon", cond: "Depression", status: "Crisis → transferred", statusType: "crisis", dur: "3:48", when: "3h ago" },
  { name: "Sana Khan", cond: "Asthma", status: "No answer", statusType: "noanswer", dur: "—", when: "4h ago" },
  { name: "Vikram Shah", cond: "Asthma", status: "Completed", statusType: "done", dur: "5:01", when: "5h ago" },
  { name: "Deepa Nair", cond: "Diabetes (pilot)", status: "Call-back requested", statusType: "callback", dur: "2:30", when: "6h ago" },
  { name: "Imran Qureshi", cond: "Asthma", status: "Completed", statusType: "done", dur: "3:20", when: "1d ago" },
  { name: "Arjun Das", cond: "Asthma", status: "No answer", statusType: "noanswer", dur: "—", when: "1d ago" },
];

const PILL_STYLE: Record<Pill, { bg: string; fg: string }> = {
  crisis: { bg: "#f6e0dd", fg: "#9a3328" },
  critical: { bg: "#fbe9d8", fg: "#9a5a12" },
  escalated: { bg: "#fbf0d6", fg: "#8a6a1e" },
  routine: { bg: "#eef1ef", fg: "#5b6560" },
  done: { bg: "#dcefe8", fg: "#1f6b58" },
  booked: { bg: "#dcefe8", fg: "#1f6b58" },
  noanswer: { bg: "#eef1ef", fg: "#6b756f" },
  callback: { bg: "#fbf0d6", fg: "#8a6a1e" },
};

const TRANSCRIPT = [
  ["Agent", "In the past 4 weeks, how much of the time did your asthma keep you from getting as much done at work, school or at home?"],
  ["Asha", "Pretty much all the time, honestly."],
  ["Agent", "During the past 4 weeks, how often have you had shortness of breath?"],
  ["Asha", "More than once a day — especially in the mornings."],
  ["Agent", "Roughly how many rescue inhaler canisters have you gone through in the last year?"],
  ["Asha", "About eight or nine, I think."],
  ["Agent", "Thank you. A clinician will review this and be in touch — nothing has been decided or prescribed."],
];

function Pill({ type, children }: { type: Pill; children: React.ReactNode }) {
  const s = PILL_STYLE[type];
  return <span className="pill" style={{ background: s.bg, color: s.fg }}>{children}</span>;
}

export default function Dashboard() {
  const max = Math.max(...WEEK.map((w) => w.v));
  return (
    <div className="wrap">
      <style>{CSS}</style>

      <header className="topbar">
        <div>
          <div className="kick">CareGaps CCM</div>
          <h1>Care-team dashboard</h1>
          <div className="sub">Sunrise Community Clinic · chronic-care follow-up</div>
        </div>
        <div className="badges">
          <span className="demo">● Demo · synthetic data</span>
          <a className="btn" href="/call">Live web call (beta)</a>
        </div>
      </header>

      <section className="kpis">
        {KPIS.map((k) => (
          <div className="kpi" key={k.l}>
            <div className="n">{k.n}</div>
            <div className="l">{k.l}</div>
            <div className="s">{k.s}</div>
          </div>
        ))}
      </section>

      <section className="grid2">
        <div className="panel">
          <h2>This week&apos;s outreach</h2>
          {FUNNEL.map((f) => (
            <div className="frow" key={f.l}>
              <div className="flab">{f.l}</div>
              <div className="ftrack"><div className="ffill" style={{ width: f.pct + "%", background: f.c }} /></div>
              <div className="fval">{f.v} <span>· {f.pct}%</span></div>
            </div>
          ))}
          <p className="note">Illustrative pilot figures.</p>
        </div>

        <div className="panel">
          <h2>Calls per day</h2>
          <div className="bars">
            {WEEK.map((w) => (
              <div className="bcol" key={w.d}>
                <div className="bbar" style={{ height: Math.round((w.v / max) * 120) + "px" }} />
                <div className="bval">{w.v}</div>
                <div className="bday">{w.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel">
        <h2>Review queue <span className="count">{QUEUE.length} drafts awaiting clinician sign-off</span></h2>
        <table>
          <thead><tr><th>Patient</th><th>Instrument</th><th>Result (scored by the system)</th><th>Flag</th><th>When</th></tr></thead>
          <tbody>
            {QUEUE.map((q) => (
              <tr key={q.name}>
                <td className="strong">{q.name}</td>
                <td>{q.cond}</td>
                <td>{q.result}</td>
                <td><Pill type={q.flagType}>{q.flag}</Pill></td>
                <td className="muted">{q.when}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="note">Nothing reaches the patient&apos;s chart until a clinician approves. An unacknowledged critical flag blocks approval; a crisis drafts zero medication.</p>
      </section>

      <section className="grid2">
        <div className="panel">
          <h2>Recent calls</h2>
          <table>
            <thead><tr><th>Patient</th><th>Condition</th><th>Status</th><th>Length</th><th>When</th></tr></thead>
            <tbody>
              {LOG.map((r) => (
                <tr key={r.name + r.when}>
                  <td className="strong">{r.name}</td>
                  <td>{r.cond}</td>
                  <td><Pill type={r.statusType}>{r.status}</Pill></td>
                  <td className="muted">{r.dur}</td>
                  <td className="muted">{r.when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <h2>Sample check-in — Asha Pillai</h2>
          <div className="transcript">
            {TRANSCRIPT.map((t, i) => (
              <p key={i}><b style={{ color: t[0] === "Agent" ? "#2e7d6b" : "#223029" }}>{t[0]}:</b> {t[1]}</p>
            ))}
          </div>
          <div className="outputs">
            <div className="orow"><span>Score</span><b>ACT 5 / 25 — very poorly controlled</b></div>
            <div className="orow"><span>Safety screen</span><b>Reliever overuse (~9 canisters/yr) — <span style={{ color: "#9a3328" }}>critical</span></b></div>
            <div className="orow"><span>Proposed step</span><b>Controller step-up review <span className="muted">(proposal — clinician binds the product)</span></b></div>
            <div className="orow"><span>Patient said</span><b>&ldquo;breathless on the stairs&rdquo; · &ldquo;inhaler runs out quickly&rdquo;</b></div>
          </div>
          <p className="note">The agent only collects answers. The score, safety screen and proposed step are computed server-side; a clinician signs off before anything is written to CARE.</p>
        </div>
      </section>

      <footer className="foot">
        CareGaps CCM · Team 2care AI · built on OHC Network CARE + Sarvam · prototype on synthetic data, not for clinical use.
      </footer>
    </div>
  );
}

const CSS = `
*{box-sizing:border-box}
.wrap{max-width:1120px;margin:0 auto;padding:28px 20px 60px;color:#223029}
.topbar{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap;margin-bottom:22px}
.kick{font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#2e7d6b;font-weight:800}
.topbar h1{font-size:30px;margin:4px 0 2px;letter-spacing:-.5px}
.sub{color:#6b756f;font-size:14px}
.badges{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.demo{background:#eef5f2;color:#2e7d6b;border:1px solid #cfe0d9;border-radius:999px;padding:6px 12px;font-size:12px;font-weight:700}
.btn{background:#2e7d6b;color:#fff;border-radius:8px;padding:8px 14px;font-size:13px;font-weight:600;text-decoration:none}
.kpis{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:18px}
.kpi{flex:1;min-width:170px;background:#fff;border:1px solid #e3ded5;border-radius:14px;padding:16px 18px}
.kpi .n{font-size:34px;font-weight:800;color:#2e7d6b;letter-spacing:-1px;line-height:1}
.kpi .l{font-size:14px;font-weight:600;margin-top:6px}
.kpi .s{font-size:12px;color:#6b756f;margin-top:3px}
.grid2{display:flex;gap:18px;flex-wrap:wrap;margin-bottom:18px}
.grid2>.panel{flex:1;min-width:320px}
.panel{background:#fff;border:1px solid #e3ded5;border-radius:16px;padding:20px 22px;margin-bottom:18px}
.panel h2{font-size:17px;margin-bottom:14px;display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.count,.panel h2 .count{font-size:12px;font-weight:600;color:#6b756f}
.frow{display:flex;align-items:center;gap:12px;margin-bottom:12px}
.flab{width:150px;font-size:13px;flex-shrink:0}
.ftrack{flex:1;height:22px;background:#eef1ef;border-radius:6px;overflow:hidden}
.ffill{height:100%;border-radius:6px}
.fval{width:78px;text-align:right;font-size:13px;font-weight:700;color:#255f52}
.fval span{color:#6b756f;font-weight:500}
.note{font-size:12px;color:#8a9088;margin-top:12px;font-style:italic}
.bars{display:flex;align-items:flex-end;gap:14px;height:170px;padding-top:10px}
.bcol{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:4px}
.bbar{width:70%;background:#2e7d6b;border-radius:5px 5px 0 0}
.bval{font-size:12px;font-weight:700;color:#255f52}
.bday{font-size:12px;color:#6b756f}
table{width:100%;border-collapse:collapse;font-size:14px}
th{text-align:left;font-size:11px;letter-spacing:.5px;text-transform:uppercase;color:#6b756f;padding:8px 10px;border-bottom:1px solid #e3ded5}
td{padding:11px 10px;border-bottom:1px solid #f0ece4}
tr:last-child td{border-bottom:0}
.strong{font-weight:700}
.muted{color:#6b756f}
.pill{display:inline-block;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:700;white-space:nowrap}
.transcript{background:#f8f6f1;border-radius:10px;padding:14px 16px;font-size:13.5px;line-height:1.5}
.transcript p{margin:0 0 8px}
.transcript p:last-child{margin:0}
.outputs{margin-top:14px;border:1px solid #e3ded5;border-radius:10px;overflow:hidden}
.orow{display:flex;gap:12px;padding:10px 14px;font-size:13.5px;border-bottom:1px solid #f0ece4}
.orow:last-child{border-bottom:0}
.orow span{width:110px;flex-shrink:0;color:#6b756f;font-size:12px;text-transform:uppercase;letter-spacing:.5px;padding-top:2px}
.foot{text-align:center;color:#8a9088;font-size:12px;margin-top:26px}
@media(max-width:560px){.flab{width:110px}.orow span{width:90px}}
`;
