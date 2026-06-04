# AI Development Workflow & Instructions

This file applies to all AI coding agents working on this project. Adherence is mandatory.

## 0. Branch Management

The `main` branch is production code for extension distribution. All development must happen on feature branches.

1. **Create a feature branch** from `main`: `feat/feature-name`, `fix/bug-name`, `docs/description`
2. **Work on the feature branch.** All changes, commits go here.
3. **Verify before merging:** syntax check all JS files, verify i18n key parity, manual test in SillyTavern.
4. **Merge to main** only after user approval.

**Never commit directly to main.**

## 1. Understand, Plan, Get Approval

1. **Read existing code** — understand the architecture, patterns, and conventions.
2. **Check docs/** — `ARCHITECTURE.md` and `DATA_MODEL.md` describe the system design.
3. **Formulate a plan** — outline files to create/modify, approach, and any trade-offs.
4. **Wait for approval** — do not proceed until the plan is approved.

## 2. Code Quality

- **Clarity and simplicity.** Write idiomatic ES module JavaScript.
- **No dead code.** No commented-out blocks.
- **No hardcoded secrets.** API keys come from user settings, never from code.
- **Avoid duplication.** Search `src/utils.js` and existing services before creating new helpers.
- **i18n is mandatory.** Every user-visible string goes through `t()`. Add to both `i18n/en-us.json` and `i18n/zh-cn.json`. The i18n system is self-contained — it fetches its own locale JSON, independent of SillyTavern's translation system.

## 3. UI Guidelines

- **No inline-drawers.** Primary UI is a floating overlay modal with tab navigation.
- **All CSS in `panel.js`.** Injected as a `<style>` element, scoped with `cc-` prefix.
- **Use `--cc-*` CSS variables** for all colors. Theme presets override these.
- **Do not rely on SillyTavern native theme variables** such as `SmartTheme*` inside the Memoir panel.
- **Style text controls through scoped panel variables** including input, textarea, select, placeholder, focus, disabled, and option states.
- **Do not close the panel from backdrop clicks** when a workflow may contain draft or edited text.
- **Cards are collapsible** in the settings tab (`.cc-collapsible`).
- **Long textareas get fullscreen** editing via `openFullscreenEditor()`.
- **Mobile responsive** — all grids collapse to 1 column at `max-width: 720px`.
- See [`UI_GUIDELINES.md`](UI_GUIDELINES.md) for design rules.

## 4. Adding Settings

Follow this checklist for every new setting:

1. Default value in `src/state/defaults.js`
2. Form element in `src/ui/panel.js` (correct tab page)
3. `fillForm` + event binding in `src/ui/settings-ui.js`
4. i18n keys in both locale files
5. If it affects injection → update `src/services/injection-service.js`
6. If it should persist per prompt profile → update `upsertCustomPromptProfile` in `src/prompts/prompt-registry.js`

## 5. Pre-Commit Checks

Before committing:

1. **Syntax check** all JS files: `for f in src/**/*.js; do node --check "$f"; done`
2. **i18n parity** — both locale files must have identical key sets
3. **No residual imports** — if you deleted a file, grep for remaining imports
4. **Manual test** in SillyTavern browser

## 6. Commit Messages

Follow Conventional Commits:

- `feat(ui): add theme switching`
- `fix(injection): respect depth setting`
- `docs: update architecture diagram`
- `refactor(services): extract shared URL normalizer`

## 7. Key Architecture Decisions

- **Pure JS, no build step.** SillyTavern loads `index.js` directly. No webpack, no TypeScript.
- **Self-contained i18n.** Fetches own JSON files, no namespace collision with other extensions.
- **Overlay + Modal pattern** (not Popup API, not inline-drawer) for the floating panel.
- **Draggable trigger** using pointer events, not SillyTavern's drag system.
- **Soft stale detection.** Changed summaries continue working, just get flagged.
- **Provider router.** Shared API vs Independent API selection with automatic fallback.
