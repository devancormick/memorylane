# MemoryLane

> **Capture Your Journey, Create Your Story**

MemoryLane is a drag-and-drop travel journal editor that lets you arrange photos, maps, text, and stickers on a freeform canvas — then export the result as a PNG, PDF, or shareable HTML page.

## Features

- **Dual canvas engines** — switch between Fabric.js and Konva.js renderers
- **Photo support** — add images by URL, drag to reposition, resize from corners
- **Text elements** — rich text with font family, size, color, bold/italic, and alignment controls
- **Map tiles** — embed location snapshots (rectangle, circle, or postcard clip shape)
- **Stickers** — SVG stickers with hue-tint adjustment
- **Properties panel** — live editing of position, size, rotation, and opacity for selected objects
- **Undo / Redo** — full 50-step history via `Ctrl+Z` / `Ctrl+Shift+Z`
- **Grid overlay** — 16 px snap grid, toggleable
- **Export** — PNG, PDF, and share-as-HTML

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router, TypeScript) |
| Canvas (primary) | Fabric.js |
| Canvas (secondary) | Konva.js + react-konva |
| Styling | Tailwind CSS + custom CSS variables |
| UI Components | Headless shadcn-style components |
| Backend | Express 5 + Mongoose (MongoDB) |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Frontend

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Backend

```bash
cd backend
npm install
npm run dev   # starts nodemon on server.js
```

## Project Structure

```
memorylane/
├── src/
│   ├── app/               # Next.js App Router pages and layout
│   ├── components/
│   │   ├── canvas/        # JournalCanvas (Fabric), KonvaJournalCanvas, PropertiesPanel
│   │   └── ui/            # Button, Card, Badge, Input, Slider, Tabs
│   ├── hooks/
│   │   └── useCanvasHistory.ts   # Undo/redo state machine
│   ├── lib/
│   │   ├── canvas/types.ts       # Shared canvas data model
│   │   ├── export/               # PNG / PDF / HTML export helpers
│   │   ├── maps/                 # Map tile utilities
│   │   └── stickers/             # Sticker catalogue
│   └── styles/
│       └── globals.css           # Brand design tokens
└── backend/               # Express + MongoDB API
```

## Canvas Data Model

All canvas state is serialised as `CanvasData`:

```ts
interface CanvasData {
  version: string;
  size: { width: number; height: number };
  objects: (ImageObject | TextObject | MapObject | StickerObject)[];
  background?: string;
}
```

Each object carries common transform fields (`x`, `y`, `width`, `height`, `rotation`, `scaleX`, `scaleY`, `opacity`) plus type-specific properties.

## License

MIT
