# Architecture

## Overview

Memoir (古法 Memoir) is a third-party SillyTavern extension that provides controllable chat memory management with human review before any content is injected into the conversation context.

## V1 Flow

1. User selects a floor range in the Workspace tab.
2. Extension builds a prompt bundle (summary preset + style/fanfic templates).
3. LLM provider generates a summary.
4. User previews the result and confirms or discards.
5. Confirmed summary is appended to cumulative text stored in `chat_metadata`.
6. Cumulative text is injected into the conversation context via `setExtensionPrompt`.
7. On chat changes, confirmed ranges are hash-checked and softly marked if source messages changed.

## Layer Diagram

```
┌─────────────────────────────────────────┐
│  UI Layer (src/ui/)                     │
│  panel.js — floating modal + themes     │
│  settings-ui.js — form binding          │
│  draft-panel.js — workspace logic       │
│  segments-panel.js — summary tab logic  │
│  status-panel.js — status display       │
│  launcher.js — extension menu entry     │
├─────────────────────────────────────────┤
│  Prompt Layer (src/prompts/)            │
│  prompt-registry.js — preset/template   │
│  assets/ — built-in presets & templates │
├─────────────────────────────────────────┤
│  Service Layer (src/services/)          │
│  provider-router.js — API routing       │
│  summary-draft-service.js — generation  │
│  approval-service.js — confirm/discard  │
│  injection-service.js — context inject  │
│  fusion-service.js — merge & compress   │
│  summary-token-service.js — token stats │
│  segment-hash-service.js — SHA-256      │
│  stale-detection-service.js             │
│  range-state-service.js                 │
│  range-suggestion-service.js            │
├─────────────────────────────────────────┤
│  State Layer (src/state/)               │
│  defaults.js — default settings         │
│  settings-store.js — read/write         │
│  chat-segment-store.js — per-chat data  │
├─────────────────────────────────────────┤
│  Core Layer (src/core/)                 │
│  app.js — lifecycle + event handlers    │
│  context.js — safe chat/metadata access │
├─────────────────────────────────────────┤
│  Entry                                  │
│  index.js → bootstrap.js → app.js      │
└─────────────────────────────────────────┘
```

## Key Design Decisions

### Self-contained i18n
Fetches its own locale JSON files instead of using SillyTavern's `context.translate`. Avoids namespace collision with other extensions.

### Overlay + Modal (not Popup / Drawer)
The floating panel uses a full-viewport overlay with a centered modal, inspired by the chat cleaner v26 pattern. No dependency on SillyTavern's Popup API or inline-drawer system.

### CSS injected via JS
All panel styles are in `panel.js` as a template literal, injected as a `<style>` element. This keeps `style.css` minimal and avoids SillyTavern's global CSS from interfering.

### Soft stale detection
When source messages are edited after a summary is confirmed, the summary is flagged as "changed" but continues to work. No hard disabling.

### Provider router with fallback
Independent API mode falls back to shared API if config is incomplete. Summary generation and fusion each have their own output-length setting. `0` means "follow SillyTavern's global response length". Shared API omits `responseLength` when set to `0`, while independent API only sends `max_tokens` when the configured value is greater than `0`.

### Relative injection strategy
Memoir uses SillyTavern's extension prompt layer and depth controls as a relative strategy, not an absolute insertion point. Within the same layer and depth, final ordering still follows SillyTavern's prompt assembly rules.

### Summary length display
Confirmed summaries can be measured with SillyTavern's token counter. Memoir now counts only the current cumulative summary text for UI display and editing feedback.

### Prompt presets save patch state
Custom prompt presets store their associated style template and fanfic template selections, so switching presets restores the full configuration.
