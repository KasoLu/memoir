# UI Design Rules

- Use floating overlay + modal pattern, NOT inline-drawers
- Tab navigation for top-level sections (Workspace / Summaries / Settings)
- Card-based layout within tabs, collapsible where appropriate
- Grid layout (2-col / 3-col), collapse to 1-col on mobile
- All CSS scoped with `cc-` prefix, injected via JS
- Colors via `--cc-*` CSS variables for theme support
- Do not depend on SillyTavern native theme variables such as `SmartTheme*` inside the Memoir panel
- Text inputs, textareas, selects, placeholders, focus states, disabled states, and select options must be styled with scoped `--cc-*` variables
- Buttons always horizontal (`writing-mode: horizontal-tb`)
- Long textareas get fullscreen editing buttons
- Backdrop clicks must not close the modal when a workflow may contain unsaved draft or edited text
- Compact spacing, avoid long vertical forms
- Mobile: safe-area padding, smaller font/padding, stacked grids
