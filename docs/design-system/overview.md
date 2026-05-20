# Design System Overview

## Overview
The TakeSeat Design System (version 2.0.0) is a modern, scalable design language built on semantic tokens and inspired by modern visual interfaces. It is defined by a sophisticated indigo brand aesthetic that projects trust, clarity, and professionalism for restaurant operators and their guests.

## Responsibilities
This documentation layer is responsible for:
- Enforcing structural visual consistency across the entire application interface.
- Outlining the Core Design Principles (Clarity, Progressive Disclosure, Trust, Performance, Accessibility, and Professionalism).
- Specifying cross-disciplinary patterns to accelerate developer implementation while staying accessible.

## Architecture / Flow
1. **Design Tokens**: Basic values (primitives) feed into semantic meanings (surfaces, borders, text states) which then style components.
2. **Component Implementation**: Components utilize standard tokens directly via vanilla CSS variables or Tailwind CSS class configurations.
3. **Application Layout**: Pages assemble components to form unified structures.

## Rules
- **Aesthetic Direction**: Deep indigo brand accents are balanced with cool slate neutrals and secondary violet details to preserve a professional, uncluttered layout.
- **Mobile First**: All touch target interactions, alignments, and navigation behaviors must scale dynamically to small mobile screens.
- **WCAG AA Compliance**: All text and background combinations must satisfy the WCAG AA minimum contrast ratio (4.5:1 for normal text, 3:1 for large text/icons).

## Edge Cases
- **Dark Mode**: Dark mode is not a simple color inversion. It must reduce contrast for text (e.g., using `neutral-50` rather than pure white) and increase color saturation to maintain visibility.
- **Reduced Motion**: Motion animations must respect OS preferences by disabling transitions when `@media (prefers-reduced-motion: reduce)` is true.

## Technical Notes
- The standard typography font family is **Inter**.
- Standard icon weights use a stroke width of 2px.

## Related Documents
- [Design Tokens](./tokens.md)
- [Design Components](./components.md)
- [Design Patterns](./patterns.md)
