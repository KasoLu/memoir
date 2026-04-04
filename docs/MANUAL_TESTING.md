# Manual Testing Checklist

This checklist is for release validation before publishing a new Memoir version.

## Preconditions

- SillyTavern loads without extension initialization errors.
- At least one test chat has enough messages to summarize.
- Shared API can complete a normal reply, or the independent API endpoint is reachable.
- Test at least one desktop viewport and one narrow/mobile viewport.

## 1. Shared API Summary Generation

Steps:

1. Open a chat with enough history.
2. In `Workspace`, choose a floor range.
3. Generate a summary in shared API mode.
4. Review the draft and confirm it.

Expected:

- A draft is generated for the selected range.
- Confirming the draft appends text into the cumulative summary.
- A new approved range appears in the Summary tab.
- The Workspace copy makes it clear that "floor" means chat message order.

## 2. Independent API Mode

Steps:

1. Switch summary generation to `Independent API`.
2. Fill `API URL`, `Model`, and `API Key` if required.
3. Click `Fetch Models` or type a model manually.
4. Generate a summary.

Expected:

- `Fetch Models` returns a usable list when the endpoint supports `/v1/models`.
- Summary generation succeeds through the independent provider.
- If `API URL` or `Model` is missing, Memoir falls back to shared API instead of hard failing.

## 3. Confirm, Edit, And Reset Summary Text

Steps:

1. Confirm at least one generated draft.
2. Open the Summary tab.
3. Edit the cumulative summary text.
4. Use the reset/restore path if available in your workflow.

Expected:

- Summary text can be edited without breaking the approved ranges list.
- The visible summary length updates after edits.
- Restoring baseline content returns to the last approved state.

## 4. Injection Strategy

Steps:

1. Open the collapsible `Injection Strategy` card.
2. Switch between `Top Layer`, `Character Layer`, and `Chat Injection Layer`.
3. Change `Layer Depth`, `Message Role`, and wrapper tag.

Expected:

- The card stays collapsed by default and can be expanded when needed.
- Changes save correctly and persist after refresh.
- Wrapper tags appear around injected summary text when configured.
- Chat-layer injection behaves as a relative position, not an absolute final slot.

## 5. Merge & Compress

Steps:

1. Confirm multiple summary ranges.
2. Run `Merge & Compress`.
3. Review the merged result.

Expected:

- The merged result combines prior approved content.
- Approved ranges and cumulative summary remain coherent after merge.
- No source chat messages are deleted by the extension.

## 6. Prompt Presets And Custom Templates

Steps:

1. Switch between built-in prompt presets and style patches.
2. Edit the system prompt and user template.
3. Save a custom prompt profile.
4. Reload the page and reopen the extension.

Expected:

- Preset switching restores the associated prompt configuration.
- Custom prompt profiles persist across reload.
- The user template still works when `{{start_floor}}`, `{{end_floor}}`, and `{{chat_history}}` are preserved.

## 7. Language And Copy Review

Steps:

1. Open the extension with Chinese UI.
2. Open the extension with English UI.
3. Check Summary and Settings tabs.

Expected:

- Both locales render without missing i18n keys.
- Injection wording matches the agreed "relative injection strategy" terminology.
- Removed budget-style wording does not appear in token or length UI.

## 8. Responsive UI

Steps:

1. Open the panel on desktop width.
2. Repeat on a narrow/mobile width.
3. Open fullscreen editors for long text fields.

Expected:

- The panel remains usable on both widths.
- Fullscreen editors open correctly.
- Long summary text remains editable and searchable in fullscreen.
- On mobile, the floating trigger starts in a stable visible position near the top bar instead of drifting too low or off-screen.

## Release Gate

Before tagging a release:

- `manifest.json` version matches the release version.
- `README.md` and `README_EN.md` point to the correct repository URL.
- `CHANGELOG.md` contains the release entry and date.
