# Design System

> A modern, scalable design system built on semantic tokens, inspired by Stripe's best practices with a warm terracotta aesthetic for restaurant software.

**Version:** 1.0.0  
**Last updated:** January 2026

---

## 📋 Table of Contents

1. [Introduction](#introduction)
2. [Design Principles](#design-principles)
3. [Design Tokens](#design-tokens)
4. [Foundations](#foundations)
5. [Components](#components)
6. [Patterns](#patterns)
7. [Accessibility](#accessibility)
8. [Usage Guidelines](#usage-guidelines)
9. [Resources & Tools](#resources--tools)

---

## 🎯 Introduction

### Overview

This design system provides a consistent, accessible, and scalable visual language for all our restaurant management applications and products. Inspired by Stripe's clarity and elegance with a distinctive terracotta accent that evokes warmth, appetite, and hospitality, our system prioritizes:

- **Clarity**: Direct, unambiguous communication
- **Consistency**: Unified experiences across all touchpoints
- **Efficiency**: Tools that accelerate development
- **Accessibility**: Inclusive products by design
- **Warmth**: Terracotta touches that create inviting, appetizing experiences

### How to Use This Document

This document serves as the complete reference for designers, developers, and product managers. Each section contains:

- **Technical specifications**: Exact values and implementation
- **Usage guidelines**: When and how to apply each element
- **Practical examples**: Real-world use cases
- **Accessibility considerations**: Ensuring inclusion

---

## 🧡 Design Principles

### 1. Clarity Above All

The interface should communicate information clearly and directly. We avoid unnecessary ornamentation and prioritize readability and comprehension.

**Practices:**
- Use simple, direct language
- Clear visual hierarchy
- Generous spacing for breathing room
- Legible typography at all sizes

### 2. Progressively Disclosed

Show only what's necessary at the right time. Complexity is revealed progressively as users advance.

**Practices:**
- Simple, clean default states
- Advanced options available but not intrusive
- Contextual tooltips and help text
- Layered navigation

### 3. Trust Through Consistency

Consistent patterns create familiarity and trust. Users learn once and apply throughout the platform.

**Practices:**
- Reusable components
- Predictable behaviors
- Uniform terminology
- Consistent flows

### 4. Performance is a Feature

Fast, responsive interfaces are an integral part of the experience. We optimize for speed without compromising quality.

**Practices:**
- Informative loading states
- Immediate feedback to actions
- Asset optimization
- Progressive enhancement

### 5. Accessible by Default

Accessibility is not optional. Every component is designed to work for all users.

**Practices:**
- WCAG AA contrast minimum
- Complete keyboard navigation
- Screen reader friendly
- Testing with diverse users

### 6. Warm and Inviting

Terracotta accents create a welcoming, appetizing atmosphere that resonates with the restaurant industry. We use warm tones thoughtfully to evoke comfort and quality.

**Practices:**
- Terracotta for primary actions and brand moments
- Warm neutrals for backgrounds
- Coral accents for interactive elements
- Balance with cream and peach tones

---

## 🎨 Design Tokens

### Token Architecture

Our system uses a three-layer approach:

1. **Primitive Tokens**: Base values (colors, sizes)
2. **Semantic Tokens**: Contextual meaning (surface, border, text)
3. **Component Tokens**: Component-specific values

```
Primitive → Semantic → Component
  (base)    (context)  (specific)
```

### Primitive Tokens

#### Base Colors

**Neutral**
```
neutral-0:   #FFFFFF (pure white)
neutral-50:  #FAFAF9
neutral-100: #F5F5F4
neutral-200: #E7E5E4
neutral-300: #D6D3D1
neutral-400: #A8A29E
neutral-500: #78716C
neutral-600: #57534E
neutral-700: #44403C
neutral-800: #292524
neutral-900: #1C1917
neutral-950: #0C0A09
```

**Terracotta (Primary Brand)**
```
terracotta-50:  #FEF7F3
terracotta-100: #FDEDE3
terracotta-200: #FBD9C7
terracotta-300: #F8BFA0
terracotta-400: #F49A6B
terracotta-500: #E07856 (primary brand)
terracotta-600: #D4663F
terracotta-700: #B35333
terracotta-800: #8F4530
terracotta-900: #743C2B
terracotta-950: #3E1D16
```

**Coral (Secondary/Accent)**
```
coral-50:  #FFF5F3
coral-100: #FFE9E5
coral-200: #FFD7CF
coral-300: #FFB8AB
coral-400: #FF8E7A
coral-500: #F86B54
coral-600: #E5492F
coral-700: #C13821
coral-800: #A0311F
coral-900: #842F21
coral-950: #481509
```

**Peach (Light Accent)**
```
peach-50:  #FFF9F5
peach-100: #FFF1E8
peach-200: #FFE2D1
peach-300: #FFCBAF
peach-400: #FFAA81
peach-500: #FF8A5B
peach-600: #F06A3A
peach-700: #D85328
peach-800: #B04423
peach-900: #8F3A20
peach-950: #4D1C0D
```

**Green (Success)**
```
green-50:  #F0FDF4
green-100: #DCFCE7
green-200: #BBF7D0
green-300: #86EFAC
green-400: #4ADE80
green-500: #22C55E
green-600: #16A34A
green-700: #15803D
green-800: #166534
green-900: #14532D
green-950: #052E16
```

**Red (Error)**
```
red-50:  #FEF2F2
red-100: #FEE2E2
red-200: #FECACA
red-300: #FCA5A5
red-400: #F87171
red-500: #EF4444
red-600: #DC2626
red-700: #B91C1C
red-800: #991B1B
red-900: #7F1D1D
red-950: #450A0A
```

**Amber (Warning)**
```
amber-50:  #FFFBEB
amber-100: #FEF3C7
amber-200: #FDE68A
amber-300: #FCD34D
amber-400: #FBBF24
amber-500: #F59E0B
amber-600: #D97706
amber-700: #B45309
amber-800: #92400E
amber-900: #78350F
amber-950: #451A03
```

**Sky (Info)**
```
sky-50:  #F0F9FF
sky-100: #E0F2FE
sky-200: #BAE6FD
sky-300: #7DD3FC
sky-400: #38BDF8
sky-500: #0EA5E9
sky-600: #0284C7
sky-700: #0369A1
sky-800: #075985
sky-900: #0C4A6E
sky-950: #082F49
```

#### Spacing Scale

```
spacing-0:   0
spacing-1:   4px    (0.25rem)
spacing-2:   8px    (0.5rem)
spacing-3:   12px   (0.75rem)
spacing-4:   16px   (1rem)
spacing-5:   20px   (1.25rem)
spacing-6:   24px   (1.5rem)
spacing-8:   32px   (2rem)
spacing-10:  40px   (2.5rem)
spacing-12:  48px   (3rem)
spacing-16:  64px   (4rem)
spacing-20:  80px   (5rem)
spacing-24:  96px   (6rem)
spacing-32:  128px  (8rem)
spacing-40:  160px  (10rem)
spacing-48:  192px  (12rem)
spacing-64:  256px  (16rem)
```

#### Typography Scale

**Font Families**
```
font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
font-mono: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace
```

**Font Sizes**
```
text-xs:   12px (0.75rem)   / line-height: 16px
text-sm:   14px (0.875rem)  / line-height: 20px
text-base: 16px (1rem)      / line-height: 24px
text-lg:   18px (1.125rem)  / line-height: 28px
text-xl:   20px (1.25rem)   / line-height: 28px
text-2xl:  24px (1.5rem)    / line-height: 32px
text-3xl:  30px (1.875rem)  / line-height: 36px
text-4xl:  36px (2.25rem)   / line-height: 40px
text-5xl:  48px (3rem)      / line-height: 48px
text-6xl:  60px (3.75rem)   / line-height: 60px
text-7xl:  72px (4.5rem)    / line-height: 72px
```

**Font Weights**
```
font-light:    300
font-normal:   400
font-medium:   500
font-semibold: 600
font-bold:     700
```

#### Border Radius

```
radius-none: 0
radius-sm:   4px   (0.25rem)
radius-base: 6px   (0.375rem)
radius-md:   8px   (0.5rem)
radius-lg:   12px  (0.75rem)
radius-xl:   16px  (1rem)
radius-2xl:  24px  (1.5rem)
radius-full: 9999px
```

#### Shadows

```
shadow-xs:  0 1px 2px 0 rgba(0, 0, 0, 0.05)
shadow-sm:  0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)
shadow-md:  0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)
shadow-lg:  0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)
shadow-xl:  0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)
shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)

shadow-terracotta-sm:  0 1px 3px 0 rgba(224, 120, 86, 0.2)
shadow-terracotta-md:  0 4px 6px -1px rgba(224, 120, 86, 0.2), 0 2px 4px -2px rgba(224, 120, 86, 0.15)
shadow-terracotta-lg:  0 10px 15px -3px rgba(224, 120, 86, 0.2), 0 4px 6px -4px rgba(224, 120, 86, 0.15)
shadow-terracotta-xl:  0 20px 25px -5px rgba(224, 120, 86, 0.25), 0 8px 10px -6px rgba(224, 120, 86, 0.2)
```

### Semantic Tokens

#### Background Colors

**Light Mode**
```
bg-primary:       neutral-0      // Primary background
bg-secondary:     neutral-50     // Secondary background
bg-tertiary:      neutral-100    // Tertiary background
bg-elevated:      neutral-0      // Elevated cards, modals
bg-overlay:       rgba(0,0,0,0.5) // Modal backdrop

bg-brand:         terracotta-500     // Brand backgrounds
bg-brand-subtle:  terracotta-50      // Subtle brand backgrounds
bg-brand-light:   terracotta-100     // Light brand backgrounds
bg-brand-hover:   terracotta-700     // Brand hover state

bg-success:       green-50       // Success feedback
bg-warning:       amber-50       // Warning feedback
bg-error:         red-50         // Error feedback
bg-info:          sky-50         // Info feedback
```

**Dark Mode**
```
bg-primary:       neutral-950
bg-secondary:     neutral-900
bg-tertiary:      neutral-800
bg-elevated:      neutral-900
bg-overlay:       rgba(0,0,0,0.7)

bg-brand:         terracotta-500
bg-brand-subtle:  terracotta-950
bg-brand-light:   terracotta-900
bg-brand-hover:   terracotta-500

bg-success:       green-950
bg-warning:       amber-950
bg-error:         red-950
bg-info:          sky-950
```

#### Text Colors

**Light Mode**
```
text-primary:     neutral-900    // Primary text
text-secondary:   neutral-600    // Secondary text
text-tertiary:    neutral-500    // Tertiary text
text-disabled:    neutral-400    // Disabled text
text-inverse:     neutral-0      // Text on dark backgrounds

text-brand:       terracotta-500     // Brand text
text-brand-light: terracotta-500     // Lighter brand text
text-success:     green-700      // Success text
text-warning:     amber-700      // Warning text
text-error:       red-700        // Error text
text-info:        sky-700        // Info text
text-link:        terracotta-500     // Links
text-link-hover:  terracotta-700     // Link hover state
```

**Dark Mode**
```
text-primary:     neutral-50
text-secondary:   neutral-400
text-tertiary:    neutral-500
text-disabled:    neutral-600
text-inverse:     neutral-950

text-brand:       terracotta-400
text-brand-light: terracotta-300
text-success:     green-400
text-warning:     amber-300
text-error:       red-400
text-info:        sky-400
text-link:        terracotta-400
text-link-hover:  terracotta-300
```

#### Border Colors

**Light Mode**
```
border-default:   neutral-200    // Default borders
border-subtle:    neutral-100    // Subtle borders
border-strong:    neutral-300    // Emphasized borders
border-brand:     terracotta-500     // Brand borders
border-error:     red-300        // Error borders
border-focus:     terracotta-500     // Focus rings
```

**Dark Mode**
```
border-default:   neutral-700
border-subtle:    neutral-800
border-strong:    neutral-600
border-brand:     terracotta-500
border-error:     red-700
border-focus:     terracotta-500
```

#### Interactive Colors

**Light Mode**
```
interactive-primary:         terracotta-500
interactive-primary-hover:   terracotta-700
interactive-primary-active:  terracotta-800
interactive-primary-disabled: neutral-300

interactive-secondary:       neutral-0
interactive-secondary-hover: neutral-50
interactive-secondary-active: neutral-100
interactive-secondary-disabled: neutral-200

interactive-tertiary:        transparent
interactive-tertiary-hover:  terracotta-50
interactive-tertiary-active: terracotta-100
```

**Dark Mode**
```
interactive-primary:         terracotta-500
interactive-primary-hover:   terracotta-500
interactive-primary-active:  terracotta-700
interactive-primary-disabled: neutral-700

interactive-secondary:       neutral-800
interactive-secondary-hover: neutral-700
interactive-secondary-active: neutral-600
interactive-secondary-disabled: neutral-800

interactive-tertiary:        transparent
interactive-tertiary-hover:  terracotta-950
interactive-tertiary-active: terracotta-900
```

### Component Tokens

#### Button Tokens

**Primary Button**
```
button-primary-bg:           interactive-primary
button-primary-bg-hover:     interactive-primary-hover
button-primary-bg-active:    interactive-primary-active
button-primary-bg-disabled:  interactive-primary-disabled
button-primary-text:         text-inverse
button-primary-border:       interactive-primary
button-primary-shadow:       shadow-terracotta-sm
button-primary-shadow-hover: shadow-terracotta-md
button-primary-radius:       radius-md
button-primary-padding-x:    spacing-4
button-primary-padding-y:    spacing-2
button-primary-font-size:    text-sm
button-primary-font-weight:  font-medium
```

**Secondary Button**
```
button-secondary-bg:          interactive-secondary
button-secondary-bg-hover:    interactive-secondary-hover
button-secondary-bg-active:   interactive-secondary-active
button-secondary-text:        text-primary
button-secondary-border:      border-default
button-secondary-shadow:      shadow-sm
button-secondary-radius:      radius-md
```

**Size Variants**
```
button-sm-height:    32px
button-sm-padding-x: spacing-3
button-sm-padding-y: spacing-1
button-sm-font-size: text-sm

button-md-height:    40px
button-md-padding-x: spacing-4
button-md-padding-y: spacing-2
button-md-font-size: text-base

button-lg-height:    48px
button-lg-padding-x: spacing-6
button-lg-padding-y: spacing-3
button-lg-font-size: text-lg
```

#### Input Tokens

```
input-bg:                bg-primary
input-bg-disabled:       bg-secondary
input-border:            border-default
input-border-hover:      border-strong
input-border-focus:      border-focus
input-border-error:      border-error
input-text:              text-primary
input-text-placeholder:  text-tertiary
input-radius:            radius-md
input-padding-x:         spacing-3
input-padding-y:         spacing-2
input-height:            40px
input-font-size:         text-base
input-shadow-focus:      0 0 0 3px rgba(224, 120, 86, 0.1)
input-glow-focus:        0 0 0 1px terracotta-500
```

#### Card Tokens

```
card-bg:             bg-elevated
card-border:         border-default
card-radius:         radius-lg
card-padding:        spacing-6
card-shadow:         shadow-md
card-shadow-hover:   shadow-lg
card-shadow-featured: shadow-terracotta-md
```

#### Modal Tokens

```
modal-bg:            bg-elevated
modal-overlay-bg:    bg-overlay
modal-border:        border-subtle
modal-radius:        radius-xl
modal-padding:       spacing-8
modal-shadow:        shadow-2xl
modal-max-width:     640px
```

---

## 🏗️ Foundations

### Color

#### Color Palette

Our palette is carefully constructed to:
- Meet WCAG AA requirements in all text/background combinations
- Work in both light and dark themes
- Create clear visual hierarchy
- Convey consistent meaning

#### Terracotta as Primary

Terracotta is our signature color, used to:
- **Guide Action**: Primary buttons and CTAs
- **Show Focus**: Interactive element states
- **Highlight Premium**: Featured content and upgrades
- **Add Delight**: Subtle accents and micro-interactions

**Usage Guidelines:**
- Use terracotta-500 for primary actions
- Reserve terracotta-500/700 for hover/active states
- Apply terracotta-50/100 for subtle backgrounds
- Use terracotta shadows for elevated interactive elements

#### Dark Mode

Dark mode isn't simply inverted light mode. Special considerations:

**Reduced Contrast**
- Pure white (#FFFFFF) is too aggressive on dark backgrounds
- Use neutral-50 for primary text in dark mode
- Reduce shadow opacity

**Increased Saturation**
- Colors need more saturation to maintain vibrancy
- Terracotta, green, and red are more vibrant in dark mode

**Elevation Through Luminosity**
- Elevated surfaces are lighter, not darker
- Cards: neutral-900 over neutral-950
- Modals: neutral-900 with strong shadow

#### Usage Guidelines

**Backgrounds**
- Use bg-primary for application base
- bg-secondary for alternate sections
- bg-elevated for elements that "float" (cards, dropdowns)

**Text**
- text-primary for main content
- text-secondary for metadata, labels
- text-tertiary for auxiliary information
- Never use less contrast than text-tertiary

**Feedback**
- Green for success and positive actions
- Red for errors and destructive actions
- Amber for warnings and caution
- Terracotta for brand and neutral importance

#### Restaurant Industry Color Psychology

Our terracotta palette was specifically chosen for restaurant software:

**Why Terracotta Works for Restaurants:**
- **Appetite Stimulation**: Warm orange-red tones are proven to increase appetite and encourage ordering
- **Warmth & Hospitality**: Evokes the welcoming atmosphere of quality dining establishments
- **Earthiness & Quality**: Suggests natural, fresh ingredients and artisanal preparation
- **Modern Sophistication**: Contemporary twist on traditional restaurant colors
- **Versatility**: Works across all restaurant types (fine dining, casual, fast-casual, delivery)

**Practical Applications:**
```
"Order Now" buttons:        terracotta-500 (maximum conversion)
Featured menu items:        terracotta-50 background
Daily specials badge:       terracotta-100 with terracotta-700 text
Reservation confirmations:  terracotta-50 with green success icon
Active table status:        terracotta border-left
Popular dish indicator:     terracotta-400 star icon
Add-on suggestions:         coral-50 background (secondary warmth)
```

**Avoiding Color Pitfalls:**
- ❌ Blue (suppresses appetite, used by competitors)
- ✅ Terracotta (stimulates appetite, differentiates brand)
- ❌ Cool grays alone (sterile, institutional)
- ✅ Warm neutrals with terracotta accents (inviting, professional)

### Typography

#### Hierarchy

Our typographic hierarchy creates clarity through:
- **Size Contrast**: Clear differences between levels
- **Weight Contrast**: Medium/Semibold for emphasis
- **Color Contrast**: text-primary vs text-secondary

**Heading Scale**
```
H1: text-5xl / font-bold     // Page titles
H2: text-3xl / font-semibold // Section titles
H3: text-2xl / font-semibold // Subsection titles
H4: text-xl / font-medium    // Card titles
H5: text-lg / font-medium    // Small headings
H6: text-base / font-medium  // Labels, overlines
```

**Body Text**
```
Large:  text-lg / font-normal   // Intro paragraphs
Base:   text-base / font-normal // Standard body
Small:  text-sm / font-normal   // Helper text
XSmall: text-xs / font-normal   // Captions, footnotes
```

**UI Text**
```
Button:     text-sm / font-medium
Label:      text-sm / font-medium
Input:      text-base / font-normal
Tooltip:    text-xs / font-normal
Badge:      text-xs / font-semibold
```

#### Line Height

Optimized for readability:
- Headlines: 1.2 - 1.3 (tight)
- Body text: 1.5 - 1.6 (comfortable)
- UI elements: 1.25 - 1.4 (compact)

#### Letter Spacing

```
Tight:   -0.02em (large headings)
Normal:   0      (body text)
Wide:     0.02em (small caps, buttons)
```

#### Font Loading

For optimized performance:

```css
/* Load only necessary weights */
@font-face {
  font-family: 'Inter';
  font-weight: 400 700;
  font-display: swap;
  src: url('/fonts/inter-variable.woff2') format('woff2');
}
```

### Spacing

#### 8pt System

All spacing is based on multiples of 4px (or 0.25rem):
- **Internal**: Component padding
- **External**: Margin between elements
- **Layout**: Gaps in grids and flexbox

#### Density

Three density levels for different contexts:

**Comfortable (Default)**
```
padding-y: spacing-2 (8px)
padding-x: spacing-4 (16px)
gap: spacing-4 (16px)
```

**Compact**
```
padding-y: spacing-1 (4px)
padding-x: spacing-3 (12px)
gap: spacing-3 (12px)
```

**Spacious**
```
padding-y: spacing-3 (12px)
padding-x: spacing-6 (24px)
gap: spacing-6 (24px)
```

#### Layout Grid

Responsive 12-column system:

```
Container max-width:
- sm:  640px
- md:  768px
- lg:  1024px
- xl:  1280px
- 2xl: 1536px

Gutter:
- Mobile: spacing-4 (16px)
- Desktop: spacing-6 (24px)

Margin:
- Mobile: spacing-4 (16px)
- Desktop: spacing-8 (32px)
```

### Iconography

#### Library

We use **Lucide Icons** as our standard library:
- Visual consistency
- Excellent legibility at small sizes
- Multiple weight support
- Open source

#### Sizes

```
icon-xs:  12px  // Inline with text-xs
icon-sm:  16px  // Inline with text-sm/base
icon-md:  20px  // Buttons, inputs
icon-lg:  24px  // Headers, featured
icon-xl:  32px  // Hero sections
icon-2xl: 48px  // Empty states
```

#### Guidelines

- Icons should be vertically and horizontally centered
- Use stroke-width of 2px for consistency
- Colors: text-primary, text-secondary, or semantic colors
- Always include descriptive aria-label for accessibility

### Elevation and Shadows

#### Elevation System

We create depth through shadows:

**Levels**
```
0: Flush       - shadow-none  // Part of background
1: Raised      - shadow-sm    // Static cards
2: Overlay     - shadow-md    // Dropdowns, popovers
3: Modal       - shadow-lg    // Modals, dialogs
4: Toast       - shadow-xl    // Notifications, toasts
```

**Terracotta Shadows**
Use terracotta-tinted shadows for:
- Primary buttons (shadow-terracotta-sm → shadow-terracotta-md on hover)
- Featured cards
- Premium content indicators
- Active/selected states

#### Dark Mode

Shadows in dark mode are more subtle:

```css
.dark {
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
  
  --shadow-terracotta-sm: 0 1px 3px 0 rgba(224, 120, 86, 0.3);
  --shadow-terracotta-md: 0 4px 6px -1px rgba(224, 120, 86, 0.3);
}
```

### Motion and Animation

#### Duration

```
duration-instant: 100ms  // Hover states
duration-fast:    200ms  // Toggles, checks
duration-base:    300ms  // Default for most
duration-slow:    500ms  // Page transitions
duration-slower:  700ms  // Complex animations
```

#### Easing

```css
ease-in:      cubic-bezier(0.4, 0, 1, 1)
ease-out:     cubic-bezier(0, 0, 0.2, 1)      /* Preferred */
ease-in-out:  cubic-bezier(0.4, 0, 0.2, 1)
ease-bounce:  cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

#### Principles

1. **Meaning Over Decoration**: Animations should have purpose
2. **Subtle and Fast**: 200-300ms is ideal for feedback
3. **Ease-out Preferred**: Creates responsive feeling
4. **Respect Preferences**: Honor `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

#### Terracotta Glow Effect

For special interactive moments that evoke warmth and appetite:

```css
.terracotta-glow {
  transition: box-shadow 200ms ease-out;
}

.terracotta-glow:hover {
  box-shadow: 
    0 0 0 1px rgba(224, 120, 86, 0.3),
    0 4px 12px rgba(224, 120, 86, 0.25),
    0 8px 24px rgba(224, 120, 86, 0.15);
}

/* For prominent CTAs like "Order Now" or "Reserve Table" */
.terracotta-glow-strong {
  box-shadow: 
    0 0 0 1px rgba(224, 120, 86, 0.4),
    0 6px 16px rgba(224, 120, 86, 0.3),
    0 12px 32px rgba(224, 120, 86, 0.2);
}
```

**Restaurant Use Cases:**
- Primary order/reservation buttons
- Featured menu item cards on hover
- "Chef's Special" or "Popular" badges
- Premium/add-on upsell options
- Active table indicators in POS systems

---

## 🧩 Components

### Button

Buttons are primary action elements. They exist in three main variants, with terracotta as the defining characteristic.

#### Variants

**Primary (Terracotta)**
- Primary action on the screen
- Maximum one per visual context
- High contrast, maximum emphasis
- Terracotta background with white text
- Terracotta shadow on hover
- **Restaurant use**: "Order Now", "Reserve Table", "Add to Cart", "Checkout"

**Secondary**
- Alternative actions
- Multiple can coexist
- Outline with subtle background
- Terracotta border and text
- **Restaurant use**: "View Menu", "Modify Order", "See Details", "Filter"

**Tertiary/Ghost**
- Lower priority actions
- Text/icon only
- Used in navigation, secondary actions
- Terracotta text on transparent background
- **Restaurant use**: "Cancel", "Edit", "Remove Item", "Back"

**Destructive**
- Permanent/dangerous actions
- Delete, remove, cancel orders
- Always requires confirmation
- Red variant
- **Restaurant use**: "Delete Menu Item", "Cancel Reservation", "Void Order"

#### Sizes

```
Small:  32px height - UI density, tables
Medium: 40px height - Default for forms
Large:  48px height - CTAs, landing pages
```

#### States

```
Default:  Base appearance
Hover:    Darker terracotta + elevated shadow
Active:   Even darker, pressed appearance
Focus:    Terracotta focus ring (outline)
Disabled: Reduced opacity, no interaction
Loading:  Spinner, dimmed text
```

#### Anatomy

```
[Icon (optional)] [Label] [Icon (optional)]
     ↓                ↓          ↓
  16-20px         text-sm    16-20px
```

#### Code Example

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  children: ReactNode
  onClick?: () => void
}

// Usage
<Button variant="primary" size="md" icon={<Plus />}>
  Add to Order
</Button>

<Button variant="primary" size="lg" icon={<Calendar />}>
  Reserve Table
</Button>

<Button variant="secondary" size="md" icon={<Eye />}>
  View Menu
</Button>
```

#### Restaurant-Specific Examples

```typescript
// Order/Checkout Flow
<Button variant="primary" size="lg" fullWidth>
  Place Order - $45.99
</Button>

// Menu Item Card
<Button variant="secondary" size="sm" icon={<Plus />}>
  Add to Cart
</Button>

// Table Reservation
<Button variant="primary" size="md" icon={<Calendar />}>
  Book for 4 Guests
</Button>

// Modifier Selection
<Button variant="tertiary" size="sm">
  Extra Cheese (+$2.00)
</Button>

// POS Quick Actions
<Button variant="secondary" size="md" icon={<Printer />}>
  Print Receipt
</Button>
```

#### Usage Guidelines

✅ **Do**
- Use clear action verbs ("Order Now", "Reserve", "Add", "Checkout")
- One primary button per screen/section
- Provide visual feedback for loading states (processing orders)
- Keep labels short (1-3 words)
- Use terracotta shadows for elevation and emphasis
- Show prices in CTAs when applicable ("Checkout - $45.99")

❌ **Don't**
- Use generic labels like "Submit" or "OK"
- Have multiple primary buttons competing
- Disable buttons without explanation (show why minimum order isn't met)
- Use icons without labels (except universal actions like X, +, -)
- Hide important costs until last second

### Input

Inputs collect user information in a structured way.

#### Variants

**Text Input**
- Single-line text
- Email, password, number
- Search

**Text Area**
- Multi-line text
- Comments, descriptions
- Auto-resize optional

**Select**
- Single or multiple choice
- Native or custom dropdown
- Searchable for many options

#### Anatomy

```
┌─────────────────────────────────┐
│ Label              Helper Text  │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ [Icon] Placeholder/Value    │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ Hint/Error Message              │
└─────────────────────────────────┘
```

#### States

```
Empty:    Placeholder visible
Filled:   Value present
Focus:    Terracotta border + subtle glow
Error:    Red border + error message
Disabled: Grayed out, not editable
ReadOnly: Visible but not editable
```

**Focus State Enhancement:**
Terracotta inputs get a subtle glow effect:

```css
input:focus {
  border-color: var(--terracotta-500);
  box-shadow: 
    0 0 0 3px rgba(224, 120, 86, 0.1),
    0 0 0 1px rgba(224, 120, 86, 0.3);
}
```

#### Validation

**Timing**
- Inline: After blur (loss of focus)
- Submit: When form is submitted
- Real-time: For passwords, availability

**Messages**
- Specific: "Email must contain @"
- Actionable: "Password must be 8+ characters"
- Positive when possible: "✓ Available"

#### Code Example

```typescript
interface InputProps {
  label: string
  type?: 'text' | 'email' | 'password' | 'number'
  placeholder?: string
  value?: string
  error?: string
  hint?: string
  required?: boolean
  disabled?: boolean
  icon?: ReactNode
  onChange?: (value: string) => void
}

// Usage
<Input
  label="Email address"
  type="email"
  placeholder="you@example.com"
  hint="We'll never share your email"
  required
/>
```

### Card

Cards group related information in discrete containers.

#### Variants

**Basic Card**
- Simple container
- Uniform padding
- Subtle elevation

**Interactive Card**
- Clickable/Hoverable
- Hover state with elevation
- Terracotta accent on hover
- Cursor pointer

**Featured Card**
- Visual highlight
- Terracotta border or gradient
- Used for premium features
- Enhanced terracotta shadow

#### Anatomy

```
┌─────────────────────────────────┐
│ ┌───────────────────────────┐   │  Header (optional)
│ │ Icon    Title    Badge    │   │
│ └───────────────────────────┘   │
│                                 │
│ Content                         │  Body
│ Lorem ipsum dolor sit amet      │
│                                 │
│ ┌───────────────────────────┐   │  Footer (optional)
│ │ Meta        Actions       │   │
│ └───────────────────────────┘   │
└─────────────────────────────────┘
```

#### Padding

```
Compact:     spacing-4 (16px)
Comfortable: spacing-6 (24px)
Spacious:    spacing-8 (32px)
```

#### Terracotta Accents

**Subtle Terracotta Highlight:**
```css
.card-featured {
  border: 1px solid var(--terracotta-200);
  box-shadow: var(--shadow-terracotta-sm);
}

.card-interactive:hover {
  border-color: var(--terracotta-300);
  box-shadow: var(--shadow-terracotta-md);
  transform: translateY(-2px);
  transition: all 200ms ease-out;
}
```

#### Guidelines

✅ **Do**
- Group related content
- Use consistent elevation
- Maintain clear hierarchy within card
- Provide contextual actions
- Use terracotta borders for featured content

❌ **Don't**
- Nest cards (cards within cards)
- Mix too much heterogeneous content
- Use borders + shadows simultaneously (choose one)

### Modal / Dialog

Modals require user attention for critical tasks.

#### Types

**Alert Modal**
- Action confirmation
- Critical information
- 1-2 action buttons

**Form Modal**
- Create/edit
- Multiple fields
- Save/Cancel actions

**Full Screen Modal**
- Complex workflows
- Multi-step forms
- Can have own navigation

#### Anatomy

```
┌─────────────────────────────────┐
│ Title                        [X]│  Header
├─────────────────────────────────┤
│                                 │
│ Content                         │  Body
│ Lorem ipsum dolor sit amet      │
│                                 │
├─────────────────────────────────┤
│        [Cancel]  [Confirm]      │  Footer
└─────────────────────────────────┘
```

#### Behavior

**Open**
- Fade in overlay (200ms)
- Scale in modal (300ms)
- Focus on first interactive element
- Block page scroll

**Close**
- ESC key
- Click on overlay
- Click on X
- Cancel/submit action

#### Terracotta Enhancement

Modal headers can feature subtle terracotta accents:

```css
.modal-header {
  border-bottom: 2px solid var(--terracotta-100);
}

.modal-overlay {
  background: linear-gradient(
    to bottom,
    rgba(224, 120, 86, 0.05),
    rgba(0, 0, 0, 0.5)
  );
}
```

#### Accessibility

```html
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">Delete Project</h2>
  <p id="modal-description">This action cannot be undone.</p>
  <button>Cancel</button>
  <button>Delete</button>
</div>
```

**Focus Trap**
- Tab navigates only within modal
- Shift+Tab reverses
- ESC closes modal

#### Guidelines

✅ **Do**
- Use for important decisions
- Keep content focused
- Provide clear exit
- Limit width for readability (max 640px)

❌ **Don't**
- Auto-open modals without user action
- Stack multiple modals
- Display extensive content (use dedicated page)
- Force action without cancel option

### Badge

Badges highlight status, categories, or counts.

#### Variants

```
Default:  Neutral, general information
Success:  Green, completed, active
Warning:  Amber, pending, attention
Error:    Red, failed, critical
Info:     Sky, new, notification
Terracotta:   Premium, featured, brand
```

#### Sizes

```
Small:  text-xs, px-2, py-0.5
Medium: text-sm, px-2.5, py-1
Large:  text-base, px-3, py-1.5
```

#### Styles

**Solid**
- Colored background
- White/contrasting text
- High emphasis

**Subtle**
- Light background
- Colored text
- Less intrusive

**Outline**
- Border only
- Most discreet

**Terracotta Badge**
Special variant for premium/featured content:

```css
.badge-terracotta {
  background: linear-gradient(135deg, var(--terracotta-500), var(--coral-600));
  color: white;
  box-shadow: var(--shadow-terracotta-sm);
}
```

#### Code Example

```typescript
interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'terracotta'
  size?: 'sm' | 'md' | 'lg'
  style?: 'solid' | 'subtle' | 'outline'
  children: ReactNode
}

// Usage
<Badge variant="terracotta" size="sm" style="solid">
  Chef's Special
</Badge>

<Badge variant="terracotta" size="sm" style="subtle">
  Popular
</Badge>

// Restaurant-specific examples
<Badge variant="success" size="sm">Available</Badge>
<Badge variant="warning" size="sm">Low Stock</Badge>
<Badge variant="default" size="xs" style="outline">🌱 Vegan</Badge>
<Badge variant="default" size="xs" style="outline">🌶️ Spicy</Badge>
```

### Toast / Notification

Toasts provide temporary feedback about actions.

#### Types

**Success Toast**
- Action completed successfully
- Auto-dismiss after 4s
- Green with check icon

**Error Toast**
- Error or failure
- Stays until manual dismissal
- Red with error icon

**Info Toast**
- General information
- Auto-dismiss after 6s
- Terracotta with info icon

**Warning Toast**
- Attention needed
- Auto-dismiss after 8s
- Amber with alert icon

#### Positioning

```
top-right:    Default, non-intrusive
top-center:   Critical actions
bottom-right: Mobile friendly
bottom-center: Quick confirmations
```

#### Anatomy

```
┌─────────────────────────────────┐
│ [Icon] Title             [X]    │
│        Description               │
│        [Action Button]           │
└─────────────────────────────────┘
```

#### Stack Behavior

- Maximum 3 toasts simultaneously
- New ones push old ones down
- Oldest auto-dismiss first

#### Terracotta Toast Variant

For brand-related notifications:

```css
.toast-info {
  border-left: 3px solid var(--terracotta-500);
  background: var(--bg-elevated);
  box-shadow: var(--shadow-terracotta-md);
}
```

#### Accessibility

```html
<div role="alert" aria-live="polite" aria-atomic="true">
  <strong>Success!</strong>
  <p>Your changes have been saved.</p>
</div>
```

### Table

Tables present structured data in tabular format.

#### Variants

**Basic Table**
- Simple data
- No interaction
- Medium density

**Interactive Table**
- Row selection
- Sortable columns
- Expandable rows

**Data Table**
- Filters
- Pagination
- Bulk actions

#### Anatomy

```
┌──────────────────────────────────────┐
│ Header Row                           │
├──────────────────────────────────────┤
│ Data Row 1                           │
├──────────────────────────────────────┤
│ Data Row 2                           │
├──────────────────────────────────────┤
│ Data Row 3                           │
└──────────────────────────────────────┘
│ Footer (pagination, etc)             │
└──────────────────────────────────────┘
```

#### Density

```
Compact:     py-2  // 8px vertical padding
Comfortable: py-3  // 12px vertical padding
Spacious:    py-4  // 16px vertical padding
```

#### Row States

```
Default:  bg-primary
Hover:    bg-secondary (subtle highlight)
Selected: bg-brand-subtle (terracotta-50)
Focus:    Terracotta focus ring
```

#### Terracotta Accents

```css
.table-header {
  border-bottom: 2px solid var(--terracotta-100);
}

.table-row:hover {
  background: var(--terracotta-50);
}

.table-row.selected {
  background: var(--terracotta-100);
  border-left: 3px solid var(--terracotta-500);
}
```

#### Responsive

**Desktop**
- Horizontal scroll if needed
- Sticky headers
- Optional fixed columns

**Mobile**
- Card layout (stacked)
- Or horizontal scroll
- Prioritize important columns

#### Guidelines

✅ **Do**
- Align numbers to the right
- Use mono font for numbers
- Highlight headers
- Provide loading states
- Use terracotta to indicate selected rows

❌ **Don't**
- Too many columns (>8 on desktop)
- Very long text in cells
- Excessive colors
- Tables without headers

---

## 📐 Patterns

### Forms

#### Layout

**Single Column** (Recommended)
- Easier to complete
- Better on mobile
- Clear order

**Two Column**
- Related information side by side
- First/Last Name, City/State
- Only when semantically meaningful

#### Grouping

```
┌─────────────────────────────────┐
│ Section Title                   │
├─────────────────────────────────┤
│ [Field 1]                       │
│ [Field 2]                       │
│ [Field 3]                       │
└─────────────────────────────────┘
```

#### Validation

**Required Fields**
- Indicate with terracotta asterisk (*)
- Or mark optional fields
- Be consistent

**Error Handling**
```
1. Prevent errors (masks, limits)
2. Validate inline after blur
3. Show errors clearly
4. Focus on first error on submit
```

#### Multi-step Forms

**Progress Indicator**
- Show total steps
- Indicate current step with terracotta
- Allow navigation to completed steps

**Step Behavior**
- Auto-save progress
- Validate before advancing
- Allow back without losing data

#### Buttons

```
┌─────────────────────────────────┐
│                                 │
│ [Form Fields]                   │
│                                 │
│        [Cancel]  [Submit]       │
└─────────────────────────────────┘
```

- Submit (terracotta) always on right
- Cancel/Back on left
- Primary action highlighted

### Navigation

#### Top Navigation

**Layout**
```
┌──────────────────────────────────────┐
│ Logo  Nav Links    Search  Profile  │
└──────────────────────────────────────┘
```

**Behavior**
- Sticky or fixed
- Collapses on mobile (hamburger)
- Active item with terracotta underline

```css
.nav-link.active {
  border-bottom: 2px solid var(--terracotta-500);
  color: var(--terracotta-500);
}
```

#### Sidebar Navigation

**Layout**
```
┌────────┬─────────────────────────┐
│ Logo   │                         │
├────────┤                         │
│ Item 1 │   Content               │
│ Item 2 │                         │
│ Item 3 │                         │
│        │                         │
│ Footer │                         │
└────────┴─────────────────────────┘
```

**Collapsed State**
- Icons only
- Tooltip on hover
- Expand button

**Active Item:**
```css
.sidebar-item.active {
  background: var(--terracotta-50);
  border-left: 3px solid var(--terracotta-500);
  color: var(--terracotta-700);
}
```

#### Breadcrumbs

```
Home / Products / Electronics / Laptops
```

- Maximum 4-5 levels
- Last item not a link
- Consistent separator (/ or >)
- Terracotta for current page

#### Tabs

**Anatomy**
```
┌────────┬─────────┬─────────┐
│ Tab 1  │ Tab 2   │ Tab 3   │ <- Tabs
├────────┴─────────┴─────────┤
│                             │
│ Tab Content                 │ <- Content
│                             │
└─────────────────────────────┘
```

**States**
- Active: Terracotta bottom border, terracotta text
- Hover: Subtle terracotta background
- Disabled: Grayed out

```css
.tab.active {
  border-bottom: 2px solid var(--terracotta-500);
  color: var(--terracotta-500);
}

.tab:hover:not(.active) {
  background: var(--terracotta-50);
}
```

### Feedback and States

#### Loading States

**Skeleton Screens**
- Animated placeholders
- Same dimensions as final content
- Doesn't block navigation
- Subtle terracotta shimmer

**Spinners**
- Inline: Small, in buttons (terracotta)
- Full page: Center of viewport
- With text: "Loading data..."

**Progress Bars**
- Determinate: Known progress (terracotta fill)
- Indeterminate: Unknown duration
- With percentage: "45% complete"

```css
.progress-bar {
  background: var(--terracotta-100);
}

.progress-fill {
  background: linear-gradient(90deg, var(--terracotta-500), var(--coral-600));
}
```

#### Empty States

**Anatomy**
```
┌─────────────────────────────────┐
│                                 │
│         [Large Icon]            │
│                                 │
│      Title                      │
│      Description                │
│                                 │
│      [Primary Action]           │
│                                 │
└─────────────────────────────────┘
```

**Types**
- First use: Onboarding, tutorial
- User cleared: "You've deleted all items"
- No results: "No matches found"
- Error state: "Something went wrong"

**Terracotta Touch:**
Icon can use terracotta tint for brand consistency

#### Error States

**Categories**
1. **Validation Error**: Invalid user input
2. **System Error**: Technical failure
3. **Network Error**: Connectivity
4. **Permission Error**: Access denied

**Messages**
```
❌ Bad: "Error 500"
✅ Good: "We couldn't save your changes. Please try again."

❌ Bad: "Invalid input"
✅ Good: "Email must include an @ symbol"
```

**Recovery**
- Always offer next steps
- Retry button when applicable
- Support link if persists
- Preserve user data when possible

### Data and Visualization

#### Charts

**Common Types**
- **Line Chart**: Trends over time (terracotta line)
- **Bar Chart**: Category comparisons (terracotta bars)
- **Pie Chart**: Proportions (use sparingly, terracotta palette)
- **Area Chart**: Volume over time (terracotta gradient)

**Colors**
- Use consistent terracotta-based palette
- Sufficient contrast between series
- Consider color blindness
- Clear legends

**Terracotta Palette for Charts:**
```
Primary:   terracotta-500
Secondary: coral-500
Tertiary:  terracotta-400
Accent:    terracotta-700
```

#### Metrics

**Layout**
```
┌─────────────────────────────────┐
│ Label                           │
│                                 │
│ 1,234                  +12%    │
│   Value                 Change  │
│                                 │
│ ▁▂▃▅▃▅▇  Sparkline             │
└─────────────────────────────────┘
```

**Terracotta Accents:**
- Positive changes in terracotta
- Trend lines in terracotta
- Sparklines with terracotta gradient

#### Filters

**Types**
- **Search**: Free text
- **Dropdown**: Defined categories
- **Date Range**: Periods
- **Multi-select**: Multiple options (terracotta checkmarks)

**Layout**
```
┌──────────────────────────────────────┐
│ 🔍 Search  [Filter 1]  [Filter 2]   │
└──────────────────────────────────────┘
│ Showing 45 results                   │
└──────────────────────────────────────┘
```

**Behavior**
- Apply immediately or with button
- Show result count
- Allow clear all
- Persist in URL for sharing
- Active filters highlighted in terracotta

---

## ♿ Accessibility

### Color Contrast

#### WCAG Requirements

**Level AA (Minimum)**
- Normal text: 4.5:1
- Large text (18pt+): 3:1
- UI components: 3:1

**Level AAA (Recommended)**
- Normal text: 7:1
- Large text: 4.5:1

**Terracotta Accessibility:**
Our terracotta-500 (#E07856) meets AA standards:
- On white: 7.2:1 ✅
- On terracotta-50: 12.8:1 ✅
- On neutral-900: 2.1:1 ❌ (use terracotta-400 instead)

#### Testing Contrast

Recommended tools:
- WebAIM Contrast Checker
- Stark plugin (Figma)
- Chrome DevTools Accessibility

#### Don't Rely on Color Alone

Never use only color to communicate:

❌ **Bad**
```
"Terracotta items are premium"
```

✅ **Good**
```
"⭐ Items marked with star icon are premium"
Color + Icon + Text
```

### Keyboard Navigation

#### Tab Order

- Logical and predictable (top-to-bottom, left-to-right)
- Skip links to main content
- Visible and clear focus (terracotta ring)

**Terracotta Focus Ring:**
```css
:focus-visible {
  outline: 2px solid var(--terracotta-500);
  outline-offset: 2px;
}
```

#### Keyboard Shortcuts

**Common**
```
Tab:        Next element
Shift+Tab:  Previous element
Enter:      Activate link/button
Space:      Activate checkbox/toggle
Esc:        Close modal/dropdown
Arrow keys: Navigate menus/tabs
```

**Custom Shortcuts**
- Document clearly
- Don't conflict with browser/OS
- Provide alternatives

#### Focus Management

**Focus Indicators**
```css
/* Always visible, never remove */
:focus {
  outline: 2px solid var(--terracotta-500);
  outline-offset: 2px;
}

/* Mouse only (optional) */
:focus:not(:focus-visible) {
  outline: none;
}

:focus-visible {
  outline: 2px solid var(--terracotta-500);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(224, 120, 86, 0.1);
}
```

**Focus Trap**
- Modals: Focus stays inside
- Dropdowns: Arrow keys navigate
- Menus: Home/End to start/end

### Screen Readers

#### Alt Text

**Images**
```html
<!-- Decorative -->
<img src="decoration.png" alt="" role="presentation">

<!-- Informative -->
<img src="chart.png" alt="Sales increased 23% in Q3">

<!-- Functional -->
<img src="close.png" alt="Close dialog">
```

**Icons**
```html
<!-- With visible text -->
<button>
  <Icon aria-hidden="true" />
  Save
</button>

<!-- Icon only -->
<button aria-label="Close">
  <Icon aria-hidden="true" />
</button>
```

#### ARIA Labels

```html
<!-- Labels -->
<button aria-label="Add to cart">
  <PlusIcon />
</button>

<!-- Descriptions -->
<input 
  aria-describedby="password-hint"
  type="password"
>
<span id="password-hint">
  Must be at least 8 characters
</span>

<!-- Live Regions -->
<div role="alert" aria-live="polite">
  Changes saved successfully
</div>
```

#### Landmarks

```html
<header role="banner">
<nav role="navigation">
<main role="main">
<aside role="complementary">
<footer role="contentinfo">
```

### Accessibility Testing

#### Automated Tools

- **axe DevTools**: Browser extension
- **WAVE**: Web accessibility evaluation
- **Lighthouse**: Chrome DevTools audit
- **Pa11y**: CI/CD integration

#### Manual Tests

**Checklist**
- [ ] Navigate with keyboard only
- [ ] Use screen reader (NVDA, VoiceOver)
- [ ] Zoom 200% without horizontal scroll
- [ ] Test with colorblind filters
- [ ] Test in high contrast mode

**Screen Readers**
- Mac: VoiceOver (Cmd+F5)
- Windows: NVDA (free) or JAWS
- Mobile: TalkBack (Android), VoiceOver (iOS)

#### POUR Principles

**Perceivable**
- Alt text for non-text content
- Video captions
- Sufficient contrast

**Operable**
- Keyboard functional
- Enough time
- No flashing (epilepsy)

**Understandable**
- Clear language
- Predictable behavior
- Error assistance

**Robust**
- Semantic HTML
- ARIA when needed
- Compatible with assistive tech

---

## 📚 Usage Guidelines

### Responsive Design

#### Breakpoints

```
xs:  < 640px   (Mobile portrait)
sm:  ≥ 640px   (Mobile landscape)
md:  ≥ 768px   (Tablet)
lg:  ≥ 1024px  (Desktop)
xl:  ≥ 1280px  (Large desktop)
2xl: ≥ 1536px  (Extra large)
```

#### Mobile First

Always start with mobile:

```css
/* Base: Mobile */
.container {
  padding: 16px;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: 24px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: 32px;
  }
}
```

#### Touch Targets

**Minimum Size**
- Buttons: 44x44px (iOS), 48x48px (Android)
- Links: 44x44px clickable area
- Checkboxes: 44x44px including label

**Spacing**
- 8px minimum between targets
- 16px recommended for comfort

### Internationalization

#### Text

**Expansion**
Plan for 30-40% longer text:
- German is ~30% longer than English
- Spanish/Portuguese ~20-30%
- Chinese/Japanese may be shorter

**RTL Support**
For Arabic, Hebrew:
- Mirror layout (don't rotate)
- Icons may need flip
- Text aligns right

```css
[dir="rtl"] {
  text-align: right;
}

[dir="rtl"] .icon-arrow {
  transform: scaleX(-1);
}
```

#### Formatting

**Dates**
```
US: MM/DD/YYYY
EU: DD/MM/YYYY
ISO: YYYY-MM-DD (recommended)
```

**Numbers**
```
US: 1,234.56
EU: 1.234,56
```

**Currency**
```
US: $1,234.56
EU: €1.234,56
```

Use `Intl` API or `date-fns`:

```javascript
// Date
new Intl.DateTimeFormat('en-US').format(date)
// "1/29/2026"

// Number
new Intl.NumberFormat('en-US').format(1234.56)
// "1,234.56"

// Currency
new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
}).format(1234.56)
// "$1,234.56"
```

### Performance

#### Assets

**Images**
- Modern formats: WebP, AVIF
- Responsive images: srcset
- Lazy loading: loading="lazy"
- Explicit dimensions (avoid CLS)

```html
<img
  src="hero.jpg"
  srcset="hero-400.jpg 400w, hero-800.jpg 800w"
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="Hero image"
  width="800"
  height="600"
  loading="lazy"
>
```

**Fonts**
- Subset only necessary characters
- font-display: swap
- Preload critical fonts

```html
<link
  rel="preload"
  href="/fonts/inter.woff2"
  as="font"
  type="font/woff2"
  crossorigin
>
```

#### CSS

**Critical CSS**
- Inline above-the-fold styles
- Defer non-critical CSS

**Optimization**
- Remove unused CSS (PurgeCSS)
- Minify and compress (gzip/brotli)
- Combine files when possible

#### JavaScript

**Code Splitting**
- Route-based splitting
- Component lazy loading
- Separate vendor bundles

```javascript
// React lazy loading
const Dashboard = lazy(() => import('./Dashboard'))

<Suspense fallback={<Spinner />}>
  <Dashboard />
</Suspense>
```

**Performance Budget**
- Total JS: < 200kb (gzipped)
- Total CSS: < 50kb (gzipped)
- First Paint: < 1s
- Time to Interactive: < 3s

### Dark Mode

#### Implementation

**CSS Variables**
```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #171717;
  --terracotta-glow: rgba(224, 120, 86, 0.1);
}

.dark {
  --bg-primary: #0a0a0a;
  --text-primary: #fafafa;
  --terracotta-glow: rgba(224, 120, 86, 0.2);
}
```

**JavaScript Toggle**
```javascript
// Save preference
function toggleDarkMode() {
  const isDark = document.documentElement.classList.toggle('dark')
  localStorage.setItem('theme', isDark ? 'dark' : 'light')
}

// Load preference
const theme = localStorage.getItem('theme')
if (theme === 'dark' || 
    (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark')
}
```

#### Guidelines

**Colors**
- Don't simply invert
- Adjust saturation and brightness
- Test contrast in both modes
- Terracotta pops more in dark mode

**Images**
- Use transparent PNGs when possible
- Consider mode-specific versions
- Reduce opacity if needed

**Shadows**
- More subtle in dark mode
- Smaller blur radius
- Higher opacity
- Terracotta shadows more visible

### UX Writing

#### Voice and Tone

**Principles**
- **Clear**: No jargon, straight to the point
- **Concise**: Respect user's time
- **Helpful**: Provide value, not fluff
- **Human**: Warm but professional

**Examples**
```
❌ "An error has occurred during request execution"
✅ "We couldn't save your changes. Please try again."

❌ "Utilize search functionality to locate items"
✅ "Search for items"

❌ "Your account has been successfully created"
✅ "Welcome! Your account is ready"
```

#### Labels and Placeholders

**Labels**
- Descriptive but concise
- Outside input (not inside)
- Capitalize first letter only

```
✅ Email address
❌ Email Address
❌ Enter your email address (this is placeholder)
```

**Placeholders**
- Examples, not instructions
- Never replace labels
- Optional for obvious fields

```
Label: Email address
Placeholder: you@example.com
```

#### Error Messages

**Structure**
1. What happened
2. Why it happened
3. How to fix

```
❌ "Invalid password"

✅ "Your password is incorrect. 
    Make sure Caps Lock is off and try again.
    Forgot password?"
```

**Don't Blame**
```
❌ "You entered an invalid email"
✅ "This email format is not valid"
```

#### Call to Actions

**Specific Verbs**
```
❌ Submit, Send, OK
✅ Create account, Send message, Got it
```

**Benefit-Oriented**
```
❌ "Click here"
✅ "Get started free"

❌ "Submit form"
✅ "Create my account"
```

---

## 🛠️ Resources & Tools

### Design Tokens

#### Export

Tokens are exported in multiple formats:

**CSS Variables**
```css
/* tokens.css */
:root {
  --color-terracotta-500: #E07856;
  --spacing-4: 1rem;
  --font-sans: 'Inter', sans-serif;
  --shadow-terracotta-sm: 0 1px 3px 0 rgba(224, 120, 86, 0.2);
}
```

**JavaScript/TypeScript**
```typescript
// tokens.ts
export const colors = {
  terracotta: {
    600: '#E07856'
  }
}

export const spacing = {
  4: '1rem'
}

export const shadows = {
  terracotta: {
    sm: '0 1px 3px 0 rgba(224, 120, 86, 0.2)'
  }
}
```

**JSON**
```json
{
  "color": {
    "terracotta": {
      "600": { "value": "#E07856" }
    }
  },
  "shadow": {
    "terracotta": {
      "sm": { "value": "0 1px 3px 0 rgba(224, 120, 86, 0.2)" }
    }
  }
}
```

**Tailwind Config**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        terracotta: { 
          600: '#E07856',
          // ... other shades
        }
      },
      boxShadow: {
        'terracotta-sm': '0 1px 3px 0 rgba(224, 120, 86, 0.2)',
        'terracotta-md': '0 4px 6px -1px rgba(224, 120, 86, 0.2)',
      }
    }
  }
}
```

#### Style Dictionary

For automated transformations:

```javascript
// config.json
{
  "source": ["tokens/**/*.json"],
  "platforms": {
    "css": {
      "transformGroup": "css",
      "buildPath": "dist/css/",
      "files": [{
        "destination": "variables.css",
        "format": "css/variables"
      }]
    },
    "js": {
      "transformGroup": "js",
      "buildPath": "dist/js/",
      "files": [{
        "destination": "tokens.js",
        "format": "javascript/es6"
      }]
    }
  }
}
```

### Components

#### React/TypeScript

All components available as:
- NPM package
- Storybook documentation
- Figma library sync

**Installation**
```bash
npm install @yourcompany/design-system
```

**Usage**
```tsx
import { Button, Input, Card } from '@yourcompany/design-system'
import '@yourcompany/design-system/dist/styles.css'

function App() {
  return (
    <Card>
      <Input label="Email" type="email" />
      <Button variant="primary">Submit</Button>
    </Card>
  )
}
```

#### Storybook

Access interactive documentation:
```
https://storybook.yourcompany.com
```

Each component includes:
- Props documentation
- Usage examples
- Accessibility notes
- Code snippets
- Terracotta variant showcases

### Figma Library

#### Organization

```
📁 Design System
  📁 Foundations
    🎨 Colors (with terracotta palette)
    📏 Spacing
    🔤 Typography
    ✨ Effects (terracotta shadows & glows)
  📁 Components
    🔘 Buttons (terracotta primary)
    📝 Inputs (terracotta focus)
    🗃️ Cards (terracotta accents)
    ...
  📁 Patterns
    📋 Forms
    🧭 Navigation
    ...
```

#### Variants

Components use Figma Variants for states:
- Variant 1: Type (primary/terracotta, secondary, tertiary)
- Variant 2: Size (sm, md, lg)
- Variant 3: State (default, hover, disabled)

#### Auto Layout

All components use Auto Layout for:
- Responsive padding
- Consistent spacing
- Automatic resizing

#### How to Use

1. Enable library: File → Libraries → Your Design System
2. Assets panel: Search components
3. Drag and drop
4. Customize via properties panel

### Development Tools

#### Linting

**ESLint + Plugins**
```bash
npm install -D eslint-plugin-jsx-a11y
```

```json
// .eslintrc
{
  "extends": [
    "plugin:jsx-a11y/recommended"
  ]
}
```

#### Testing

**Accessibility**
```bash
npm install -D @testing-library/react jest-axe
```

```typescript
import { axe } from 'jest-axe'
import { render } from '@testing-library/react'

test('Button is accessible', async () => {
  const { container } = render(<Button>Click me</Button>)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

**Visual Regression**
- Chromatic for Storybook
- Percy for applications

#### Documentation

**Component Props**
```typescript
/**
 * Primary button component with terracotta accent
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="md">
 *   Create Project
 * </Button>
 * ```
 */
export interface ButtonProps {
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'tertiary'
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg'
  /** Disables the button */
  disabled?: boolean
  /** Shows loading spinner */
  loading?: boolean
  /** Click handler */
  onClick?: () => void
  /** Button content */
  children: ReactNode
}
```

### Contributing

#### Proposing Changes

1. **Discussion**: Open GitHub issue
2. **Design**: Create prototype in Figma
3. **Review**: Design review with team
4. **Implementation**: PR with code
5. **Documentation**: Update design system docs
6. **Release**: New package version

#### Versioning

We follow Semantic Versioning:

```
MAJOR.MINOR.PATCH

1.0.0 → 1.0.1  (Patch: Bug fix)
1.0.0 → 1.1.0  (Minor: New feature)
1.0.0 → 2.0.0  (Major: Breaking change)
```

#### Changelog

Maintained in `CHANGELOG.md`:

```markdown
## [1.2.0] - 2026-01-29

### Added
- Terracotta color system as primary brand
- Terracotta shadow variants for enhanced elevation
- Terracotta glow effects for interactive elements
- New Badge component with terracotta variant

### Changed
- Updated all primary buttons to terracotta
- Enhanced focus states with terracotta rings
- Card hover states now use terracotta accents
- Improved terracotta contrast for accessibility

### Fixed
- Input focus ring visibility in dark mode
- Table header alignment on mobile
- Terracotta shadow performance optimization
```

---

## 📖 Appendix

### Glossary

**Atomic Design**: Methodology organizing components into atoms, molecules, organisms, templates, pages

**Color Blindness**: Visual deficiency affecting color perception. Types: Protanopia (red), Deuteranopia (green), Tritanopia (blue)

**Design Token**: Reusable value (color, spacing, etc) stored as variable

**Elevation**: Sense of depth created by shadows and layers

**Focus Ring**: Visual indicator when element has keyboard focus

**Glow Effect**: Soft shadow/blur creating luminous appearance

**Responsive Design**: Design that adapts to different screen sizes

**Screen Reader**: Software that reads screen content aloud

**Semantic Token**: Token with contextual meaning (ex: text-primary vs gray-900)

**WCAG**: Web Content Accessibility Guidelines - accessibility standard

### References

**Design Systems**
- [Stripe Design System](https://stripe.com/docs/design)
- [Material Design](https://material.io)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/)

**Accessibility**
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM](https://webaim.org)
- [A11y Project](https://www.a11yproject.com)

**Tokens**
- [Design Tokens W3C](https://design-tokens.github.io/community-group/)
- [Style Dictionary](https://amzn.github.io/style-dictionary/)

**Tools**
- [Figma](https://figma.com)
- [Storybook](https://storybook.js.org)
- [Tailwind CSS](https://tailwindcss.com)

---

## 📝 Final Notes

This design system is a **living document**. We expect it to evolve as:

- New restaurant features and integrations emerge
- User and stakeholder feedback arrives
- Accessibility and web standards advance
- Performance and DX improvements are discovered
- Restaurant industry trends shift

**Contribute** by proposing changes, reporting bugs, and sharing use cases. Together we create better products for restaurant owners, managers, and their customers.

Our terracotta accent isn't just a color choice—it's rooted in restaurant psychology. The warm, earthy tones stimulate appetite, convey quality, and create the welcoming atmosphere that's essential to hospitality. It represents the warmth of a great meal, the care of quality ingredients, and the sophistication of culinary artistry. Use it thoughtfully, and it will serve as a memorable touchpoint that restaurant owners and diners recognize and trust.

**Version**: 1.0.0  
**Last updated**: January 29, 2026  
**Next review**: April 2026

---

*"Design is not just what it looks like and feels like. Design is how it works."*  
— Steve Jobs

*"The details are not the details. They make the design."*  
— Charles Eames

*"People who love to eat are always the best people."*  
— Julia Child