# Design System Patterns

## Overview
Patterns document the standardized combinations of components to solve recurring UX layout problems (Forms, Navigation, Feedback, Visualizations).

## Responsibilities
- Guide layout structures for uniform interactions across TakeSeat.
- Enforce correct layout alignments for sidebar, tabs, grids, and filters.
- Define standard feedback flows for loading (skeletons), empty states, and errors.

## Architecture / Flow
Establish consistent layout templates:
1. **Forms**: Vertical stack, inline validation on blur, primary button on bottom right.
2. **Feedback States**: Action -> show loading skeleton/spinner -> success toast or error block -> option to retry.
3. **Data Filtering**: Filter toolbar -> triggers request -> updates data table/chart layout.

## Rules
- **Form Layout**: Fields are stacked vertically with labels placed on top. Required fields must use an indigo asterisk (`*`).
- **Tab Layout**: Active tabs get an indigo underline border (`border-bottom: 2px solid var(--indigo-500)`) and text color. Hovering inactive tabs displays a subtle indigo background (`#EEF2FF`).
- **Sidebar Layout**: Fixed left panel. Collapsed state shows icons only with hover tooltips. Active links use `border-left: 3px solid var(--indigo-500)` with `bg-brand-subtle`.
- **Skeleton Shimmers**: Use a subtle indigo/gray gradient animation to represent content currently loading in grids or KPI charts.
- **Empty States**: Must include a large centered icon (with indigo tint), a clear title, descriptive helper text, and a primary brand button for recovery.

## Edge Cases
- **Multi-step Forms**: Steps must auto-save progress, validate inputs before advancing, and allow users to go back without losing data.
- **Chart Palette**: Recharts visualization colors must map strictly to `indigo-500` (primary), `violet-500` (secondary), and `indigo-400` (tertiary) to ensure accessibility.

## Technical Notes
- Form validation uses `react-hook-form` coupled with `zod` schemas.
- Dual-axis line charts (Wait times vs Volume) in Reports are responsive to screen size.

## Related Documents
- [Design System Overview](./overview.md)
- [Design Tokens](./tokens.md)
- [Design Components](./components.md)
