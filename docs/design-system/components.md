# Design System Components

## Overview
This document specifies the standard reusable UI components in TakeSeat, defining their visual variants, code structures, sizing, states, and accessibility details.

## Responsibilities
- Define exact specs for: **Button, Input, Card, Modal/Dialog, Badge, Toast/Notification, Table**.
- Standardize code parameters and design states to guide React component development.
- Enforce built-in keyboard navigation rules and screen reader compatibility.

## Architecture / Flow
Components receive state variables or hooks -> compile styles utilizing token-mapped variables -> output WCAG-compliant accessible HTML.

## Rules
- **Button Variants**:
  - *Primary (Indigo)*: Brand CTA. Uses `indigo-500` background (#6366F1), white text, `shadow-indigo-sm`. Limit to one per screen.
  - *Secondary*: Outline style. `border-default` with `indigo-500` text.
  - *Tertiary/Ghost*: Inline. Transparent background, `indigo-500` text.
  - *Destructive*: Red background for hazardous delete actions.
- **Input Focus State**: Text inputs must style focus outlines with `border-focus` (`indigo-500`) and a soft ring shadow `0 0 0 3px rgba(99, 102, 241, 0.1)`.
- **Card Padding & Borders**: Cards utilize `radius-lg` (12px) corners. Interactive cards transition using `transform: translateY(-2px)` on hover, with a border-color transition to `indigo-300`.
- **Badge Types**: Use subtle styling (light background with colored text) for normal indicators. Solid indigo badge gradients (`indigo-500` to `violet-600`) represent premium feature upgrades.

## Edge Cases
- **Modal Overlay Isolation**: Form and alert modals must be displayed above a faded backdrop overlay, blocking page scroll underneath, trapping focus controls (`tab` key loops).
- **Mobile Table Adaptation**: On screens below `768px`, dense interactive tables must collapse into individual card grids or support swipe horizontal scrolling.

## Technical Notes
- Toasts use a stack controller displaying a maximum of 3 notifications, auto-dismissing after 4s (success) or remaining until dismissed (errors).
- accessibility (ARIA) attributes like `role="dialog"`, `aria-modal="true"`, and `aria-live="polite"` must be wired natively.

## Related Documents
- [Design System Overview](./overview.md)
- [Design Tokens](./tokens.md)
- [Design Patterns](./patterns.md)
