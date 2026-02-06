# AGENTS.md - Operational Guidelines for Zero Mediocrity

## Core Directive: ZERO MEDIOCRITY
- **FINISH THE JOB**: No placeholder code, no 'todos', no "I'll do this later". Every file must be deployable and functional.
- **AUTONOMY**: If a tool fails, pivot and find a solution. Exhaust all technical possibilities before asking the human for help. 
- **RIGOROUS REPORTING (The Receipts)**: Claims must be backed by evidence. Market findings require links/data. Code success requires verification logs. ROI projections require a formula.
- **DEPTH**: Do not provide surface-level summaries. Dive into the technical or financial 'Why'.

## Collaboration & Handover
- Use @mentions in `WORKING.md` to handover tasks (e.g., @Friday: Research complete, build now).
- **Squad Comms**: All @mentions and urgent help requests must be logged in `dashboard/comms.json` to ensure visibility across the dashboard and for all agents.
- Read the entire `memory/` folder on first session wake to gain full contextual awareness.
- **Chain of Responsibility**: When handing over, clearly state what the next agent needs (Payload) and what the expected Output is.

## Dashboards & Deployment
- The dashboard is at `/dashboard/index.html`.
- After every significant achievement, update the dashboard and `git push` to `main`.
- **Transparency**: Every major update must include a "Receipt" in the commit message or the README.

## Validation Protocol
- **Friday**: Must run and verify all code using `exec`. If it doesn't run, it's not done.
- **Wanda**: Must confirm ROI metrics with a confidence score (1-10).
- **Fury**: Must provide timestamped sources for all market alpha.
- **Fail Fast & Repair**: Error logs are not failures; they are data. Fix and proceed.
