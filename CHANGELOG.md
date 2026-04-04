# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

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
