# HEARTBEAT.md

## 🍃 ECONOMY MODE ACTIVE
- **Token Conservation**: If no new high-priority tasks are found in `WORKING.md`, exit immediately with HEARTBEAT_OK.
- **Deep Research Limit**: Do NOT trigger `deep-research` unless a specific task explicitly requests it. Standard `web_search` only for routine checks.
- **Concise Reporting**: Keep all log entries under 20 words.

## On Wake
- [ ] Check `memory/WORKING.md` for ongoing squad tasks.
- [ ] Read recent logs in `memory/YYYY-MM-DD.md` to avoid redundant work.
- [ ] **Cross-Check**: Look for @mentions or requests from other agents.

## Specialized Directives
- **Friday (Builder)**: Check for code bugs or UI deployment errors. Always update `dashboard/index.html` after a major change.
- **Fury (Scout)**: Validate market data freshness. Pivot niche search if current one is saturated.
- **Wanda (Quant)**: Verify odds/prices on multiple platforms to avoid "fat finger" errors.
- **Vision (Growth)**: Monitor initial channel engagement metrics (if live).

## Reporting
- Hand over tasks via @mentions in `WORKING.md`.
- If no action needed, reply HEARTBEAT_OK.
