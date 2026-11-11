# CareGaps CCM

**An AI follow-up coordinator that closes chronic-care gaps between visits.**

> ### 🔗 Live demo — care-team dashboard: **https://caregaps-mvp.vercel.app**
> Login: `evaluator` / `caregaps2026`
> *(This is the current demo URL. An earlier deployment link may show a superseded version — this one always shows the latest.)*

CareGaps CCM finds patients overdue for a doctor-set follow-up, calls them in plain language,
works through a validated check-in (ACT for asthma, PHQ-9 for depression), scores the answers
**server-side**, runs a safety screen, and produces a **clinician-reviewed, coded record** inside
[CARE](https://github.com/ohcnetwork/care). The agent only collects — **the doctor decides
everything clinical, and nothing reaches the chart before a clinician approves it.**

> Health-a-thon 2026 · Diabetes track · Team 2care AI
> Dr Mridul Rampal · Padmajaa Baskar · Suryansh Sharma · Bala Guhanesh
> Prototype on synthetic data. Not for clinical use.

---

## This repository

The care-team **dashboard + demo app** (Next.js). The full clinical engine lives as a CARE
plugin in a separate repo (the deterministic scoring core, the questionnaires and the approval
transaction).

| Route | What it is |
| --- | --- |
| `/` | **Care-team dashboard** — KPIs, the week's outreach funnel, calls-per-day, the clinician **review queue**, a recent-calls log, and a fully worked **sample check-in** (transcript → computed score → safety flag → proposed step). Synthetic data, so the product reads end-to-end without a live call. |
| `/call` | **Live browser web call** via the Sarvam Voice Agents SDK (the key is proxied server-side). Needs a Sarvam **Voice Agents runtime** plan — see *What's next*. |

**Login (demo):** `evaluator` / `caregaps2026` (Basic Auth, set via env).

---

## What we've done

- **Clinical engine as a CARE plugin — zero changes to the CARE core.** The deterministic scoring
  core was ported from TypeScript to Python and **replays all 363 reference cases exactly**;
  **95 automated tests pass** (mutation-tested).
- **Instruments as coded CARE questionnaires** — ACT and PHQ-9 with corrected LOINC codes, so each
  answer becomes an `Observation` with service-account provenance.
- **Approval transaction** — on sign-off it writes an encounter, coded observations, a medication
  *proposal* (clinician binds the product) and a note, or refuses and writes nothing. An
  unacknowledged **critical** safety flag blocks approval; a **crisis** (PHQ-9 item 9) drafts
  **zero** medication and routes to a human.
- **Voice agent authored and published on Sarvam** (committed version V2), with the ACT/PHQ-9
  script and emergency rules under version control.
- **This MVP** — the care-team dashboard (above) and a browser web-call client with a server-side
  key proxy (so the API key never reaches the bundle).
- **Phone-free demo path** in the plugin: a synthetic Sarvam webhook → the real pipeline → a
  review draft → a gated approval, so the whole loop is verifiable with no telephony.

## What we're going to do

- **Live voice** — enable the browser/phone call on a Sarvam **Voice Agents runtime** plan. (Our
  current key is a Sarvam *Model API* key; the real-time Voice Agents runtime requires its own
  credential, so the live call is plan-gated today.)
- **Diabetes (HbA1c) module** — the engine is **condition-agnostic** (a `ConditionModule` is data +
  two hooks), so a diabetes check-in is a drop-in addition; asthma and depression are the first two.
- **Outbound phone + CSV campaigns** and a retry sweep for no-answers.
- **Pilot with a clinic**, and run the agent **eval suite** (verbatim delivery, crisis handling,
  spoken numbers, refusal, voicemail) that is written but not yet executed.

---

## Run it locally

```bash
npm install
npm run dev          # http://localhost:3000  (login: evaluator / caregaps2026)
```

Copy `.env.example` → `.env.local` and fill the Sarvam ids (only needed for `/call`). The
dashboard needs no configuration.

## Deploy (Vercel)

```bash
vercel --prod
```

Set the env vars from `.env.example` in the Vercel project. The `SARVAM_API_KEY` is **server-only**
(never `NEXT_PUBLIC_`). If you want evaluators to reach it, turn **off** Vercel's own Deployment
Protection (Settings → Deployment Protection) so the `DEMO_USER` / `DEMO_PASS` login is what gates
the site.

## Limitations

Synthetic data only · English-only (ACT/PHQ-9 need validated translations for other languages) ·
verbatim instrument delivery through a managed LLM is a **probabilistic** guarantee, not a hard one
· the live call needs a Voice Agents plan · **not for clinical use** without validation and a
security/privacy review.
