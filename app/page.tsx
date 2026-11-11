import {
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  PhoneMissed,
  PhoneOutgoing,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { cn } from "@/lib/utils";

// Care-team dashboard. Synthetic data — the clinical engine and scoring live in
// the CARE plugin; this surface is the care team's view of outreach + review.

const KPIS = [
  { label: "Open care gaps", value: "128", sub: "across 3 conditions", icon: ClipboardList },
  { label: "Calls this week", value: "86", sub: "+14 vs last week", icon: PhoneOutgoing },
  { label: "Check-ins completed", value: "61", sub: "71% of reached", icon: CheckCircle2 },
  { label: "Gaps closed", value: "47", sub: "booked or completed", icon: CalendarCheck },
  { label: "Needs call-back", value: "9", sub: "routed to care team", icon: PhoneMissed },
] as const;

const FUNNEL = [
  { label: "Reached", value: 86, pct: 100, fill: "bg-primary" },
  { label: "Completed check-in", value: 61, pct: 71, fill: "bg-primary/75" },
  { label: "Gap closed / booked", value: 47, pct: 55, fill: "bg-primary/55" },
  { label: "Flagged for call-back", value: 9, pct: 10, fill: "bg-amber-400" },
];

type Tone = "crisis" | "critical" | "escalated" | "completed" | "noanswer" | "callback" | "routine";

const TONE: Record<Tone, string> = {
  crisis: "bg-destructive/10 text-destructive border-destructive/20",
  critical: "bg-amber-100 text-amber-800 border-amber-200",
  escalated: "bg-amber-50 text-amber-700 border-amber-200",
  completed: "bg-primary/10 text-primary border-primary/20",
  callback: "bg-amber-100 text-amber-800 border-amber-200",
  noanswer: "bg-muted text-muted-foreground border-border",
  routine: "bg-muted text-muted-foreground border-border",
};

function Status({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <Badge variant="outline" className={cn(TONE[tone])}>
      {children}
    </Badge>
  );
}

const QUEUE: { name: string; cond: string; result: string; flag: string; tone: Tone; when: string }[] = [
  { name: "Rahul Menon", cond: "Depression · PHQ-9", result: "Crisis pathway — item 9 endorsed", flag: "Crisis", tone: "crisis", when: "3h ago" },
  { name: "Asha Pillai", cond: "Asthma · ACT", result: "ACT 5 / 25 — very poorly controlled", flag: "Reliever overuse", tone: "critical", when: "2h ago" },
  { name: "Vikram Shah", cond: "Asthma · ACT", result: "ACT 13 / 25 — poorly controlled", flag: "Escalated", tone: "escalated", when: "5h ago" },
  { name: "Meena Rao", cond: "Depression · PHQ-9", result: "PHQ-9 8 / 27 — mild", flag: "Routine", tone: "routine", when: "1d ago" },
  { name: "Imran Qureshi", cond: "Asthma · ACT", result: "ACT 19 / 25 — well controlled", flag: "No action", tone: "routine", when: "1d ago" },
];

const LOG: { name: string; cond: string; status: string; tone: Tone; dur: string; when: string }[] = [
  { name: "Asha Pillai", cond: "Asthma", status: "Completed", tone: "completed", dur: "4:12", when: "2h ago" },
  { name: "Rahul Menon", cond: "Depression", status: "Transferred", tone: "crisis", dur: "3:48", when: "3h ago" },
  { name: "Sana Khan", cond: "Asthma", status: "No answer", tone: "noanswer", dur: "—", when: "4h ago" },
  { name: "Vikram Shah", cond: "Asthma", status: "Completed", tone: "completed", dur: "5:01", when: "5h ago" },
  { name: "Deepa Nair", cond: "Diabetes", status: "Call-back", tone: "callback", dur: "2:30", when: "6h ago" },
  { name: "Imran Qureshi", cond: "Asthma", status: "Completed", tone: "completed", dur: "3:20", when: "1d ago" },
  { name: "Arjun Das", cond: "Asthma", status: "No answer", tone: "noanswer", dur: "—", when: "1d ago" },
];

const TRANSCRIPT: [string, string][] = [
  ["Agent", "In the past 4 weeks, how much of the time did your asthma keep you from getting as much done at work, school or at home?"],
  ["Asha", "Pretty much all the time, honestly."],
  ["Agent", "During the past 4 weeks, how often have you had shortness of breath?"],
  ["Asha", "More than once a day — especially in the mornings."],
  ["Agent", "Roughly how many rescue inhaler canisters have you gone through in the last year?"],
  ["Asha", "About eight or nine, I think."],
  ["Agent", "Thank you. A clinician will review this and be in touch — nothing has been decided or prescribed."],
];

function Fact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </span>
  );
}

const TH = "py-2 text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground";
const TD = "py-3 align-top";

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground">Sunrise Community Clinic</p>
          <h1 className="mt-0.5 text-2xl font-semibold tracking-tight">Chronic-care follow-up</h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-muted-foreground">Synthetic data</Badge>
          <a
            href="/call"
            className="inline-flex h-8 items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Web call
          </a>
        </div>
      </div>

      {/* Facts line */}
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 rounded-lg border px-3 py-2 text-xs">
        <Fact label="Conditions" value="Asthma · Depression · Diabetes (pilot)" />
        <Fact label="Instruments" value="ACT · PHQ-9" />
        <Fact label="Window" value="This week" />
      </div>

      {/* KPIs */}
      <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {KPIS.map((k) => (
          <KpiCard key={k.label} label={k.label} value={k.value} sub={k.sub} icon={k.icon} />
        ))}
      </div>

      {/* Outreach funnel */}
      <Card className="mt-5">
        <CardHeader>
          <CardTitle className="text-sm">This week&apos;s outreach</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {FUNNEL.map((f) => (
            <div key={f.label} className="flex items-center gap-3">
              <div className="w-44 shrink-0 text-sm">{f.label}</div>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div className={cn("h-full rounded-full", f.fill)} style={{ width: `${f.pct}%` }} />
              </div>
              <div className="w-20 shrink-0 text-right text-sm tabular-nums">
                <span className="font-medium">{f.value}</span>{" "}
                <span className="text-muted-foreground">{f.pct}%</span>
              </div>
            </div>
          ))}
          <p className="pt-1 text-xs text-muted-foreground">Illustrative pilot figures.</p>
        </CardContent>
      </Card>

      {/* Review queue */}
      <Card className="mt-5">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-sm">Review queue</CardTitle>
            <span className="text-xs text-muted-foreground">{QUEUE.length} drafts awaiting clinician sign-off</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className={TH}>Patient</th>
                  <th className={TH}>Instrument</th>
                  <th className={TH}>Result (scored server-side)</th>
                  <th className={TH}>Flag</th>
                  <th className={cn(TH, "text-right")}>When</th>
                </tr>
              </thead>
              <tbody>
                {QUEUE.map((q) => (
                  <tr key={q.name} className="border-t">
                    <td className={cn(TD, "font-medium")}>{q.name}</td>
                    <td className={cn(TD, "text-muted-foreground")}>{q.cond}</td>
                    <td className={TD}>{q.result}</td>
                    <td className={TD}><Status tone={q.tone}>{q.flag}</Status></td>
                    <td className={cn(TD, "text-right text-muted-foreground tabular-nums")}>{q.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="pt-3 text-xs text-muted-foreground">
            Nothing reaches the patient&apos;s chart until a clinician approves. An unacknowledged critical flag blocks approval; a crisis drafts no medication.
          </p>
        </CardContent>
      </Card>

      {/* Recent calls + sample check-in */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Recent calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className={TH}>Patient</th>
                    <th className={TH}>Condition</th>
                    <th className={TH}>Status</th>
                    <th className={cn(TH, "text-right")}>Length</th>
                    <th className={cn(TH, "text-right")}>When</th>
                  </tr>
                </thead>
                <tbody>
                  {LOG.map((r) => (
                    <tr key={r.name + r.when} className="border-t">
                      <td className={cn(TD, "font-medium")}>{r.name}</td>
                      <td className={cn(TD, "text-muted-foreground")}>{r.cond}</td>
                      <td className={TD}><Status tone={r.tone}>{r.status}</Status></td>
                      <td className={cn(TD, "text-right text-muted-foreground tabular-nums")}>{r.dur}</td>
                      <td className={cn(TD, "text-right text-muted-foreground tabular-nums")}>{r.when}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-sm">Sample check-in — Asha Pillai</CardTitle>
              <Status tone="critical">ACT 5 / 25</Status>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="rounded-lg bg-muted/60 p-3 text-[13px] leading-relaxed">
              {TRANSCRIPT.map(([who, text], i) => (
                <p key={i} className={cn(i > 0 && "mt-2")}>
                  <span className={cn("font-medium", who === "Agent" ? "text-primary" : "text-foreground")}>{who}: </span>
                  <span className="text-foreground/90">{text}</span>
                </p>
              ))}
            </div>
            <div className="overflow-hidden rounded-lg border text-sm">
              {[
                ["Score", <>ACT 5 / 25 — very poorly controlled</>],
                ["Safety", <>Reliever overuse (~9 canisters/yr) — <span className="text-destructive">critical</span></>],
                ["Proposed", <>Controller step-up review <span className="text-muted-foreground">(proposal — clinician binds the product)</span></>],
                ["Noted", <>&ldquo;breathless on the stairs&rdquo; · &ldquo;inhaler runs out quickly&rdquo;</>],
              ].map(([k, v], i) => (
                <div key={i} className={cn("flex gap-3 px-3 py-2.5", i > 0 && "border-t")}>
                  <span className="w-20 shrink-0 pt-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{k}</span>
                  <span className="text-foreground">{v}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              The agent only collects answers. The score, safety screen and proposed step are computed server-side; a clinician signs off before anything is written to CARE.
            </p>
          </CardContent>
        </Card>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        CareGaps CCM · built on OHC Network CARE + Sarvam · prototype on synthetic data, not for clinical use.
      </p>
    </div>
  );
}
