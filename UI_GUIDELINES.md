# UI Design Rules

- Use floating overlay + modal pattern, NOT inline-drawers
- Tab navigation for top-level sections (Workspace / Summaries / Settings)
- Card-based layout within tabs, collapsible where appropriate
- Grid layout (2-col / 3-col), collapse to 1-col on mobile
- All CSS scoped with `cc-` prefix, injected via JS
- Colors via `--cc-*` CSS variables for theme support
- Buttons always horizontal (`writing-mode: horizontal-tb`)
- Long textareas get fullscreen editing buttons
- Compact spacing, avoid long vertical forms
- Mobile: safe-area padding, smaller font/padding, stacked grids
