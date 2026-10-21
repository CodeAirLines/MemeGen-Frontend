# MemeHub — Frontend Platform

A modern, high-performance web-based meme generation platform frontend built with React 19, TypeScript, Tailwind CSS v4, and Vite. Designed to provide instant template discovery, live caption editing, community showcases, and a decoupled architecture ready for backend API integration.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Architecture & Directory Structure](#project-architecture--directory-structure)
- [System Requirements & Prerequisites](#system-requirements--prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Available Scripts](#available-scripts)
- [Application Flow & Navigation](#application-flow--navigation)
- [State Management Architecture](#state-management-architecture)
- [Backend API Integration & Contracts](#backend-api-integration--contracts)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [License & Project Information](#license--project-information)

---

## Overview

**MemeHub** (`memegen-frontend`) is a client-side Single Page Application (SPA) providing an intuitive interface for discovering popular meme templates, customizing text captions in real time, and browsing community creations.

The frontend is built with decoupling in mind: it features a dedicated service layer with automatic mock fallback (`VITE_MOCK_API_FALLBACK=true`), allowing complete local development and testing even when the backend API is offline or under active development.

---

## Key Features

- **Interactive Playground (`InteractivePlayground.tsx`)**: Live caption customization allowing users to enter top and bottom text, adjust font sizes, toggle uppercase styling, select custom text colors, and inspect the rendered result instantaneously.
- **Template Discovery & Arsenal (`TemplateGrid.tsx`, `TemplateCard.tsx`)**: Responsive, searchable grid of curated meme templates with categorized filtering (Classic, Pop Culture, Anime, Gaming, Reaction, Work/Office, Animals, Crypto/Finance) and graceful image fallback handling.
- **Template Preview Modal (`TemplatePreviewModal.tsx`, `Modal.tsx`)**: Modal dialog with backdrop blur, detailed template dimensions, usage stats, tags, and one-click template selection for editor handoff.
- **Community Feed & Showcase (`CommunityLiveFeed.tsx`, `CommunityBanner.tsx`)**: Community showcase with like counts, comment counts, share triggers, and an image viewer modal.
- **Weekly Contests (`WeeklyContest.tsx`)**: Interactive banner spotlighting weekly community challenges, countdown timer mock, prizes, and submission highlights.
- **Multi-Platform Aspect Ratio Guides (`ExportPlatforms.tsx`)**: Visualized format support for common social media aspect ratios (Instagram 1:1, Twitter/X 16:9, Stories 9:16).
- **Creator Feature Spotlights & Pro Tips (`FeatureSpotlights.tsx`, `MemeProTips.tsx`)**: Guided cards explaining HD exports, typography recommendations, and virality tips.
- **Tier Pricing Breakdown (`PricingSection.tsx`)**: Comparative overview between Free and Creator Pro membership features.
- **Interactive FAQ Accordion (`FaqSection.tsx`)**: Expandable accordion addressing common creator questions.
- **Floating Island Navigation (`Header.tsx`)**: Responsive header with scroll-aware styling, desktop navigation links, and mobile slide-out drawer.

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Core Framework** | [React](https://react.dev/) | `^19.3.1` | Component-driven UI architecture |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | `~6.0.3` | Type definitions and compile-time contract safety |
| **Build Tooling & Bundler** | [Vite](https://vite.dev/) | `^8.3.4` | Development server with Fast HMR and Rollup production builds |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) + `@tailwindcss/vite` | `^4.3.3` | Utility-first styling engine with zero CSS configuration overhead |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) | `^5.0.15` | Minimal, type-safe global client state |
| **Iconography** | [Lucide React](https://lucide.dev/) | `^1.61.0` | Accessible, tree-shakeable SVG icon components |
| **Utility Libraries** | `clsx` & `tailwind-merge` | `^2.1.1` / `^3.7.0` | Conditional class joining and Tailwind class conflict resolution |
| **Code Quality** | [ESLint](https://eslint.org/) | `^10.13.0` | Static analysis with React Hooks and TypeScript rules |

---

## Project Architecture & Directory Structure

```text
MemeGen-Frontend/
├── public/                       # Static public assets (SVGs, icons, sample images)
├── src/
│   ├── assets/                   # Local application assets
│   ├── components/
│   │   ├── layout/               # Global layout primitives
│   │   │   ├── Header.tsx        # Floating sticky navigation bar and mobile drawer
│   │   │   └── Footer.tsx        # Multi-column footer and platform information
│   │   └── ui/                   # Reusable atomic UI components
│   │       ├── Badge.tsx         # Pill badge supporting multiple color variants
│   │       ├── Button.tsx        # Accessible button (primary, secondary, outline, ghost)
│   │       ├── Card.tsx          # Card container with borders and hover elevation
│   │       ├── Input.tsx         # Input field with icon prefix/suffix slots
│   │       └── Modal.tsx         # Accessible dialog with backdrop blur & Escape key listener
│   ├── constants/                # Immutable application constants
│   │   ├── navigation.ts         # Navigation bar and footer link definitions
│   │   └── templates.ts          # Curated sample meme templates and community posts
│   ├── features/                 # Domain-driven feature modules
│   │   ├── editor/               # Editor workspace
│   │   │   └── EditorQuickStart.tsx  # Quick-start editor component
│   │   ├── home/                 # Landing page sections
│   │   │   ├── CommunityBanner.tsx   # Community banner callout
│   │   │   ├── CommunityLiveFeed.tsx # Community feed cards and metrics
│   │   │   ├── ExportPlatforms.tsx   # Export format & aspect ratio cards
│   │   │   ├── FaqSection.tsx        # Interactive accordion FAQ
│   │   │   ├── FeatureSpotlights.tsx # Feature capability cards
│   │   │   ├── InteractivePlayground.tsx # Real-time captioning playground
│   │   │   ├── MemeProTips.tsx       # Creator tips and advice cards
│   │   │   ├── PricingSection.tsx    # Plan comparisons (Free vs Pro)
│   │   │   ├── Testimonials.tsx      # User feedback and testimonials
│   │   │   ├── TrendingArticles.tsx  # Trend highlights and guides
│   │   │   ├── TrendingGenres.tsx    # Category pills and filters
│   │   │   └── WeeklyContest.tsx     # Contest leaderboard and timeline
│   │   └── templates/            # Template browsing domain
│   │       ├── TemplateCard.tsx      # Individual template card with error fallback
│   │       ├── TemplateGrid.tsx      # Filterable and searchable template grid
│   │       └── TemplatePreviewModal.tsx # Detailed template inspector modal
│   ├── lib/
│   │   └── utils.ts              # Class merging helper (cn) and formatting utilities
│   ├── pages/
│   │   └── HomePage.tsx          # Landing page composition combining all feature sections
│   ├── services/                 # API communication layer
│   │   ├── apiClient.ts          # Generic typed fetch wrapper with error handling
│   │   ├── templateService.ts    # Template retrieval service with mock fallback
│   │   └── README.md             # Backend contract documentation & endpoint specifications
│   ├── stores/                   # Global state management
│   │   ├── useTemplateStore.ts   # Zustand store for template selection, query, and filters
│   │   └── README.md             # State store design notes and roadmap
│   ├── types/                    # Shared TypeScript declarations
│   │   ├── api.ts                # API request/response envelopes and pagination models
│   │   ├── editor.ts             # Canvas editor and text layer types
│   │   ├── index.ts              # Central type re-exports
│   │   └── template.ts           # Meme template entities and category unions
│   ├── App.tsx                   # Main application root component
│   ├── index.css                 # Global CSS and Tailwind CSS v4 directives
│   └── main.tsx                  # React DOM mount point
├── .env.example                  # Environment variable reference template
├── .gitignore                    # Git exclusions
├── eslint.config.js              # ESLint 9+ flat configuration
├── index.html                    # HTML entry point with meta tags and font preconnects
├── package.json                  # Dependencies, scripts, and package metadata
├── tsconfig.app.json             # TypeScript configuration for application code
├── tsconfig.json                 # TypeScript root project references configuration
├── tsconfig.node.json            # TypeScript configuration for Vite build tools
└── vite.config.ts                # Vite build and plugin configuration
```

---

## System Requirements & Prerequisites

- **Node.js**: `v20.0.0` or higher (verified on `v24.18.0`)
- **Package Manager**: `npm` `v10.0.0` or higher (verified on `11.16.0`), or compatible alternatives (`pnpm`, `yarn`)
- **Modern Browser**: Chrome, Edge, Firefox, or Safari supporting ES2022+

---

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/CodeAirLines/MemeGen-Frontend.git
   cd MemeGen-Frontend
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   # On macOS / Linux
   cp .env.example .env.local

   # On Windows (PowerShell)
   Copy-Item .env.example .env.local

   # On Windows (Command Prompt)
   copy .env.example .env.local
   ```

4. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Environment Configuration

The application reads environment variables prefixed with `VITE_` at build and run time through `import.meta.env`.

The repository provides [.env.example](.env.example) as a baseline template:

| Variable Name | Default / Example Value | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `https://api.memegen.example.com/api/v1` | Base URL for the backend REST API endpoints |
| `VITE_APP_ENV` | `development` | Target deployment environment (`development`, `staging`, `production`) |
| `VITE_ENABLE_ANALYTICS` | `false` | Feature flag to enable or disable client-side analytics |
| `VITE_MOCK_API_FALLBACK` | `true` | When `true`, services return local sample data if the backend is unreachable |

> [!NOTE]
> Do not commit sensitive credentials or secret keys to `.env.local` or version control. Only variables prefixed with `VITE_` are exposed to the client bundle.

---

## Available Scripts

All scripts are defined in [package.json](package.json) and can be executed with `npm run <script>`:

| Command | Tool / Underlying Execution | Description |
|---|---|---|
| `npm run dev` | `vite` | Starts the local development server with Fast Refresh (HMR). Default port is `5173`. |
| `npm run build` | `tsc -b && vite build` | Runs project-wide TypeScript compilation (`tsc -b`) followed by Vite production bundling into `dist/`. |
| `npm run preview` | `vite preview` | Serves the built production assets locally from `dist/` to verify release readiness before deployment. |
| `npm run typecheck` | `tsc --noEmit` | Performs strict static type analysis across all TypeScript files without producing output artifacts. |
| `npm run lint` | `eslint .` | Runs ESLint across the codebase using the flat config rules defined in `eslint.config.js`. |

---

## Application Flow & Navigation

The platform currently operates as a Single Page Application (SPA). Global header and footer links route smoothly to specific page sections via semantic HTML IDs:

- `#create`: Real-time interactive meme generator and caption playground.
- `#templates`: Searchable, filterable meme template gallery with modal preview.
- `#gif-maker`: Animated media creation spotlight section.
- `#ai-tools`: AI prompt-based meme generator preview.
- `#explore`: Community feed showcasing trending memes, likes, and shares.

---

## State Management Architecture

Global state is powered by **Zustand** in `src/stores/useTemplateStore.ts`. It follows clean separation between shared cross-cutting application state and transient UI component state:

### Global Store (`useTemplateStore`)
- **`selectedTemplate`**: Stores the active meme template selected by the user for downstream editing.
- **`searchQuery` & `activeCategory`**: Keeps search keywords and category filters synchronized between Hero CTAs and the Template Grid.
- **`previewTemplate` & `isPreviewOpen`**: Manages modal state for template inspection without prop drilling.
- **`notification`**: Transient success/info feedback when templates are chosen.

### Transient Component State
- Kept local within components using React's standard `useState` (e.g., active caption text inputs, color picker values, font size sliders, and mobile drawer toggles).

---

## Backend API Integration & Contracts

The frontend is completely decoupled from backend infrastructure. The service layer (`src/services/apiClient.ts` and `src/services/templateService.ts`) is designed to connect to the backend API as soon as live endpoints are deployed.

### Planned Endpoints (Documented in `src/services/README.md`)

#### Template Management
- `GET /api/v1/templates` — List paginated meme templates with category and query parameters.
- `GET /api/v1/templates/:id` — Fetch detailed template metadata.
- `POST /api/v1/templates/upload` — Upload user-provided custom blank template (requires auth).

#### Meme Creation & Publishing
- `POST /api/v1/memes/generate` — Server-side meme rendering (optional).
- `POST /api/v1/memes` — Save a published meme to the public community feed (requires auth).
- `GET /api/v1/memes` — Browse community feed (trending, latest, top).
- `GET /api/v1/memes/:id` — Retrieve published meme details.

#### Authentication & Profile
- `POST /api/v1/auth/register` — Register a new account.
- `POST /api/v1/auth/login` — Authenticate and retrieve bearer token.
- `POST /api/v1/auth/logout` — Invalidate user session.
- `GET /api/v1/auth/me` — Fetch current user profile.

### Standard Response Envelope

Responses adhere to the TypeScript interfaces declared in `src/types/api.ts`:

```typescript
// Success Envelope
interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}

// Error Envelope
interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}
```

---

## Deployment

The frontend produces a completely static bundle that can be hosted on any static web hosting provider (e.g., Vercel, Netlify, Cloudflare Pages, AWS S3 / CloudFront, GitHub Pages, or an Nginx web server):

1. **Build the production bundle:**
   ```bash
   npm run build
   ```
2. **Output directory:**
   The compiled assets will be located in the `dist/` directory.

3. **Single Page Application Routing Note:**
   Ensure your web server or hosting platform is configured to rewrite all non-file route requests to `/index.html` (standard SPA fallback).

---

## Troubleshooting

### Port `5173` is already in use
If another process is running on the default Vite port, specify a custom port:
```bash
npx vite --port 3000
```

### Mock API Fallback Behavior
If templates or features load sample data instead of reaching your local backend server:
1. Verify `VITE_API_BASE_URL` in `.env.local` points to your active backend host.
2. Ensure your backend server is running and accessible without CORS restrictions.
3. Check that `VITE_MOCK_API_FALLBACK` is set according to your development requirements.

### TypeScript or Lint Errors on Build
Run standalone checks before building to identify specific issues:
```bash
npm run typecheck
npm run lint
```

---

## License & Project Information

- **Repository**: [CodeAirLines/MemeGen-Frontend](https://github.com/CodeAirLines/MemeGen-Frontend.git)
- **Package Status**: Private (`"private": true` in `package.json`)
