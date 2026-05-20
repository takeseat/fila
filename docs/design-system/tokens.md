# Design Tokens

## Overview
Design Tokens are the visual building blocks of the TakeSeat visual architecture. They separate structural specs from concrete UI implementations, divided into Primitives, Semantics, and Components tokens.

## Responsibilities
- Centralizing raw specs (color hashes, spacing scales, border radiuses, text styles).
- Mapping theme-independent semantic rules for light and dark mode operations.
- Outlining component-specific overrides (Buttons, Inputs, Cards, Modals).

## Architecture / Flow
`Primitive Value (raw hex/px)` -> `Semantic Token (light/dark context)` -> `Component Variable` -> `HTML/CSS styling rendering`.

## Rules
- **Color Scales**:
  - **Neutral (Slate)**: `neutral-0` (#FFFFFF) to `neutral-950` (#020617).
  - **Primary Brand**: `indigo-50` (#EEF2FF) to `indigo-950` (#1E1B4B).
  - **Accent**: `violet-50` (#F5F3FF) to `violet-950` (#2E1065).
  - **Feedback**: `green` (Success), `red` (Error), `amber` (Warning), `sky` (Info).
- **8pt Spacing Scale**: All spacing uses multiples of 4px/8px: `spacing-1` (4px), `spacing-2` (8px), `spacing-3` (12px), `spacing-4` (16px), up to `spacing-64` (256px).
- **Corner Radiuses**:
  - Buttons: `radius-md` (8px).
  - Cards: `radius-lg` (12px).
  - Modals: `radius-xl` (16px).
  - Generic: `radius-sm` (4px), `radius-base` (6px), `radius-2xl` (24px).
- **Typographic Scale**: Font sizes scale from `text-xs` (12px) to `text-7xl` (72px) with strict line-height associations.

## Edge Cases
- **Strict Component Corner Radius Warning**: Never use arbitrary corner radii. A button must always use `radius-md` (8px). A card must always use `radius-lg` (12px).
- **Focus Rings**: Interactive elements in focused states must use `border-focus` (`indigo-500` / #6366F1) combined with an outer glow outline-offset.

## Technical Notes
- Shadows are configured with indigo hues for primary states (e.g., `shadow-indigo-sm`).
- Animations use easing transitions of `200ms` (fast) to `300ms` (base default).

## Related Documents
- [Design System Overview](./overview.md)
- [Design Components](./components.md)
- [Design Patterns](./patterns.md)
