# MemoryLane

> **Capture Your Journey, Create Your Story**

MemoryLane is a browser-based drag-and-drop travel journal editor. Arrange photos, map tiles, text, and stickers on a freeform canvas, then export the finished page as a high-resolution PNG or print-ready PDF.

---

## Features

| Feature | Details |
|---|---|
| **Photo elements** | Add images by URL or from the photo library; drag, resize, rotate, and flip |
| **Rich text boxes** | Editable text with font family, size, colour, bold/italic; double-click to type |
| **Live map tiles** | Type any location name — the app geocodes it via Nominatim and embeds an OpenStreetMap static tile directly on the canvas |
| **Travel stickers** | Five SVG stickers (passport stamp, compass rose, luggage tag, location pin, vintage stamp) placed as resizable, rotatable canvas objects |
| **Properties panel** | Live position, size, rotation, opacity, and type-specific controls for the selected object |
| **Undo / Redo** | 50-step Fabric.js JSON snapshot stack; `Ctrl+Z` / `Ctrl+Shift+Z` or toolbar buttons |
| **Grid overlay** | 16 px snap grid, toggleable via the Grid button |
| **Export PNG** | Hides the grid and renders the canvas at 2× resolution |
| **Export PDF** | Outputs an A4 landscape PDF ready for print |
| **Auto-save** | Every canvas change is persisted to MongoDB via the Next.js API |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Canvas (primary) | Fabric.js 7 |
| Canvas (secondary) | Konva.js + react-konva |
| Styling | Tailwind CSS v4 + custom CSS design tokens |
| UI Components | Headless shadcn-style components |
| Database | MongoDB via Mongoose |
| PDF export | jsPDF 4 |
| Map tiles | OpenStreetMap static tiles (Nominatim geocoding, no API key required) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A running MongoDB instance (local or Atlas)

### Setup

```bash
cp .env.example .env.local
# Edit .env.local and set MONGODB_URI
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
memorylane/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── journals/          # CRUD routes (GET, POST, PUT, DELETE)
│   │   │   └── map/               # Geocode + proxy OSM static tile images
│   │   ├── globals.css            # Brand design tokens (CSS variables)
│   │   ├── layout.tsx
│   │   └── page.tsx               # Main editor page
│   ├── components/
│   │   ├── canvas/
│   │   │   ├── JournalCanvas.tsx      # Fabric.js canvas (primary)
│   │   │   ├── KonvaJournalCanvas.tsx # Konva.js canvas (secondary)
│   │   │   └── PropertiesPanel.tsx    # Object properties sidebar
│   │   └── ui/                        # Button, Card, Badge, Input, Slider, Tabs
│   ├── hooks/
│   │   └── useCanvasHistory.ts        # Undo/redo state machine
│   └── lib/
│       ├── canvas/types.ts            # Shared data model
│       ├── db.ts                      # Mongoose connection
│       ├── models/Journal.ts          # Journal Mongoose model
│       ├── stickers.ts                # SVG sticker catalogue
│       └── utils.ts
└── public/
```

---

## Canvas Data Model

All canvas state serialises as `CanvasData`:

```ts
interface CanvasData {
  version: string;
  size: { width: number; height: number };
  objects: (ImageObject | TextObject | MapObject | StickerObject)[];
  background?: string;
}
```

Every object carries shared transform fields (`x`, `y`, `width`, `height`, `rotation`, `scaleX`, `scaleY`, `opacity`) plus type-specific properties.

---

## Map Integration

The `/api/map?location=Paris` route:
1. Geocodes the location name using the [Nominatim API](https://nominatim.openstreetmap.org/) (free, no key required).
2. Proxies the resulting [OpenStreetMap static map](https://staticmap.openstreetmap.de/) image back to the browser to avoid CORS restrictions.

---

## Similar Work — Legacy Modernisation Reference

This project mirrors the surgical modernisation pattern used on legacy business tools:

- **API integration** — external data (map tiles) pulled into the existing product via a thin proxy layer, preserving the core engine while adding connectivity.
- **UI/UX facelift** — the underlying canvas logic is unchanged; only the shell (layout, sidebar, toolbar) was reskinned to a modern SaaS aesthetic.
- **Export pipeline** — a PDF/PNG generation layer bolted onto the existing data model using jsPDF, without touching the rendering logic.
- **Bug fixes** — broken JSX layout, unrendered text objects, and disconnected buttons were resolved without restructuring the codebase.
- **Targeted additions** — map embed and sticker library added as thin, isolated modules that call into the existing canvas API.

---

## License

MIT
