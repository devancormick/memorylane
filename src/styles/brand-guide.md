# MemoryLane Brand Guide

## Brand Overview

MemoryLane is a travel journal canvas editor that helps users create beautiful, shareable keepsakes from their adventures. The brand is warm, inviting, and inspiring — evoking the excitement of exploration and the nostalgia of cherished memories.

**Brand Tagline**: _Capture Your Journey, Create Your Story_

## Design Principles

### 1. Warmth & Welcome
- Soft, approachable colors
- Generous whitespace
- Friendly, rounded corners

### 2. Clarity & Confidence
- Clear visual hierarchy
- High contrast for important actions
- Intuitive iconography

### 3. Inspiration & Discovery
- Sunset gradients for excitement
- Travel-inspired imagery
- Sense of possibility in empty states

## Color Palette

### Primary Colors (Ocean Blue)
Represents trust, reliability, and vast horizons:

| Token | Hex | Usage |
|-------|-----|-------|
| Primary-500 | `#2563EB` | Primary buttons, links, active states |
| Primary-600 | `#1D4ED8` | Hover states |
| Primary-100 | `#DBEAFE` | Light backgrounds, highlights |
| Primary-50 | `#EFF6FF` | Subtle backgrounds |

### Accent Colors (Sunset Orange)
Represents adventure, warmth, and memorable moments:

| Token | Hex | Usage |
|-------|-----|-------|
| Accent-500 | `#F97316` | Call-to-action buttons, highlights |
| Accent-600 | `#EA580C` | Hover states |
| Accent-100 | `#FFEDD5` | Warnings, subtle accent |

### Neutral Palette
Warm grays for a friendly, approachable feel:

| Token | Hex | Usage |
|-------|-----|-------|
| Neutral-900 | `#111827` | Headlines, primary text |
| Neutral-700 | `#374151` | Body text |
| Neutral-500 | `#6B7280` | Secondary text |
| Neutral-400 | `#9CA3AF` | Placeholder text |
| Neutral-100 | `#F3F4F6` | Separators, borders |
| Neutral-50 | `#F9FAFB` | Backgrounds |

### Semantic Colors
- **Success**: `#10B981` - Save confirmations, success states
- **Error**: `#EF4444` - Form errors, delete actions
- **Warning**: `#F59E0B` - Unsaved changes, cautions

## Typography

### Font Families

#### Primary: Inter
A clean, modern sans-serif for UI and body copy.
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

#### Display: Merriweather
A serif font for headlines and decorative elements - evokes the feeling of travel journals and letters home.
```css
font-family: 'Merriweather', Georgia, Cambria, 'Times New Roman', serif;
```

### Font Scale

| Size | Weight | Usage |
|------|--------|-------|
| 5xl (3rem) | 700 | Page titles, hero sections |
| 4xl (2.25rem) | 700 | Section headers |
| 3xl (1.875rem) | 700 | Card titles |
| 2xl (1.5rem) | 600 | Subsection headers |
| xl (1.25rem) | 500 | Small headings |
| lg (1.125rem) | 400 | Lead paragraphs |
| base (1rem) | 400 | Body text |
| sm (0.875rem) | 400 | UI labels, captions |
| xs (0.75rem) | 500 | Badges, metadata |

### Line Heights

- **Tight** (1.25): Headlines
- **Normal** (1.5): Body text
- **Relaxed** (1.625): Long-form reading

## Spacing System

Based on a 4px grid system:

```
space-1:  0.25rem  (4px)
space-2:  0.5rem   (8px)
space-3:  0.75rem  (12px)
space-4:  1rem     (16px)
space-5:  1.25rem  (20px)
space-6:  1.5rem   (24px)
space-8:  2rem     (32px)
space-10: 2.5rem   (40px)
space-12: 3rem     (48px)
space-16: 4rem     (64px)
```

### Usage Guidelines

- Padding within cards: `var(--space-4)` or `var(--space-6)`
- Gap between related items: `var(--space-4)`
- Gap between unrelated sections: `var(--space-8)` to `var(--space-12)`
- Sidebar gutters: `var(--space-6)`
- Container margins: `var(--space-4)` to `var(--space-6)`

## Corner Radius

| Token | Value | Usage |
|-------|-------|-------|
| --border-radius-sm | 0.25rem (4px) | Small buttons, inputs |
| --border-radius-md | 0.375rem (6px) | Buttons, cards |
| --border-radius-lg | 0.5rem (8px) | Large cards, modals |
| --border-radius-xl | 0.75rem (12px) | Feature panels |
| --border-radius-full | 9999px | Pill buttons, avatars |

## Shadows

Subtle, natural shadows that add depth without distraction:

```css
/* Minimal depth */
--shadow-sm:  0 1px 2px 0 rgb(0 0 0 / 0.05);

/* Card elevation */
--shadow-md:  0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);

/* Hover elevation */
--shadow-lg:  0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

/* Modal/popover elevation */
--shadow-xl:  0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
```

## Iconography

### Style
- Simple, outlined icons (24x24 default)
- 2px stroke width
- Rounded corners (4px)

### Icon Library
- **Heroicons** or **Lucide React** for UI icons
- Custom SVG stickers for travel elements (passport stamps, compass, map pins)

## Component Styles

### Buttons

#### Primary
```css
.btn-primary {
  background-color: var(--color-primary-500);
  color: white;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--border-radius-md);
  font-weight: 500;
}
.btn-primary:hover {
  background-color: var(--color-primary-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
```

#### Accent (CTAs)
```css
.btn-accent {
  background: linear-gradient(135deg, var(--color-accent-500), var(--color-accent-600));
  color: white;
  /* same sizing as primary */
}
```

#### Secondary
```css
.btn-secondary {
  background: var(--color-background-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}
```

#### Ghost
```css
.btn-ghost {
  background: transparent;
  color: var(--color-text-secondary);
}
.btn-ghost:hover {
  background: var(--color-background-secondary);
  color: var(--color-text-primary);
}
```

### Inputs

```css
input, textarea, select {
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: var(--space-2) var(--space-3);
  background: var(--color-background);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}
input:focus {
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px var(--color-primary-200);
}
```

### Cards

```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border-secondary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  transition: box-shadow var(--transition-normal), transform var(--transition-normal);
}
.card:hover {
  box-shadow: var(--shadow-lg);
}
```

## Canvas Theming

### Canvas Container
- Light gray border: `#e5e7eb`
- White background
- Subtle drop shadow for depth

### Selection Highlight
- Primary blue outline: `var(--color-primary-500)`
- 2px stroke width
- Semi-transparent fill for movable objects

### Grid Overlay
- Color: Neutral-200 (`#e5e7eb`)
- Opacity: 0.5
- 16px grid size (configurable)
- Non-selectable, non-interactive

### Transform Handles
- Primary blue fill
- White border for contrast
- Circular handles, 10px diameter

## Empty States & Illustrations

### Illustrations
Use **unDraw** or custom SVG illustrations with:
- Warm color palette matching primary/accent colors
- Simple shapes, friendly characters
- Rounded corners throughout

### Welcome Screen
When a user opens the editor with no content:
1. Large friendly headline in Merriweather: "Start Your Journey"
2. Subtext: "Drag photos in from the sidebar or paste an image URL to begin crafting your travel journal."
3. CTA: "Upload First Photo" button (Primary)
4. Subtle background pattern showing faded map outlines or travel icons

## Animation & Transitions

### Timing
- **Fast**: 150ms - Button hover, input focus
- **Normal**: 250ms - Panel transitions, modal open
- **Slow**: 350ms - Page transitions, hero animations

### Easing
Use `cubic-bezier(0.4, 0, 0.2, 1)` (Tailwind's `ease-out`)

### Micro-interactions
- Button hover: `transform: translateY(-2px) scale(1.02)`
- Card lift: `box-shadow` increase on hover
- Drag feedback: Opacity change to 0.8 while dragging
- Selection: Border pulse animation (2px primary blue border)

## Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| sm | 640px | Mobile landscape |
| md | 768px | Tablet portrait |
| lg | 1024px | Tablet landscape / Small desktop |
| xl | 1280px | Desktop |
| 2xl | 1536px | Large desktop |

### Canvas Scaling
- Base canvas size: 800x600 (maintains 4:3 ratio)
- Scales down on mobile to fit viewport
- Maintains aspect ratio with `max-width: 100%`

## Accessibility

### Color Contrast
- Text on white: Minimum 4.5:1
- Large text (18pt+): Minimum 3:1
- Interactive elements: Distinct visual focus state (`--color-primary-500` ring)

### Focus States
```css
*:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}
```

### Keyboard Navigation
All canvas operations should be keyboard accessible:
- Arrow keys to nudge selected objects (1px)
- Shift+Arrow for 10px nudge
- Delete/Backspace to remove
- Ctrl+Z/Ctrl+Y for undo/redo
- Ctrl+D to duplicate

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Imagery

### Photo Placeholder Style
- Show blurred preview before full load
- Light gray background (`var(--color-neutral-100)`)
- Subtle border: `1px solid var(--color-border-secondary)`
- Load spinner overlay while loading

### Upload Area
- Dashed border: `2px dashed var(--color-primary-300)`
- Background: `var(--color-primary-50)`
- Hover: Border changes to `var(--color-primary-500)`, background to `var(--color-primary-100)`

## Example UI Compositions

### Sample Travel Journal
Create a sample journal on first load:
1. **Cover Photo**: Full-bleed travel photo with title overlay using Merriweather font
2. **Day 1 Text Block**: "Arrived in Paris..." with elegant serif typography
3. **Map Pin**: Location marker showing Eiffel Tower coordinates
4. **Photo Collage**: 3 photos with drop shadows, slightly overlapping
5. **Sticker Collection**: Passport stamp, compass rose, airplane sticker
6. **Ending Note**: Reflective text in italic serif

### Dashboard Example
Sidebar with sections:
- _My Journals_ (list with thumbnails)
- _Recent Trips_ (tags)
- _Templates_ (pre-made layouts)
- _Export Options_ (PNG/PDF/HTML buttons)

## Content Guidelines

### Voice & Tone
- **Friendly**: "Let's get started!" not "Begin initialization"
- **Encouraging**: "You're doing great!" after first element placed
- **Clear**: Simple, action-oriented button labels
- **Travel-Inspired**: Subtle wanderlust in placeholder text ("Where to next?")

### Microcopy Examples
- Button upload: "Add a Photo"
- Empty state: "Drop your first photo here or paste an image URL"
- Loading: "Fetching your memories..."
- Undo: "Undo" with icon, maybe "Undo last change" as tooltip
- Export: "Download Your Journal" not "Export"

## Integration with shadcn/ui

If using shadcn/ui components, override their CSS variables:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 217 91% 60%;
    --primary-foreground: 210 40% 98%;
    --radius: 0.375rem;
  }
}
```

Then use shadcn's built-in components for:
- Buttons
- Inputs
- Cards
- Dropdowns
- Modals
- Tabs
- Sliders (for opacity, hue tint)

Custom canvas editor components:
- JournalCanvas (main canvas area)
- Transform controls
- Properties panel
- Layer panel

## Dark Mode Considerations

While the primary brand is light (like a fresh page in a journal), consider a dark mode variant:

- Background: `#0F172A` (deep navy - still warm)
- Surface: `#1E293B`
- Text: `#F1F5F9`
- Accent: Keep same blue/orange for brand consistency
- Reduce opacity of shadows in dark mode

## Version History

**v1.0 (Current)**
- Initial brand guide
- Ocean blue + sunset orange palette
- Inter + Merriweather typography
- Warm, friendly aesthetic

---

_Brand MemoryLane © 2026. All rights reserved._