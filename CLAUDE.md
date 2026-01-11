# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lekko-web is a Next.js 15 frontend application for a athletics event management platform (Lekkoatletawka). It's a Polish-language web application built with React 19, TypeScript, and Tailwind CSS. The app communicates with a backend API for event management, athlete tracking, and typing competitions.

## Development Environment

### Prerequisites
- pnpm (install with: `npm install -g pnpm`)

### Common Commands

**Development:**
```bash
pnpm run dev
```
Starts the Next.js dev server at `http://localhost:3000`

**Build & Production:**
```bash
pnpm run build       # Build for production
pnpm run start       # Start production server
```

**Code Quality:**
```bash
pnpm run lint           # Run ESLint
pnpm run lint:fix       # Fix ESLint issues automatically
pnpm run prettier       # Format all code with Prettier
```

**Deployment:**
```bash
./deploy_podman.sh      # Deploy if you have podman locally
# OR
./deploy_docker.sh      # Deploy if you have docker locally
```

## Architecture

### Directory Structure

- **`app/`** - Next.js App Router pages and layouts
  - Routes include: `/user` (login/register), `/typer` (typing competitions), `/ranking` (leaderboards)
  - API integration layer using axios

- **`components/`** - Reusable React components
  - Component-based UI architecture with Tailwind CSS styling

- **`context/`** - React Context providers
  - `PrivateUserContext.tsx` - User authentication context
  - `QueryProvider.tsx` - React Query setup for data fetching

- **`store/`** - Zustand state management
  - `user.ts` - User authentication state (token, user data, logout)

- **`hooks/`** - Custom React hooks
  - Handles complex logic for events, event admin, and answer submission

- **`types/`** - TypeScript type definitions
  - Organized by domain: users, events, athletes, questions, answers, rankings

- **`lib/`** - Utility functions
  - API client utilities, country data, date utilities, admin helpers, ranking logic

### Data Flow & API Integration

1. **API Client Layer** (`app/api/`):
   - Axios-based API wrapper functions for all backend endpoints
   - Centralized error handling via `handleError()` with Polish error messages
   - Auth token passed via Bearer token in headers
   - Each domain (events, athletes, questions, etc.) has dedicated API module

2. **State Management**:
   - User auth state: Zustand store (`store/user.ts`) + React Context
   - Query caching: React Query (TanStack) via `QueryProvider`
   - User hydration: `HydrateUser` component decodes JWT from localStorage

3. **Error Handling**:
   - Centralized error type definitions in `types/errors.ts`
   - `handleError()` function maps API error types to Polish user messages
   - Validation errors include detailed field-level error info

### Key Technologies

- **Next.js 15** - App Router with server/client components
- **React 19** - UI framework with new features
- **TypeScript 5** - Type safety
- **Tailwind CSS 3** - Utility-first styling
- **Zustand** - Lightweight state management
- **React Query** - Server state & caching
- **Axios** - HTTP client
- **Three.js** - 3D rendering (for specific features)
- **Husky** - Git hooks for pre-commit linting

### Styling

- **Tailwind CSS** with `prettier-plugin-tailwindcss` for class sorting
- **Tailwind config** in `tailwind.config.ts`
- **PostCSS** for processing with `postcss.config.mjs`
- Global styles in `app/globals.css`

## Code Quality Standards

### ESLint Configuration
- Extends: `next`, `prettier`, `next/core-web-vitals`, TypeScript/React recommended rules
- Key rules:
  - React hooks: `rules-of-hooks` (error), `exhaustive-deps` (warn)
  - TypeScript: Prefer `as` assertions over object literal type assertions
  - React: JSX fragments use shorthand syntax

### Pre-commit Hooks (Husky)
Files are automatically formatted and linted on commit:
```
*.ts,*.tsx,*.js,*.jsx → prettier + eslint --fix + eslint
*.json,*.css,*.md → prettier
```

### Prettier Configuration
- Configured via `.prettierrc.json`
- Tailwind plugin sorts utility classes

## Environment Configuration

- **`NEXT_PUBLIC_SERVER_URL`** - Backend API base URL (public, used in browser)
- Production build uses standalone output (`next.config.mjs: output: 'standalone'`)

## Deployment

### Container Build & Image Format

The app is containerized with multi-stage Dockerfile:
1. Base: `node:lts-alpine`
2. Dependencies: Install via pnpm with frozen lockfile
3. Builder: Build Next.js app
4. Runner: Production image with standalone output, exposes port 3000

### Deployment Scripts

Two deployment scripts are available depending on your local container runtime:

**Option 1: If you have podman locally**
```bash
./deploy_podman.sh
```
- Builds image with podman (creates `localhost/lekkoatletawka_web:latest`)
- Streams image via SSH to remote server
- Remote server uses docker to load and run the image
- Use this if your development machine has podman

**Option 2: If you have Docker locally**
```bash
./deploy_docker.sh
```
- Builds image with docker (creates `lekkoatletawka_web:latest`)
- Streams image via SSH to remote server
- Remote server uses docker to load and run the image
- Use this if your development machine has docker

Both scripts:
- Build for `linux/amd64` platform (cross-platform compatibility)
- Stream the built image to remote server via SSH (avoids network image registry)
- Remove any old container with the same name
- Start new container on configured ports (default: 3000)
- Require SSH key setup with 'admin' alias in `~/.ssh/config`

### SSH Configuration

Both deploy scripts use SSH to connect to the 'admin' host. Configure this in `~/.ssh/config`:

```
Host admin
    HostName your-server-ip
    User your-username
    IdentityFile ~/.ssh/your-private-key
```

Test the connection:
```bash
ssh admin echo "Connection successful"
```

## Important Implementation Notes

- **Auth**: JWT tokens stored in localStorage, decoded with `jwt-decode`, managed by Zustand
- **API Base URL**: Must be set via `NEXT_PUBLIC_SERVER_URL` environment variable
- **Internationalization**: Application is Polish-language (`lang="pl"` in root layout)
- **Fonts**: Using Google Fonts (Nunito) via Next.js font optimization
- **Data Fetching**: Use React Query hooks for server state, direct axios calls for one-off requests