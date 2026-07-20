# CONTEXT — design-swift-consultants

Feature-scoped glossary. Readers merge this with the repo-root `CONTEXT.md` (none yet); on
conflict, this per-feature entry wins. Canonical for roles + domain terms used in `spec.md`.

## Glossary

- **Pipeline operator** — the engineer who runs an SDD stage command (e.g. `/sdd:design <slug>`) in
  the forked pipeline on an iOS repo. The human whose one command should yield iOS-aware output.
  NOT the consultant sub-agent (a system actor, never a user role).
- **Fork maintainer** — the person who owns the SDD fork's wiring: merges each upstream release,
  keeps the deterministic plugin-validation gate green, keeps the consultant agents in sync. Often
  the same human as the operator, but a distinct responsibility. NOT the AvdLee bundle author.
- **Expert consultant** (consultant sub-agent) — a disposable sub-agent, spawned by a stage from the
  main session, that loads a heavy third-party domain-expert skill bundle, reasons over the feature,
  and returns a ≤1-page brief. Its only channel back is the brief text (clean, isolated context).
  NOT one of SDD's restricted agents (explorer / critic / reviewer / implementer) — those never
  receive the bundle.
- **Expert skill bundle** — a large third-party domain-knowledge skill (SwiftUI expertise, Swift
  concurrency expertise) invoked by a consultant. Authored and maintained outside the fork; kept
  auto-updating and separate. NOT forked, NOT hand-edited here.
- **Trigger signal** — a product-level signal read from `spec.md` (does the feature describe UI /
  views / navigation / async / background work) that decides whether — and which — consultant
  fires. Detected by keyword match over a curated signal set PLUS model inference over the spec
  prose: `views / navigation / screens / SwiftUI / UI` ⇒ UI-class; `async / await / background /
  concurrency / actors / tasks` ⇒ async-class. Mapping: UI-class ⇒ SwiftUI consultant; async-class
  ⇒ Swift-concurrency consultant; both classes ⇒ both (there are exactly two consultant classes, so
  the ≤2-per-run cap holds structurally). NOT the `target_surfaces` frontmatter, which is still
  empty at spawn time.
- **Structural altitude** — the architecture level (SAD §4/§5) at which a decision is expensive to
  reverse: irreversible or cross-module, per the blast-radius gate. NOT code-level rules (a single
  screen's local-state choice, avoiding force-unwrap) — those belong to implement / review.
- **Blast-radius gate** — the criterion that classifies a decision as structural-altitude: a
  decision is structural iff it is irreversible OR cross-module OR has legitimate architectural
  alternatives (SDD `design`'s ADR-spawn criterion). It is the operable test the Altitude filter
  applies to a consultant brief. NOT a per-file / code-level lint check.
- **Altitude filter** — the rule that only structural-altitude decisions may enter the SAD from a
  consultant brief; code-level items are denied entry and routed to implement / review. The
  blast-radius gate is its byte-level criterion. NOT a security control — a content-altitude gate.
- **Observable trace** — a detectable manifestation in the SAD that a consultant fired and its brief
  was folded in: iOS-specific structural decisions / ADRs present for a UI/async feature; absent for
  a pure-logic feature. The primary acceptance signal.
- **Fallback marker** — a visible note (in BOTH the stage handoff AND the SAD) that a consultant was
  expected by the trigger signal but did not fire OR fired and returned an empty / degenerate brief
  (no structural decision). Makes silent rot visible while the stage still never blocks. NOT an
  error that halts the pipeline.
- **Project rules** — the consuming iOS repo's own conventions passed into the consultant prompt.
  Sources: the repo `CLAUDE.md` plus any dedicated SwiftUI-rules file present. Project rules WIN over
  generic bundle advice on conflict, enforced at the fold step (main session) — not trusted to the
  consultant. When the repo has no rules file, the consultant runs rule-free and its generic advice
  stands — this is NOT a fallback-marker case.
