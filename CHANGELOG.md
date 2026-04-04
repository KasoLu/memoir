# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.0.2] - 2026-04-05

### Changed

- **Workspace copy clarified** - The floor-range fields in the Workspace tab now use more natural wording and include a short explanation that "floor" means chat message order, reducing confusion for first-time users.
- **Mobile launcher default placement** - The floating trigger now uses a mobile-specific initial position strategy based on the top bar and safe-area inset instead of relying only on a fixed bottom offset, reducing first-load drift on narrow screens.

## [1.0.1] - 2026-04-04

### Fixed

- **Summary generation in non-secure browser contexts** - Memoir no longer hard-fails on `Cannot read properties of undefined (reading 'digest')` when `crypto.subtle` is unavailable under some HTTP / non-secure SillyTavern deployments. Message range hashing now falls back to a pure JavaScript SHA-256 implementation so summary generation and changed-range tracking still work.

## [1.0.0] - 2026-04-04

First public release.

### Added

- Manual segment summarization workflow with floor range selection, draft preview, human review, confirm/discard, and approved-range tracking.
- Relative injection strategy controls for prompt layer, layer depth, message role, and optional wrapper tags.
- Merge & Compress flow for consolidating approved summaries without deleting source chat messages.
- Shared API and independent OpenAI-compatible API modes, including model list fetching from `/v1/models`.
- Built-in original story archive prompt assets with editable presets, style patches, fanfic patching, and custom prompt profiles.
- Floating panel UI with fullscreen text editing, summary search, theme switching, mobile-friendly layout, and bilingual i18n.

### Changed

- Simplified the summary token UI for the 1.0.0 release so the Summary tab focuses on current summary length instead of budget-style warning concepts.
- Reframed injection controls as a relative strategy rather than an absolute insertion point, clarifying same-depth ordering behavior inside SillyTavern.
