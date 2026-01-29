# Design System

This document defines the **Design System specification** used across the product.
It is optimized for **SaaS applications**, **Antigravity AI usage**, and **React-based frontends**.

The system follows a **Salesforce + Stripe hybrid approach**:
- **Salesforce** → governance, robustness, explicit states, enterprise UX
- **Stripe** → clarity, spacing, typography, visual calm

---

## 1. Core Principles (Non-Negotiable)

All UI generated or implemented using this Design System **MUST** follow these rules:

1. Mobile-first by default  
2. No hardcoded visual values  
3. Explicit UI states: `loading`, `empty`, `error`, `disabled`  
4. Visual hierarchy prioritizes **spacing > typography > color**  
5. Brand color is reserved for **primary actions and focus**  
6. Skeleton loaders are preferred over spinners  
7. Components must consume **semantic tokens only**  
8. Touch targets must be **≥ 44px** on mobile  

---

## 2. Token Architecture

The Design System uses **two layers of tokens**:

### 2.1 Base Tokens (Primitives)
- Raw colors, spacing, typography scales  
- Never used directly by components  

### 2.2 Semantic Tokens (Aliases)
- Map intent and meaning to base tokens  
- **The only tokens allowed inside components**  
- Enable theming, dark mode, and white-labeling  

> **Rule:** Components must never reference base tokens directly.

---

## 3. Base Tokens (Primitives)

### 3.1 Colors

```json
{
  "base": {
    "color": {
      "blue": {
        "50": "#eef4ff",
        "100": "#dbe8ff",
        "200": "#b7d1ff",
        "300": "#8bb3ff",
        "400": "#5c8cff",
        "500": "#3366ff",
        "600": "#254eda",
        "700": "#1e3fae"
      },
      "gray": {
        "0": "#ffffff",
        "50": "#f8fafc",
        "100": "#f1f5f9",
        "200": "#e2e8f0",
        "300": "#cbd5e1",
        "400": "#94a3b8",
        "500": "#64748b",
        "600": "#475569",
        "700": "#334155",
        "800": "#1e293b",
        "900": "#0f172a"
      },
      "green": { "500": "#16a34a" },
      "amber": { "500": "#f59e0b" },
      "red": { "500": "#dc2626" },
      "cyan": { "500": "#0284c7" }
    }
  }
}
```

### 3.2 Typography

```json
{
  "base": {
    "typography": {
      "fontFamily": "Inter, system-ui, -apple-system, sans-serif",
      "size": {
        "xs": 12,
        "sm": 14,
        "md": 16,
        "lg": 18,
        "xl": 20,
        "2xl": 24,
        "3xl": 32
      },
      "weight": {
        "regular": 400,
        "medium": 500,
        "semibold": 600
      },
      "lineHeight": {
        "tight": 1.2,
        "normal": 1.5,
        "loose": 1.7
      }
    }
  }
}
```

### 3.3 Spacing, Radius, Shadow

```json
{
  "base": {
    "space": {
      "0": 0,
      "1": 4,
      "2": 8,
      "3": 12,
      "4": 16,
      "5": 20,
      "6": 24,
      "8": 32,
      "10": 40,
      "12": 48
    },
    "radius": {
      "sm": 6,
      "md": 8,
      "lg": 12,
      "xl": 16,
      "full": 999
    },
    "shadow": {
      "sm": "0 1px 2px rgba(0,0,0,0.06)",
      "md": "0 4px 8px rgba(0,0,0,0.08)",
      "lg": "0 12px 24px rgba(0,0,0,0.12)"
    }
  }
}
```

---

## 4. Semantic Tokens (Light Theme)

> **Components MUST use semantic tokens only.**  
> Base tokens are for mapping and theme creation.

### 4.1 Colors (Semantic)

```json
{
  "semantic": {
    "color": {
      "bg": {
        "canvas": "{base.color.gray.0}",
        "surface": "{base.color.gray.0}",
        "subtle": "{base.color.gray.50}",
        "sunken": "{base.color.gray.100}"
      },
      "text": {
        "primary": "{base.color.gray.900}",
        "secondary": "{base.color.gray.600}",
        "muted": "{base.color.gray.500}",
        "inverse": "{base.color.gray.0}",
        "danger": "{base.color.red.500}"
      },
      "border": {
        "default": "{base.color.gray.200}",
        "muted": "{base.color.gray.100}",
        "strong": "{base.color.gray.300}",
        "focus": "{base.color.blue.500}",
        "danger": "{base.color.red.500}"
      },
      "action": {
        "primary": {
          "bg": "{base.color.blue.500}",
          "bgHover": "{base.color.blue.600}",
          "bgActive": "{base.color.blue.700}",
          "fg": "{base.color.gray.0}"
        },
        "secondary": {
          "bg": "{base.color.gray.0}",
          "bgHover": "{base.color.gray.50}",
          "bgActive": "{base.color.gray.100}",
          "fg": "{base.color.gray.900}",
          "border": "{base.color.gray.200}"
        },
        "ghost": {
          "bg": "transparent",
          "bgHover": "{base.color.gray.50}",
          "fg": "{base.color.gray.900}"
        },
        "danger": {
          "bg": "{base.color.red.500}",
          "bgHover": "{base.color.red.500}",
          "fg": "{base.color.gray.0}"
        },
        "link": {
          "fg": "{base.color.blue.600}",
          "fgHover": "{base.color.blue.700}"
        }
      },
      "status": {
        "success": { "bg": "{base.color.green.500}", "fg": "{base.color.gray.0}" },
        "warning": { "bg": "{base.color.amber.500}", "fg": "{base.color.gray.900}" },
        "danger": { "bg": "{base.color.red.500}", "fg": "{base.color.gray.0}" },
        "info": { "bg": "{base.color.cyan.500}", "fg": "{base.color.gray.0}" }
      }
    }
  }
}
```

### 4.2 Typography, Space, Shape (Semantic)

```json
{
  "semantic": {
    "typography": {
      "body": {
        "size": "{base.typography.size.md}",
        "weight": "{base.typography.weight.regular}",
        "lineHeight": "{base.typography.lineHeight.normal}"
      },
      "label": {
        "size": "{base.typography.size.sm}",
        "weight": "{base.typography.weight.medium}",
        "lineHeight": "{base.typography.lineHeight.normal}"
      },
      "caption": {
        "size": "{base.typography.size.sm}",
        "weight": "{base.typography.weight.regular}",
        "lineHeight": "{base.typography.lineHeight.normal}"
      },
      "heading": {
        "h1": { "size": "{base.typography.size.3xl}", "weight": "{base.typography.weight.semibold}", "lineHeight": "{base.typography.lineHeight.tight}" },
        "h2": { "size": "{base.typography.size.2xl}", "weight": "{base.typography.weight.semibold}", "lineHeight": "{base.typography.lineHeight.tight}" },
        "h3": { "size": "{base.typography.size.xl}",  "weight": "{base.typography.weight.semibold}", "lineHeight": "{base.typography.lineHeight.tight}" }
      }
    },
    "space": {
      "xs": "{base.space.2}",
      "sm": "{base.space.3}",
      "md": "{base.space.4}",
      "lg": "{base.space.6}",
      "xl": "{base.space.8}"
    },
    "shape": {
      "radius": {
        "control": "{base.radius.md}",
        "card": "{base.radius.md}",
        "modal": "{base.radius.lg}",
        "pill": "{base.radius.full}"
      },
      "shadow": {
        "control": "{base.shadow.sm}",
        "card": "{base.shadow.md}",
        "modal": "{base.shadow.lg}"
      }
    }
  }
}
```

---

## 5. Layout System

### 5.1 Container
- `maxWidth`: 1200px  
- Center aligned on desktop, full-bleed on mobile  

### 5.2 Grid (8pt system)
- Spacing aligns to the token scale (multiples of 4)  
- Use **12 columns** on desktop, **4 columns** on mobile  

### 5.3 Breakpoints (recommended)
- `sm`: 640  
- `md`: 768  
- `lg`: 1024  
- `xl`: 1280  

> Breakpoints may be implemented as CSS variables or framework config; do not hardcode in components.

---

## 6. Components (Specs)

### 6.1 Button

**Variants**: `primary | secondary | ghost | danger | link`  
**Sizes**: `sm | md | lg`  
**States**: `default | hover | active | loading | disabled`  

**Token usage**
- `primary`: `semantic.color.action.primary.*`
- `secondary`: `semantic.color.action.secondary.*`
- `ghost`: `semantic.color.action.ghost.*`
- `danger`: `semantic.color.action.danger.*`
- `link`: `semantic.color.action.link.*`

**Sizing rules**
- `sm`: height 32px, paddingX `semantic.space.sm`
- `md`: height 40px, paddingX `semantic.space.md`
- `lg`: height 48px, paddingX `semantic.space.lg`
- Touch target must be ≥ 44px on mobile (add vertical padding if needed)

**Behavior rules**
- `loading` preserves width (replace label with spinner, keep padding)
- `disabled` reduces emphasis without reducing legibility
- Only one **primary** action per surface (Card/Modal header/footer)

**Recommended React props**
- `variant`, `size`, `isLoading`, `disabled`, `leftIcon`, `rightIcon`

---

### 6.2 Input (TextField)

**Types**: `text | number | password | search`  
**States**: `default | focus | error | disabled`  

**Anatomy**
- Label (required)
- Input control
- Helper text (optional)
- Error message (optional)
- Prefix/Suffix icons (optional)

**Token usage**
- Background: `semantic.color.bg.surface`
- Border: `semantic.color.border.default`
- Focus ring/border: `semantic.color.border.focus`
- Text: `semantic.color.text.primary`
- Placeholder: `semantic.color.text.muted`
- Error: `semantic.color.border.danger` + `semantic.color.text.danger`
- Radius/Shadow: `semantic.shape.radius.control` / `semantic.shape.shadow.control`

**Sizing rules**
- Control height: 40px (default), 48px on mobile forms where needed
- Label uses `semantic.typography.label`
- Helper/error uses `semantic.typography.caption`

**Recommended React props**
- `label`, `value`, `onChange`, `placeholder`, `helperText`, `error`, `disabled`, `prefix`, `suffix`

---

### 6.3 Select

**Types**: `single | multi | async`  
**States**: `default | open | error | disabled | loading`  

**Rules**
- Same visual baseline as Input (height, radius, border)
- Searchable by default for long lists
- Async must show skeleton/list placeholder during load

**Recommended React props**
- `options`, `value`, `onChange`, `isMulti`, `isLoading`, `error`, `disabled`

---

### 6.4 Card

**Anatomy**
- Header (optional): title + actions
- Body (required): content
- Footer (optional): primary/secondary actions

**Token usage**
- Background: `semantic.color.bg.surface`
- Border: `semantic.color.border.default` (optional)
- Radius: `semantic.shape.radius.card`
- Shadow: `semantic.shape.shadow.card`
- Padding: `semantic.space.lg`

**Rules**
- Cards should group content, not decorate it
- Do not stack shadows; nested cards must be border-only
- One primary action max per Card footer

---

### 6.5 Tabs

**Variants**: `line | pill` (default: `line`)  
**States**: `default | hover | active | disabled`

**Token usage**
- Text: `semantic.color.text.secondary` (default), `semantic.color.text.primary` (active)
- Active indicator: `semantic.color.action.primary.bg` (line variant)
- Hover bg (pill variant): `semantic.color.bg.subtle`
- Focus ring: `semantic.color.border.focus`

**Rules**
- Tabs are navigation, not filters (use Segmented Control for filters)
- When content is heavy, keep tabs sticky under header

**Recommended React props**
- `items`, `activeKey`, `onChange`, `variant`

---

### 6.6 Grid (Layout Component)

**Purpose**
- Provide consistent layout behavior and spacing across screens

**API**
- `columns`: `{ base: 4, md: 12 }` (default)
- `gap`: uses `semantic.space.*`
- `align`, `justify`

**Rules**
- Use grid for page layout; use Stack for simple vertical spacing
- Avoid magic numbers; use semantic spacing tokens only

---

### 6.7 Stack (Layout Primitive)

**Purpose**
- Consistent vertical/horizontal spacing

**API**
- `direction`: `row | column`
- `gap`: `semantic.space.xs|sm|md|lg|xl`
- `align`, `justify`, `wrap`

---

### 6.8 Badge

**Variants**: `neutral | success | warning | danger | info`  
**Rules**
- Never clickable (status only)
- Keep text short (1–2 words)

**Token usage**
- `semantic.color.status.*`

---

### 6.9 Alert

**Variants**: `info | success | warning | error`  
**Anatomy**
- Icon, Title, Description (optional), Actions (optional)

**Rules**
- Must state the next step (what user can do now)
- Avoid technical language

---

### 6.10 Table

**Required features**
- Sticky header
- Sortable columns
- Row actions
- Loading state (skeleton)
- Empty state
- Error state

**Token usage**
- Header bg: `semantic.color.bg.subtle`
- Borders: `semantic.color.border.default`
- Hover: `semantic.color.bg.subtle`

**Rules**
- Default row height: 48px
- Prefer inline actions only when necessary; use kebab menu otherwise

---

### 6.11 Modal / Dialog

**Sizes**: `sm | md | lg | fullscreenMobile`

**Rules**
- Focus trap enabled
- ESC closes modal
- Primary action on the right
- On mobile: fullscreen with bottom actions

---

## 7. UX Patterns (Mandatory)

### 7.1 Loading
- Default: skeleton
- Spinner: only for single short actions (e.g., button click)

### 7.2 Empty State
Must include:
1. Icon (simple)
2. Title
3. Short description
4. Single primary CTA

### 7.3 Error State
- Human language
- Always provide recovery action
- Avoid raw error codes in UI (log them instead)

---

## 8. Antigravity Enforcement Rules

```json
{
  "rules": {
    "noBaseTokensInComponents": true,
    "semanticTokensOnly": true,
    "themeable": true,
    "mobileFirst": true,
    "explicitStates": true
  }
}
```

---

## 9. Expected Outcomes

Using this Design System ensures:

- Enterprise-grade consistency  
- Easy theming and brand customization  
- Clean, modern SaaS UI  
- Scalable React components  
- Predictable UX across desktop and mobile  

---

## 10. References (Conceptual)

- Salesforce Lightning Design System — governance, states, enterprise UX  
- Stripe UI — spacing, typography, clarity  

---

End of document.

---

# Design System – Layout & Spacing Addendum

This addendum extends the Design System with **layout, spacing, and structural components**
to ensure **consistent vertical rhythm, predictable spacing, and screen-level cohesion**
across all product surfaces.

This document is **mandatory** for all screen-level implementations.

---

## 1. Purpose of This Addendum

While base components (Buttons, Inputs, Cards, etc.) ensure visual consistency,
**layout inconsistency often comes from missing structural components**.

This addendum introduces:
- Screen-level layout primitives
- Semantic spacing for pages and sections
- Structural components that define rhythm and hierarchy

> **Goal:**  
> Make spacing and layout decisions a **design system concern**, not a per-screen choice.

---

## 2. Layout Semantic Tokens

These tokens define **intentional spacing**, not raw values.

### 2.1 Page-Level Spacing

```json
{
  "semantic": {
    "layout": {
      "page": {
        "paddingX": "{base.space.6}",
        "paddingXMobile": "{base.space.4}",
        "paddingY": "{base.space.6}",
        "maxWidth": "1200px"
      }
    }
  }
}
```

### 2.2 Section Spacing

```json
{
  "semantic": {
    "layout": {
      "section": {
        "gap": "{base.space.8}",
        "gapMobile": "{base.space.6}"
      }
    }
  }
}
```

### 2.3 Component Spacing

```json
{
  "semantic": {
    "layout": {
      "stack": {
        "xs": "{base.space.2}",
        "sm": "{base.space.3}",
        "md": "{base.space.4}",
        "lg": "{base.space.6}",
        "xl": "{base.space.8}"
      }
    }
  }
}
```

---

## 3. Structural Components

### 3.1 PageContainer

**Purpose:** Standardizes page-level padding and max-width.

**Props:**
- \`maxWidth?: 'sm' | 'md' | 'lg' | 'full'\` (default: \`'lg'\`)
- \`noPadding?: boolean\` (default: \`false\`)

**Usage:**
```tsx
<PageContainer maxWidth="lg">
  {/* page content */}
</PageContainer>
```

**Implementation:**
```tsx
export function PageContainer({ 
  children, 
  maxWidth = 'lg',
  noPadding = false 
}: PageContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    full: 'max-w-full'
  };

  return (
    <div className={clsx(
      'mx-auto',
      maxWidthClasses[maxWidth],
      !noPadding && 'px-layout-page-x-mobile md:px-layout-page-x py-layout-page-y'
    )}>
      {children}
    </div>
  );
}
```

---

### 3.2 Section

**Purpose:** Groups related content with consistent vertical spacing.

**Props:**
- \`spacing?: 'sm' | 'md' | 'lg'\` (default: \`'md'\`)
- \`title?: string\`
- \`description?: string\`

**Usage:**
```tsx
<Section title="Recent Activity" spacing="lg">
  {/* section content */}
</Section>
```

---

### 3.3 Stack (Already Implemented)

**Purpose:** Consistent vertical/horizontal spacing between items.

**Props:**
- \`direction?: 'row' | 'column'\`
- \`gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'\`
- \`align?: 'start' | 'center' | 'end' | 'stretch'\`
- \`justify?: 'start' | 'center' | 'end' | 'between' | 'around'\`

---

## 4. Layout Patterns

### 4.1 Page Header

All pages should follow this structure:

```tsx
<PageContainer>
  <Stack direction="column" gap="lg">
    {/* Header */}
    <Stack direction="column" gap="sm">
      <h1 className="text-display-lg font-semibold text-text-primary">
        Page Title
      </h1>
      <p className="text-body-md text-text-secondary">
        Page description
      </p>
    </Stack>

    {/* Content sections */}
    <Section spacing="lg">
      {/* ... */}
    </Section>
  </Stack>
</PageContainer>
```

---

### 4.2 Two-Column Layout

```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-layout-section">
  <div>{/* Left column */}</div>
  <div>{/* Right column */}</div>
</div>
```

---

### 4.3 Card Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-layout-stack-md">
  {items.map(item => <Card key={item.id}>{/* ... */}</Card>)}
</div>
```

---

## 5. Responsive Breakpoints

Use these breakpoints consistently:

```css
/* Tailwind defaults (already configured) */
sm: 640px   /* Mobile landscape / small tablet */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

**Mobile-first rule:**  
Always write mobile styles first, then add \`md:\` and \`lg:\` prefixes for larger screens.

---

## 6. Vertical Rhythm

Maintain consistent vertical rhythm across all screens:

- **Between sections:** \`gap-layout-section\` (32px desktop, 24px mobile)
- **Between components:** \`gap-layout-stack-md\` (16px)
- **Between related items:** \`gap-layout-stack-sm\` (12px)
- **Between form fields:** \`gap-layout-stack-md\` (16px)

---

## 7. Implementation Checklist

When implementing a new screen, verify:

- [ ] Uses \`PageContainer\` for top-level layout
- [ ] Uses \`Stack\` for consistent spacing
- [ ] Uses \`Section\` for logical groupings
- [ ] Uses semantic spacing tokens (no hardcoded values)
- [ ] Responsive at all breakpoints (sm, md, lg)
- [ ] Touch targets ≥ 44px on mobile
- [ ] No horizontal scroll on mobile

---

