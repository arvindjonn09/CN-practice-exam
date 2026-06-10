# My Networking Journey — Zero to Job-Ready Engineer

A self-learning and **proof-of-work platform**, not just a roadmap. Every concept goes through the loop:

**Learn → Lab → Break → Troubleshoot → Prove → Review → Interview Answer**

🌐 **Live site:** deployed via Cloudflare Pages from `main`

## The path

```
Level 0  Absolute Networking Basics
Level 1  CCST Networking Foundation
Level 2  CCNA — Job-Ready
Level 3  CCNP Enterprise
Level 4  CCIE-Level Lab Thinking
Level 5  Network Architect Portfolio   (CCAr is retired — architect thinking, proven by work)
```

## Site map

| Page | What it is |
|------|------------|
| [index.html](index.html) | **Dashboard** — current level, this week's topics, labs completed, latest mistake, next milestone |
| [roadmap.html](roadmap.html) | The six levels + toolbox |
| [labs.html](labs.html) | **Lab portfolio** — the first 12 foundation labs, each with topology, commands, break-it task, troubleshooting, proof list and status |
| [mistakes.html](mistakes.html) | **Mistakes I Fixed** — fault → checks → root cause → fix → lesson |
| [progress.html](progress.html) | **Weekly Progress** — honest weekly log, including "what I still don't understand" |
| [commands.html](commands.html) | Commands learned, by topic — only commands actually used in a lab |
| [ccst](ccst.html) / [ccna](ccna.html) / [ccnp](ccnp.html) / [ccie](ccie.html) / [cca](cca.html) | Level pages: full syllabus checklists, level labs, growth checks |

## How I update it (the weekly ritual)

1. Do a lab → commit proof to `labs/<level>/labXX/` (topology.png, .pkt, configs, notes.md)
2. Set the lab's status on the Labs page (saved in browser, feeds the dashboard)
3. Something broke? Add an entry to **Mistakes** (template: `templates/mistake-template.md`)
4. Add the week-card to **Weekly Progress** (template: `templates/weekly-template.md`)
5. Edit **`js/dashboard-data.js`** — current topic, latest lab, latest mistake, next milestone
6. `git add -A && git commit && git push` → Cloudflare redeploys automatically

> The rule: every week adds 1 topic, 1 lab, 1 mistake fixed, 1 command list, 1 interview answer.

## Repo layout

```
labs/
  beginner/   ← Labs 01–12 proof (lab01/ … lab12/)
  ccst/  ccna/  ccnp/  ccie/  ccar/
templates/
  topic-template.md  lab-template.md  mistake-template.md  weekly-template.md
js/dashboard-data.js  ← edit weekly to update the homepage dashboard
```

## Run locally

```bash
python3 -m http.server 8000   # → http://localhost:8000
```

Pure HTML/CSS/JS — no build step. Animations via the Motion library (CDN).

---

*Cisco, CCST, CCNA, CCNP, CCIE and CCDE are trademarks of Cisco Systems, Inc. Independent study project.*
