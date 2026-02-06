# Technical Lesson: Nextric Proactive Logic Implementation

## Context
Transitioning from reactive (prompt-based) to proactive (loop-based) agent status is critical for autonomous operation. 

## Technical Detail
1. **Loop Pattern**: The `autonomous_fury.js` script implements a `while(true)` loop with a 15-minute cooldown. This uses the `runAgent` function from `autonomous-agent` to inject a persistent directive.
2. **State Management**: Using `feed.json` as a real-time state log ensures transparency.
3. **Integration**: The `x402` payment flow is embedded in the client initialization, allowing the agent to handle 402 "Payment Required" errors by signing and settling automatically via the facilitator.

## BTC15 Market logic
The market logic relies on `Maker`, `Trader`, and `Resolver` separation. For Nextric, we are condensing these into a single oversight script that triggers scans and trades.

## Lesson Learned
Purely prompt-driven agents are "ghosts in the machine" until invoked. Proactive loops turn them into active "workers".
