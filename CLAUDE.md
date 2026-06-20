# Claude Development Instructions

This document is for Claude Code and other AI assistants working on this project.

## Project Overview

Memoir (古法 Memoir) — a third-party extension for SillyTavern that provides controllable chat memory management: manual summarization, human review, and context injection for long conversations. Pure ES module JavaScript, no build step.

## Before Making Changes

1. **Read the code first.** Understand the existing architecture before proposing modifications.
2. **Check for existing utilities.** Search `src/utils.js`, `src/prompts/prompt-registry.js`, and `src/ui/panel.js` before creating new helpers.
3. **Plan before coding.** For non-trivial changes, outline the approach and get approval.

## Code Conventions

- **Language:** Pure ES modules (`.js`), no TypeScript, no bundler, no build step.
- **Imports:** Use SillyTavern's module system — `/script.js` and `/scripts/extensions.js` for ST APIs, relative paths for internal modules.
- **Style:** 4-space indent, single quotes avoided (use double quotes), semicolons required.
- **No dead code.** Don't leave commented-out blocks.
- **No hardcoded user-facing strings.** All user-visible text must go through `t()` from `src/i18n.js`. Add keys to both `i18n/en-us.json` and `i18n/zh-cn.json`.

## i18n Rules

1. Add English text to `i18n/en-us.json`
2. Add Chinese translation to `i18n/zh-cn.json`
3. Use `t('key.name')` in code — supports `{placeholder}` replacement
4. i18n is self-contained (loads own JSON via fetch), NOT dependent on SillyTavern's `context.translate`
5. Keys use dot notation: `workspace.*`, `settings.*`, `inject.*`, `toast.*`, `status.*`, etc.
6. Both locale files must always have identical key sets

## UI Rules

- **No inline-drawer / accordion patterns.** The primary UI is a floating modal panel with tab navigation.
- **Panel structure:** Native `<dialog>` opened with `showModal()` → Modal → Header + Tabs + Body
- **CSS is injected via JS** in `src/ui/panel.js`, not in `style.css`
- **Use `cc-` prefix** for all CSS classes to avoid conflicts with SillyTavern
- **Theme support:** All colors use `--cc-*` CSS variables, overridden by theme presets
- **No SmartTheme dependency in panel CSS:** Do not rely on SillyTavern native theme variables inside the Memoir panel
- **Readable form controls:** Input, textarea, select, placeholder, focus, disabled, and option states must use scoped panel variables
- **Safe closing:** Backdrop clicks and dialog cancel/Escape events must not close the panel when draft or edited text may be present
- **Collapsible cards** for settings sections (`.cc-collapsible` / `.cc-collapsed`)
- **Fullscreen editor** for long-text textareas, with search for summary text
- **Mobile responsive:** tablet/constrained-viewport rules plus `@media (max-width: 720px)`, `dvh` height, and safe-area padding

## Adding Settings

1. Add default value to `src/state/defaults.js`
2. Add form element in `src/ui/panel.js` (in the appropriate tab page function)
3. Add `fillForm` population + `bindSettingsEvents` handler in `src/ui/settings-ui.js`
4. Add i18n keys for label text
5. If the setting affects injection, update `src/services/injection-service.js`

## File Organization

```
src/core/       — bootstrap, lifecycle, context access
src/state/      — settings defaults, settings store, chat-scoped data
src/services/   — provider routing, summarization, injection, hashing
src/prompts/    — preset registry, built-in prompt assets
src/ui/         — panel builder, tab panels, settings form binding
```

## Testing

No automated test framework. Verify by:
1. `node --check <file>` for syntax validation
2. Manual testing in SillyTavern browser
3. Check i18n parity: both locale files must have the same key count

## Commits

Follow Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`.
