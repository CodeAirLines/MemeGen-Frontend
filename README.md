# MemeForge — Imgflip-Inspired Meme Creation Platform

A high-performance, creator-focused meme creation platform engineered with modern web standards, featuring instant preview, classic meme archives, flexible caption layouts, and clean responsive design.

---

## 1. Tech Stack & Environment

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Framework** | [React](https://react.dev/) | `^19.3.1` | Component-driven UI architecture |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | `~6.0.3` | End-to-end type safety & contract interfaces |
| **Build Tool** | [Vite](https://vite.dev/) | `^8.3.4` | Ultra-fast HMR and optimized production bundling |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) + `@tailwindcss/vite` | `^4.3.3` | Modern utility styling with zero runtime overhead |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) | `^5.0.15` | Minimal, type-safe client-side state |
| **Iconography** | [Lucide React](https://lucide.dev/) | `^1.61.0` | Accessible, cohesive SVG icons |
| **Node.js Environment** | Node.js / npm | `v24.18.0` / `11.16.0` | Execution runtime |

---

## 2. Project Architecture & Directory Structure

```text
MemeGen-Frontend/
├── public/                     # Static assets (favicons, SVG icons)
├── src/
│   ├── assets/                 # Local frontend assets
│   ├── components/
│   │   ├── layout/             # Layout primitives (Header, Footer)
│   │   │   ├── Header.tsx      # Sticky brand navigation + mobile drawer + store state
│   │   │   └── Footer.tsx      # Comprehensive platform footer & architecture credits
│   │   └── ui/                 # Reusable, accessible UI components
│   │       ├── Badge.tsx       # Pill badges with color variants & sizes
│   │       ├── Button.tsx      # Button with variants (primary, secondary, outline, ghost)
│   │       ├── Card.tsx        # Glassmorphic card container with hover effect
│   │       ├── Input.tsx       # Accessible input with icon slots & error states
│   │       └── Modal.tsx       # Dialog with backdrop blur, focus trap & ESC close
│   ├── constants/              # Shared application constants
│   │   ├── navigation.ts       # Nav links, footer links, external links
│   │   └── templates.ts        # Curated sample meme templates with real metadata
│   ├── features/               # Feature-oriented domain modules
│   │   ├── editor/             # Meme editor workspace
│   │   │   └── EditorQuickStart.tsx  # Live caption preview with state synchronization
│   │   └── templates/          # Template browsing domain
│   │       ├── TemplateCard.tsx      # Template card with image fallback & actions
│   │       ├── TemplateGrid.tsx      # Searchable & filterable responsive grid
│   │       └── TemplatePreviewModal.tsx # Detailed template inspector modal
│   ├── lib/                    # Shared utilities
│   │   └── utils.ts            # Classnames helper (cn), number formatting
│   ├── pages/                  # Page compositions
│   │   └── HomePage.tsx        # Hero, 3-step pipeline, Studio preview, Template Arsenal
│   ├── services/               # Future backend API integration
│   │   ├── apiClient.ts        # Typed fetch client with environment base URL
│   │   ├── templateService.ts  # Template service contract with fallback
│   │   └── README.md           # Backend contracts, endpoints, and questions for Nithish
│   ├── stores/                 # Zustand global client state
│   │   ├── useTemplateStore.ts # Selected template, search, category, modal state
│   │   └── README.md           # State management architecture & Day 2 roadmap
│   ├── types/                  # Centralized TypeScript definitions
│   │   ├── api.ts              # API envelopes, pagination, error types
│   │   ├── editor.ts           # Canvas layer definitions & Day 2 editor state
│   │   ├── template.ts         # Template entity and category union types
│   │   └── index.ts            # Central barrel re-export
│   ├── App.tsx                 # Root application shell
│   ├── index.css               # Tailwind CSS v4 setup & typography
│   └── main.tsx                # React DOM mount point
├── .env.example                # Placeholder environment configuration
├── .gitignore                  # Git ignore rules
├── eslint.config.js            # ESLint flat config with TypeScript & React plugins
├── index.html                  # HTML5 entry with SEO tags & Google Fonts
├── package.json                # Project dependencies and npm scripts
├── tsconfig.app.json           # Client TypeScript configuration
├── tsconfig.json               # Root TypeScript configuration
├── tsconfig.node.json          # Vite node tooling TypeScript configuration
└── vite.config.ts              # Vite configuration with React and Tailwind v4 plugins
```

---

## 3. Getting Started

### Prerequisites
- Node.js `v20+` (verified on `v24.18.0`)
- npm `v10+` (verified on `11.16.0`)

### Installation
```bash
git clone https://github.com/CodeAirLines/MemeGen-Frontend.git
cd MemeGen-Frontend
npm install
```

### Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### Useful Scripts
| Command | Description |
|---|---|
| `npm run dev` | Start the local Vite development server with HMR |
| `npm run typecheck` | Run standalone TypeScript type-checking (`tsc --noEmit`) |
| `npm run lint` | Run ESLint across all source files |
| `npm run build` | Compile TypeScript and produce production build in `dist/` |
| `npm run preview` | Locally preview the production build |

---

## 4. Zustand State Management (Day 1 Decision)

Zustand is configured responsibly in `src/stores/useTemplateStore.ts` to manage:
1. **`selectedTemplate`**: Holds the user's active template selection when clicking "Use Template", immediately binding to the Meme Studio Workspace.
2. **`searchQuery` & `activeCategory`**: Synchronizes filtering across Hero CTAs, search inputs, and the template grid.
3. **`isPreviewOpen` & `previewTemplate`**: Controls the template inspector modal cleanly without prop drilling.

Component-transient form states (such as active keystrokes, color picker inputs, and menu open/close toggles) remain in local React component state.

---

## 5. Backend Integration & Collaboration with Nithish

Frontend development is decoupled from the backend. The service layer (`src/services/`) is fully prepared with:
- Configurable `VITE_API_BASE_URL`
- Standardized API response envelopes (`ApiResponse<T>`, `PaginatedResponse<T>`, `ApiErrorResponse`)
- Clean fallback mechanism (`VITE_MOCK_API_FALLBACK=true`) so frontend development is never blocked

### Questions Pending for Nithish:
1. **API Base URL**: What are the host addresses for local backend development, staging, and production?
2. **Authentication Method**: Will authentication use JWT bearer tokens, HttpOnly cookies, or third-party OAuth?
3. **Template API Structure**: Does the template endpoint conform to `{ success: boolean, data: { items: MemeTemplate[], pagination: ... } }`?
4. **Image Uploads & Meme Generation**: Will custom user uploads use pre-signed S3 URLs or multipart form-data? Is meme generation rendered client-side on canvas or server-side via Sharp/Canvas?
5. **Drafts & Published Memes**: What is the schema for saving editable meme layer drafts vs flattened exported images?
6. **Error Response Format**: What standard error codes and JSON structure will backend exceptions return?

---

## 6. Day 2 Roadmap
- [ ] Implement HTML5 2D Canvas / SVG Meme Editor engine.
- [ ] Drag-and-drop text positioning with interactive bounding boxes.
- [ ] Font family selector (Impact, Comic Sans, Inter, Roboto, Arial).
- [ ] Stroke thickness, text shadow, and alignment controls.
- [ ] Custom user image file dropzone & upload integration.
- [ ] Client-side high-resolution PNG / WebP export.
