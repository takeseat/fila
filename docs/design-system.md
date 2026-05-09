# Design System

> A modern, scalable design system built on semantic tokens, inspired by Stripe's best practices with a sophisticated indigo aesthetic for restaurant software.

**Version:** 2.0.0  
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

This design system provides a consistent, accessible, and scalable visual language for all our restaurant management applications and products. Inspired by Stripe's clarity and elegance with a distinctive indigo accent that evokes trust, professionalism, and modern sophistication, our system prioritizes:

- **Clarity**: Direct, unambiguous communication
- **Consistency**: Unified experiences across all touchpoints
- **Efficiency**: Tools that accelerate development
- **Accessibility**: Inclusive products by design
- **Trust**: Indigo touches that create professional, reliable experiences

### How to Use This Document

This document serves as the complete reference for designers, developers, and product managers. Each section contains:

- **Technical specifications**: Exact values and implementation
- **Usage guidelines**: When and how to apply each element
- **Practical examples**: Real-world use cases
- **Accessibility considerations**: Ensuring inclusion

---

## 🎨 Design Principles

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

### 6. Professional and Trustworthy

Indigo accents create a trustworthy, professional atmosphere that resonates with modern business. We use sophisticated tones thoughtfully to evoke reliability and quality.

**Practices:**
- Indigo for primary actions and brand moments
- Cool neutrals for backgrounds
- Violet accents for interactive elements
- Balance with slate and lavender tones

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

**Neutral (Slate)**
```
neutral-0:   #FFFFFF (pure white)
neutral-50:  #F8FAFC
neutral-100: #F1F5F9
neutral-200: #E2E8F0
neutral-300: #CBD5E1
neutral-400: #94A3B8
neutral-500: #64748B
neutral-600: #475569
neutral-700: #334155
neutral-800: #1E293B
neutral-900: #0F172A
neutral-950: #020617
```

**Indigo (Primary Brand)**
```
indigo-50:  #EEF2FF
indigo-100: #E0E7FF
indigo-200: #C7D2FE
indigo-300: #A5B4FC
indigo-400: #818CF8
indigo-500: #6366F1 (primary brand)
indigo-600: #4F46E5 (primary hover)
indigo-700: #4338CA (primary active)
indigo-800: #3730A3
indigo-900: #312E81
indigo-950: #1E1B4B
```

**Violet (Secondary/Accent)**
```
violet-50:  #F5F3FF
violet-100: #EDE9FE
violet-200: #DDD6FE
violet-300: #C4B5FD
violet-400: #A78BFA
violet-500: #8B5CF6
violet-600: #7C3AED
violet-700: #6D28D9
violet-800: #5B21B6
violet-900: #4C1D95
violet-950: #2E1065
```

**Purple (Light Accent)**
```
purple-50:  #FAF5FF
purple-100: #F3E8FF
purple-200: #E9D5FF
purple-300: #D8B4FE
purple-400: #C084FC
purple-500: #A855F7
purple-600: #9333EA
purple-700: #7E22CE
purple-800: #6B21A8
purple-900: #581C87
purple-950: #3B0764
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

> **WARNING**: Never use hardcoded numbers (e.g. `rounded-[8px]`) or generic spacing utilities for components.
> - **Buttons**: MUST use `radius-md` (8px).
> - **Cards**: MUST use `radius-lg` (12px).
> - **Modals**: MUST use `radius-xl` (16px).
```

#### Shadows

```
shadow-xs:  0 1px 2px 0 rgba(0, 0, 0, 0.05)
shadow-sm:  0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)
shadow-md:  0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)
shadow-lg:  0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)
shadow-xl:  0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)
shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)

shadow-indigo-sm:  0 1px 3px 0 rgba(99, 102, 241, 0.2)
shadow-indigo-md:  0 4px 6px -1px rgba(99, 102, 241, 0.2), 0 2px 4px -2px rgba(99, 102, 241, 0.15)
shadow-indigo-lg:  0 10px 15px -3px rgba(99, 102, 241, 0.2), 0 4px 6px -4px rgba(99, 102, 241, 0.15)
shadow-indigo-xl:  0 20px 25px -5px rgba(99, 102, 241, 0.25), 0 8px 10px -6px rgba(99, 102, 241, 0.2)
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

bg-brand:         indigo-500     // Brand backgrounds
bg-brand-subtle:  indigo-50      // Subtle brand backgrounds (EEF2FF)
bg-brand-light:   indigo-100     // Light brand backgrounds
bg-brand-hover:   indigo-600     // Brand hover state (4F46E5)
bg-brand-active:  indigo-700     // Brand active state (4338CA)

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

bg-brand:         indigo-500
bg-brand-subtle:  indigo-950
bg-brand-light:   indigo-900
bg-brand-hover:   indigo-600
bg-brand-active:  indigo-700

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

text-brand:       indigo-500     // Brand text
text-brand-hover: indigo-600     // Brand text hover
text-success:     green-700      // Success text
text-warning:     amber-700      // Warning text
text-error:       red-700        // Error text
text-info:        sky-700        // Info text
text-link:        indigo-500     // Links
text-link-hover:  indigo-600     // Link hover state
```

**Dark Mode**
```
text-primary:     neutral-50
text-secondary:   neutral-400
text-tertiary:    neutral-500
text-disabled:    neutral-600
text-inverse:     neutral-950

text-brand:       indigo-400
text-brand-hover: indigo-300
text-success:     green-400
text-warning:     amber-300
text-error:       red-400
text-info:        sky-400
text-link:        indigo-400
text-link-hover:  indigo-300
```

#### Border Colors

**Light Mode**
```
border-default:   neutral-200    // Default borders
border-subtle:    neutral-100    // Subtle borders
border-strong:    neutral-300    // Emphasized borders
border-brand:     indigo-500     // Brand borders
border-error:     red-300        // Error borders
border-focus:     indigo-500     // Focus rings
```

**Dark Mode**
```
border-default:   neutral-700
border-subtle:    neutral-800
border-strong:    neutral-600
border-brand:     indigo-500
border-error:     red-700
border-focus:     indigo-500
```

#### Interactive Colors

**Light Mode**
```
interactive-primary:         indigo-500
interactive-primary-hover:   indigo-600    // 4F46E5
interactive-primary-active:  indigo-700    // 4338CA
interactive-primary-disabled: neutral-300

interactive-secondary:       neutral-0
interactive-secondary-hover: neutral-50
interactive-secondary-active: neutral-100
interactive-secondary-disabled: neutral-200

interactive-tertiary:        transparent
interactive-tertiary-hover:  indigo-50     // EEF2FF
interactive-tertiary-active: indigo-100
```

**Dark Mode**
```
interactive-primary:         indigo-500
interactive-primary-hover:   indigo-600
interactive-primary-active:  indigo-700
interactive-primary-disabled: neutral-700

interactive-secondary:       neutral-800
interactive-secondary-hover: neutral-700
interactive-secondary-active: neutral-600
interactive-secondary-disabled: neutral-800

interactive-tertiary:        transparent
interactive-tertiary-hover:  indigo-950
interactive-tertiary-active: indigo-900
```

### Component Tokens

#### Button Tokens

**Primary Button**
```
button-primary-bg:           interactive-primary
button-primary-bg-hover:     interactive-primary-hover     // 4F46E5
button-primary-bg-active:    interactive-primary-active    // 4338CA
button-primary-bg-disabled:  interactive-primary-disabled
button-primary-text:         text-inverse
button-primary-border:       interactive-primary
button-primary-shadow:       shadow-indigo-sm
button-primary-shadow-hover: shadow-indigo-md
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
input-shadow-focus:      0 0 0 3px rgba(99, 102, 241, 0.1)
input-glow-focus:        0 0 0 1px indigo-500
```

#### Card Tokens

```
card-bg:             bg-elevated
card-border:         border-default
card-radius:         radius-lg
card-padding:        spacing-6
card-shadow:         shadow-md
card-shadow-hover:   shadow-lg
card-shadow-featured: shadow-indigo-md
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

#### Indigo as Primary

Indigo is our signature color, used to:
- **Guide Action**: Primary buttons and CTAs
- **Show Focus**: Interactive element states
- **Highlight Premium**: Featured content and upgrades
- **Build Trust**: Professional, reliable brand moments

**Usage Guidelines:**
- Use indigo-500 (#6366F1) for primary actions
- Reserve indigo-600 (#4F46E5) for hover states
- Use indigo-700 (#4338CA) for active states
- Apply indigo-50 (#EEF2FF) for subtle backgrounds
- Use indigo shadows for elevated interactive elements

#### Dark Mode

Dark mode isn't simply inverted light mode. Special considerations:

**Reduced Contrast**
- Pure white (#FFFFFF) is too aggressive on dark backgrounds
- Use neutral-50 for primary text in dark mode
- Reduce shadow opacity

**Increased Saturation**
- Colors need more saturation to maintain vibrancy
- Indigo, green, and red are more vibrant in dark mode

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
- Indigo for brand and neutral importance

#### Restaurant Industry Color Psychology

Our indigo palette was specifically chosen for restaurant software:

**Why Indigo Works for Restaurants:**
- **Trust & Professionalism**: Deep blue-purple tones convey reliability and expertise
- **Modern Sophistication**: Contemporary, tech-forward aesthetic
- **Calming Influence**: Cool tones create focused, efficient environments
- **Premium Perception**: Associated with quality, premium services
- **Universal Appeal**: Works across all restaurant types and cultures

**Practical Applications:**
```
"Reserve Table" buttons:     indigo-500 (trust & conversion)
Featured menu items:         indigo-50 background (#EEF2FF)
Premium tier badge:          indigo-100 with indigo-700 text
Booking confirmations:       indigo-50 with green success icon
Active table status:         indigo border-left
Pro/Enterprise features:     indigo-400 icon
Analytics highlights:        violet-50 background (secondary sophistication)
```

**Color Strategy:**
- ✅ Indigo (builds trust, professional brand)
- ✅ Cool slate neutrals (clean, modern interface)
- ❌ Over-saturation (maintains professionalism)
- ✅ Subtle brand presence (lets content shine)

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

**Indigo Shadows**
Use indigo-tinted shadows for:
- Primary buttons (shadow-indigo-sm → shadow-indigo-md on hover)
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
  
  --shadow-indigo-sm: 0 1px 3px 0 rgba(99, 102, 241, 0.3);
  --shadow-indigo-md: 0 4px 6px -1px rgba(99, 102, 241, 0.3);
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

#### Indigo Glow Effect

For special interactive moments that evoke trust and professionalism:

```css
.indigo-glow {
  transition: box-shadow 200ms ease-out;
}

.indigo-glow:hover {
  box-shadow: 
    0 0 0 1px rgba(99, 102, 241, 0.3),
    0 4px 12px rgba(99, 102, 241, 0.25),
    0 8px 24px rgba(99, 102, 241, 0.15);
}

/* For prominent CTAs like "Reserve" or "Upgrade" */
.indigo-glow-strong {
  box-shadow: 
    0 0 0 1px rgba(99, 102, 241, 0.4),
    0 6px 16px rgba(99, 102, 241, 0.3),
    0 12px 32px rgba(99, 102, 241, 0.2);
}
```

**Restaurant Use Cases:**
- Primary reservation/booking buttons
- Premium tier upgrade cards on hover
- "Pro Feature" or "Enterprise" badges
- Active analytics dashboard cards
- Interactive report visualizations

---

## 🧩 Components

### Button

Buttons are primary action elements. They exist in three main variants, with indigo as the defining characteristic.

#### Variants

**Primary (Indigo)**
- Primary action on the screen
- Maximum one per visual context
- High contrast, maximum emphasis
- Indigo background with white text
- Indigo shadow on hover
- **Restaurant use**: "Reserve Table", "Upgrade Plan", "Export Report", "Save Changes"

**Secondary**
- Alternative actions
- Multiple can coexist
- Outline with subtle background
- Indigo border and text
- **Restaurant use**: "View Details", "Manage Settings", "Filter", "Sort"

**Tertiary/Ghost**
- Lower priority actions
- Text/icon only
- Used in navigation, secondary actions
- Indigo text on transparent background
- **Restaurant use**: "Cancel", "Edit", "Back", "Skip"

**Destructive**
- Permanent/dangerous actions
- Delete, remove, cancel orders
- Always requires confirmation
- Red variant
- **Restaurant use**: "Delete Menu Item", "Cancel Reservation", "Remove User"

#### Sizes

```
Small:  32px height - UI density, tables
Medium: 40px height - Default for forms
Large:  48px height - CTAs, landing pages
```

#### States

```
Default:  Base appearance (indigo-500)
Hover:    Darker indigo-600 (#4F46E5) + elevated shadow
Active:   Even darker indigo-700 (#4338CA), pressed appearance
Focus:    Indigo focus ring (outline)
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
<Button variant="primary" size="md" icon={<Calendar />}>
  Reserve Table
</Button>

<Button variant="primary" size="lg" icon={<CreditCard />}>
  Upgrade to Pro
</Button>

<Button variant="secondary" size="md" icon={<Download />}>
  Export Data
</Button>
```

#### Restaurant-Specific Examples

```typescript
// Reservation/Booking Flow
<Button variant="primary" size="lg" fullWidth>
  Confirm Reservation
</Button>

// Premium Features
<Button variant="primary" size="md" icon={<Zap />}>
  Upgrade to Pro
</Button>

// Table Management
<Button variant="secondary" size="sm" icon={<Check />}>
  Mark Complete
</Button>

// Analytics Export
<Button variant="secondary" size="md" icon={<Download />}>
  Download Report
</Button>

// Settings Actions
<Button variant="tertiary" size="sm">
  Advanced Settings
</Button>
```

#### Usage Guidelines

✅ **Do**
- Use clear action verbs ("Reserve", "Upgrade", "Export", "Save")
- One primary button per screen/section
- Provide visual feedback for loading states
- Keep labels short (1-3 words)
- Use indigo shadows for elevation and emphasis

❌ **Don't**
- Use generic labels like "Submit" or "OK"
- Have multiple primary buttons competing
- Disable buttons without explanation
- Use icons without labels (except universal actions)

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
Focus:    Indigo border + subtle glow
Error:    Red border + error message
Disabled: Grayed out, not editable
ReadOnly: Visible but not editable
```

**Focus State Enhancement:**
Indigo inputs get a subtle glow effect:

```css
input:focus {
  border-color: var(--indigo-500);
  box-shadow: 
    0 0 0 3px rgba(99, 102, 241, 0.1),
    0 0 0 1px rgba(99, 102, 241, 0.3);
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
- Indigo accent on hover
- Cursor pointer

**Featured Card**
- Visual highlight
- Indigo border or gradient
- Used for premium features
- Enhanced indigo shadow

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

#### Indigo Accents

**Subtle Indigo Highlight:**
```css
.card-featured {
  border: 1px solid var(--indigo-200);
  box-shadow: var(--shadow-indigo-sm);
}

.card-interactive:hover {
  border-color: var(--indigo-300);
  box-shadow: var(--shadow-indigo-md);
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
- Use indigo borders for featured content

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

#### Indigo Enhancement

Modal headers can feature subtle indigo accents:

```css
.modal-header {
  border-bottom: 2px solid var(--indigo-100);
}

.modal-overlay {
  background: linear-gradient(
    to bottom,
    rgba(99, 102, 241, 0.05),
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
Indigo:   Premium, featured, brand
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

**Indigo Badge**
Special variant for premium/featured content:

```css
.badge-indigo {
  background: linear-gradient(135deg, var(--indigo-500), var(--violet-600));
  color: white;
  box-shadow: var(--shadow-indigo-sm);
}
```

#### Code Example

```typescript
interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'indigo'
  size?: 'sm' | 'md' | 'lg'
  style?: 'solid' | 'subtle' | 'outline'
  children: ReactNode
}

// Usage
<Badge variant="indigo" size="sm" style="solid">
  Pro Feature
</Badge>

<Badge variant="indigo" size="sm" style="subtle">
  Premium
</Badge>

// Restaurant-specific examples
<Badge variant="success" size="sm">Active</Badge>
<Badge variant="warning" size="sm">Pending Review</Badge>
<Badge variant="indigo" size="xs" style="outline">⭐ Featured</Badge>
<Badge variant="indigo" size="xs" style="outline">👑 Enterprise</Badge>
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
- Indigo with info icon

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

#### Indigo Toast Variant

For brand-related notifications:

```css
.toast-info {
  border-left: 3px solid var(--indigo-500);
  background: var(--bg-elevated);
  box-shadow: var(--shadow-indigo-md);
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
Selected: bg-brand-subtle (indigo-50: #EEF2FF)
Focus:    Indigo focus ring
```

#### Indigo Accents

```css
.table-header {
  border-bottom: 2px solid var(--indigo-100);
}

.table-row:hover {
  background: var(--indigo-50);
}

.table-row.selected {
  background: var(--indigo-100);
  border-left: 3px solid var(--indigo-500);
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
- Use indigo to indicate selected rows

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
- Indicate with indigo asterisk (*)
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
- Indicate current step with indigo
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

- Submit (indigo) always on right
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
- Active item with indigo underline

```css
.nav-link.active {
  border-bottom: 2px solid var(--indigo-500);
  color: var(--indigo-500);
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
  background: var(--indigo-50);
  border-left: 3px solid var(--indigo-500);
  color: var(--indigo-700);
}
```

#### Breadcrumbs

```
Home / Products / Electronics / Laptops
```

- Maximum 4-5 levels
- Last item not a link
- Consistent separator (/ or >)
- Indigo for current page

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
- Active: Indigo bottom border, indigo text
- Hover: Subtle indigo background (#EEF2FF)
- Disabled: Grayed out

```css
.tab.active {
  border-bottom: 2px solid var(--indigo-500);
  color: var(--indigo-500);
}

.tab:hover:not(.active) {
  background: var(--indigo-50);
}
```

### Feedback and States

#### Loading States

**Skeleton Screens**
- Animated placeholders
- Same dimensions as final content
- Doesn't block navigation
- Subtle indigo shimmer

**Spinners**
- Inline: Small, in buttons (indigo)
- Full page: Center of viewport
- With text: "Loading data..."

**Progress Bars**
- Determinate: Known progress (indigo fill)
- Indeterminate: Unknown duration
- With percentage: "45% complete"

```css
.progress-bar {
  background: var(--indigo-100);
}

.progress-fill {
  background: linear-gradient(90deg, var(--indigo-500), var(--violet-600));
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

**Indigo Touch:**
Icon can use indigo tint for brand consistency

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
- **Line Chart**: Trends over time (indigo line)
- **Bar Chart**: Category comparisons (indigo bars)
- **Pie Chart**: Proportions (use sparingly, indigo palette)
- **Area Chart**: Volume over time (indigo gradient)

**Colors**
- Use consistent indigo-based palette
- Sufficient contrast between series
- Consider color blindness
- Clear legends

**Indigo Palette for Charts:**
```
Primary:   indigo-500
Secondary: violet-500
Tertiary:  indigo-400
Accent:    indigo-700
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

**Indigo Accents:**
- Positive changes in indigo
- Trend lines in indigo
- Sparklines with indigo gradient

#### Filters

**Types**
- **Search**: Free text
- **Dropdown**: Defined categories
- **Date Range**: Periods
- **Multi-select**: Multiple options (indigo checkmarks)

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
- Active filters highlighted in indigo

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

**Indigo Accessibility:**
Our indigo-500 (#6366F1) meets AA standards:
- On white: 8.3:1 ✅
- On indigo-50 (#EEF2FF): 11.2:1 ✅
- On neutral-900: 2.4:1 ❌ (use indigo-400 instead)

#### Testing Contrast

Recommended tools:
- WebAIM Contrast Checker
- Stark plugin (Figma)
- Chrome DevTools Accessibility

#### Don't Rely on Color Alone

Never use only color to communicate:

❌ **Bad**
```
"Indigo items are premium"
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
- Visible and clear focus (indigo ring)

**Indigo Focus Ring:**
```css
:focus-visible {
  outline: 2px solid var(--indigo-500);
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
  outline: 2px solid var(--indigo-500);
  outline-offset: 2px;
}

/* Mouse only (optional) */
:focus:not(:focus-visible) {
  outline: none;
}

:focus-visible {
  outline: 2px solid var(--indigo-500);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
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
  --text-primary: #0f172a;
  --indigo-glow: rgba(99, 102, 241, 0.1);
}

.dark {
  --bg-primary: #020617;
  --text-primary: #f8fafc;
  --indigo-glow: rgba(99, 102, 241, 0.2);
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
- Indigo pops more in dark mode

**Images**
- Use transparent PNGs when possible
- Consider mode-specific versions
- Reduce opacity if needed

**Shadows**
- More subtle in dark mode
- Smaller blur radius
- Higher opacity
- Indigo shadows more visible

### UX Writing

#### Voice and Tone

**Principles**
- **Clear**: No jargon, straight to the point
- **Concise**: Respect user's time
- **Helpful**: Provide value, not fluff
- **Professional**: Trustworthy but approachable

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
  --color-indigo-500: #6366F1;
  --color-indigo-600: #4F46E5;
  --color-indigo-700: #4338CA;
  --spacing-4: 1rem;
  --font-sans: 'Inter', sans-serif;
  --shadow-indigo-sm: 0 1px 3px 0 rgba(99, 102, 241, 0.2);
}
```

**JavaScript/TypeScript**
```typescript
// tokens.ts
export const colors = {
  indigo: {
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA'
  }
}

export const spacing = {
  4: '1rem'
}

export const shadows = {
  indigo: {
    sm: '0 1px 3px 0 rgba(99, 102, 241, 0.2)'
  }
}
```

**JSON**
```json
{
  "color": {
    "indigo": {
      "500": { "value": "#6366F1" },
      "600": { "value": "#4F46E5" },
      "700": { "value": "#4338CA" }
    }
  },
  "shadow": {
    "indigo": {
      "sm": { "value": "0 1px 3px 0 rgba(99, 102, 241, 0.2)" }
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
        indigo: { 
          50: '#EEF2FF',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          // ... other shades
        }
      },
      boxShadow: {
        'indigo-sm': '0 1px 3px 0 rgba(99, 102, 241, 0.2)',
        'indigo-md': '0 4px 6px -1px rgba(99, 102, 241, 0.2)',
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
- Indigo variant showcases

### Figma Library

#### Organization

```
📁 Design System
  📁 Foundations
    🎨 Colors (with indigo palette)
    📏 Spacing
    🔤 Typography
    ✨ Effects (indigo shadows & glows)
  📁 Components
    🔘 Buttons (indigo primary)
    📝 Inputs (indigo focus)
    🗃️ Cards (indigo accents)
    ...
  📁 Patterns
    📋 Forms
    🧭 Navigation
    ...
```

#### Variants

Components use Figma Variants for states:
- Variant 1: Type (primary/indigo, secondary, tertiary)
- Variant 2: Size (sm, md, lg)
- Variant 3: State (default, hover, active, disabled)

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
 * Primary button component with indigo accent
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
## [2.0.0] - 2026-01-31

### Changed
- **BREAKING**: Migrated from terracotta to indigo color system
- Updated all primary buttons to indigo (#6366F1)
- Enhanced focus states with indigo rings
- Card hover states now use indigo accents
- Improved indigo contrast for accessibility

### Added
- Indigo color palette (50-950 scale)
- Violet and purple accent colors
- Slate neutral system
- Indigo shadow variants for enhanced elevation
- Indigo glow effects for interactive elements

### Updated
- All component tokens to use indigo values
- Interactive states: hover (#4F46E5), active (#4338CA)
- Focus rings and subtle backgrounds (#EEF2FF)
- Documentation with new color psychology section
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

**Semantic Token**: Token with contextual meaning (ex: text-primary vs slate-900)

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

Our indigo accent isn't just a color choice—it's rooted in professional trust and modern design. The sophisticated blue-purple tones convey reliability, expertise, and contemporary technology. It represents the trustworthiness of a robust platform, the confidence of data-driven decisions, and the professionalism that restaurant businesses demand. Use it thoughtfully, and it will serve as a memorable touchpoint that restaurant owners recognize and trust.

**Version**: 2.0.0  
**Last updated**: January 31, 2026  
**Next review**: April 2026

---

*"Design is not just what it looks like and feels like. Design is how it works."*  
— Steve Jobs

*"The details are not the details. They make the design."*  
— Charles Eames

*"Good design is good business."*  
— Thomas Watson Jr.