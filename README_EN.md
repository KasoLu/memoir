# Memoir

[中文](README.md)

A SillyTavern extension for **controllable chat memory management** — manual segment summarization, human review, and context injection. Keeps the AI aware of past story events instead of gradually forgetting as the chat grows.

> "古法 Memoir" — your memory, your control. No black boxes, no sneaky chat deletion.

---

## How It Works

```
Select a floor range
       ↓
LLM generates a story archive summary
       ↓
You preview, edit, then confirm
       ↓
Confirmed summaries auto-inject into conversation context
       ↓
AI "remembers" past plot on its next reply
```

---

## Features

- **Manual segment summarization** — You choose the range, you confirm. No automatic chat deletion.
- **Summary presets + style/fanfic templates** — Built-in story archive preset with stackable style templates and fanfic AU compatibility. All template text is fully viewable and editable, and you can swap in your own preferred summary template.
- **Merge & Compress** — Too many summaries piling up? One-click fusion to deduplicate and consolidate.
- **Relative injection strategy** — Choose a prompt layer (top / character / chat injection), layer depth, role, and custom wrapper tags. Chat-layer injection follows SillyTavern ordering within that layer and is not guaranteed to sit absolutely next to the latest message.
- **Shared / Independent API** — Use SillyTavern's configured API or set up a dedicated summarization API.
- **Fetch Models** — One-click model list retrieval for independent API.
- **Fullscreen editing** — Long prompts and summary text support fullscreen editing; summary fullscreen includes search.
- **Theme switching** — 7 built-in panel themes, launcher color follows theme.
- **Mobile responsive** — Panel, fullscreen, and search bar all adapt to small screens.
- **Bilingual i18n** — Chinese / English, auto-detected.

---

## Installation

**Option 1** — Install from SillyTavern UI (recommended):

1. Open **Extensions** → **Install Extension**
2. Enter: `https://github.com/Asobi-123/memoir`
3. Refresh the page

**Option 2** — Manual install:

```bash
cd SillyTavern/data/default-user/extensions/
git clone https://github.com/Asobi-123/memoir.git
```

Refresh SillyTavern to start using.

---

## Usage

1. Tap the **floating ball** (bottom right) to open the panel, or click "Open Panel" in extension settings.
2. **Workspace**: Set floor range → Generate Summary → Preview → Confirm
3. **Summaries**: View status, adjust injection strategy, edit/merge confirmed summaries
4. **Settings**: Choose theme, configure API, select/edit summary presets and templates

### Prompt Customization

- You can paste in your own preferred summary prompt template.
- The `System Prompt` has no required variables.
- In the `Summary User Template`, keep `{{start_floor}}`, `{{end_floor}}`, and `{{chat_history}}`. Everything else can be changed.

---

## License

[AGPL-3.0](LICENSE)
