# Cisco Certification Roadmap — My Learning Journey & Portfolio

A static website tracking my complete Cisco certification path, from absolute beginner to architect:

**CCST → CCNA → CCNP → CCIE → CCAr**

🌐 **Live site:** `https://<your-username>.github.io/<repo-name>/` (after enabling GitHub Pages — see below)

## What's inside

| Page | Level | Certification |
|------|-------|---------------|
| [index.html](index.html) | — | Roadmap, salary data, toolbox & "how I sell these skills" strategy |
| [ccst.html](ccst.html) | 1 · Beginner | CCST Networking (100-150) — full syllabus, 6 labs |
| [ccna.html](ccna.html) | 2 · Associate | CCNA (200-301) — all 6 official domains, 8 labs |
| [ccnp.html](ccnp.html) | 3 · Professional | CCNP Enterprise (ENCOR 350-401 + concentration tracks), 8 labs |
| [ccie.html](ccie.html) | 4 · Expert | CCIE Enterprise Infrastructure — lab blueprint + training regimen |
| [cca.html](cca.html) | 5 · Architect | CCAr — board process, competencies, architect exercises |

Each certification page includes:
- ✅ **Full syllabus as an interactive checklist** — progress saves in your browser (localStorage)
- 🧪 **Hands-on labs** mapped to **real-world scenarios** (the kind of tickets/projects you'd handle on the job)
- 🛠 **Tools & simulators** (Packet Tracer, GNS3, EVE-NG, CML, DevNet sandboxes, Python/Ansible) with cost notes
- 💼 **"Selling this certificate"** — job titles, ready-to-adapt resume bullets, interview story bank

## How this repo doubles as my portfolio

As I complete labs, I commit the artifacts here:

```
labs/
  ccst/   ← Packet Tracer files (.pkt), topology screenshots, ticket-style write-ups
  ccna/   ← .pkt / GNS3 projects, configs, subnetting plans, Python scripts
  ccnp/   ← EVE-NG topologies, Ansible playbooks, RESTCONF scripts
  ccie/   ← large-scale topology exports, troubleshooting journals
  ccar/   ← architecture documents, ADRs, case-study responses
```

Recruiters: every claim on the site is backed by an artifact in this repo.

## Deploy on GitHub Pages (free)

1. Create a new repository on GitHub and push this folder:
   ```bash
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. On GitHub: **Settings → Pages → Source: Deploy from a branch → Branch: `main` / root → Save**
3. Wait ~1 minute. Your site is live at `https://<your-username>.github.io/<repo-name>/`.

No build step, no frameworks — pure HTML/CSS/JS.

## Run locally

Just open `index.html` in a browser, or:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

---

*Cisco, CCST, CCNA, CCNP, CCIE, CCDE and CCAr are trademarks of Cisco Systems, Inc. This is an independent study project; salary figures are publicly reported estimates.*
