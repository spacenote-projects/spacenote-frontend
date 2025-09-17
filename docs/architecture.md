# Architecture

## Repository Structure

SpaceNote is a multi-repository project:

- **spacenote-backend** - Python + MongoDB + FastAPI
- **spacenote-frontend** - React application (this repository)

### Project Structure

```
src/
├── components/
│   ├── pages/                 # Page components
│   │   ├── notes/             # Complex page with sub-components
│   │   │   ├── NotesPage.tsx
│   │   │   └── -components/   # Internal components (- prefix)
│   │   ├── note/
│   │   ├── new-note/
│   │   ├── new-space/
│   │   ├── fields/
│   │   ├── members/
│   │   ├── space-settings/
│   │   └── login/
│   ├── layouts/               # Layout components
│   │   ├── Layout.tsx
│   │   └── -components/
│   ├── ui/                    # UI components (shadcn/ui)
│   ├── shared/                # Reusable components
│   └── errors/                # Error handling components
├── lib/                       # Core utilities
│   ├── api.ts                # TanStack Query definitions
│   ├── http-client.ts        # HTTP client configuration
│   ├── errors.ts             # Error handling system
│   ├── auth-storage.ts       # Authentication management
│   └── formatters.ts         # Data formatting utilities
├── hooks/                     # Custom React hooks
│   └── useCache.ts           # Cache access hooks
├── types/                     # TypeScript type system
│   ├── generated.ts          # Auto-generated from OpenAPI
│   └── index.ts              # Type re-exports
├── router.ts                  # Route configuration
└── main.tsx                   # Application entry point
```

## Type System

### Type Generation

- **Source**: Backend OpenAPI at `http://localhost:3100/openapi.json`
- **Command**: `pnpm run generate-types`
- **Generated**: `src/types/generated.ts` (DO NOT EDIT)
- **Re-exports**: `src/types/index.ts` for cleaner imports

```typescript
// Import from types/index.ts, not generated.ts
import type { User, Space, Note } from "@/types"
```

## API Layer

### `lib/http-client.ts`

Configures ky HTTP client:

- Attaches auth tokens
- Handles 401 redirects
- Transforms errors to AppError

### `lib/api.ts`

Defines TanStack Query queries and mutations:

- Cache configuration per data type
- Query key management
- Type-safe API methods

### Caching Strategy

- **Static data** (spaces, users): `staleTime: Infinity`
- **Dynamic data** (notes): `staleTime: 1 minute`
- **Comments**: `staleTime: 30 seconds`

## Routing

Routes use `/s/:slug` pattern for spaces:

- `/` - Home page
- `/login` - Login page
- `/spaces/new` - Create space
- `/s/:slug` - Space notes list
- `/s/:slug/new` - Create note
- `/s/:slug/:number` - View note
- `/s/:slug/members` - Manage members
- `/s/:slug/fields` - Manage fields

## Form Handling

Forms use React Hook Form + Zod:

1. Define Zod schema
2. Setup form with zodResolver
3. Display errors inline (no onError callbacks)
4. Handle success with navigation/toast

```typescript
const onSubmit = (data: FormData) => {
  mutation.mutate(data, {
    onSuccess: (result) => navigate(`/notes/${result.id}`)
  })
}

// Error display in render
{mutation.error && <ErrorMessage error={mutation.error} />}
```

## Component Patterns

### Props Guidelines

- **Inline types** for 1-3 properties
- **Interfaces** for 4+ properties or when JSDoc needed

```typescript
// ✅ Good - simple props
export function ErrorMessage({ error }: { error: unknown }) {}

// ✅ Good - complex props
interface PaginatorProps {
  currentPage: number
  totalPages: number
  pageSize: number
  totalCount: number
}
```

### Page Organization

- Simple pages: Single file
- Complex pages: Folder with `-components/` subdirectory

## Authentication

- Token stored in localStorage
- Auto-attached to requests
- 401 triggers logout and redirect
- Profile via `/api/v1/profile` endpoint

## Navigation

**Always use React Router's `useNavigate`** - preserves SPA benefits
**Never use `window.location.href`** except for auth redirects

## Development

### Commands

- `pnpm install` - Install dependencies
- `pnpm dev` - Development server (humans)
- `pnpm agent-dev` - Development server (AI agents)
- `pnpm run generate-types` - Update types from backend
- `pnpm run lint` - Run linters
- `pnpm run typecheck` - Type checking

### Technologies

- **React 19** - UI framework
- **TanStack Query** - Server state
- **React Router 7** - Client routing
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Ky** - HTTP client
- **Zod** - Validation
- **React Hook Form** - Forms
- **React Markdown** - Markdown rendering with remark-gfm
- **pnpm** - Package manager

## Key Principles

1. **Cache-first** - Minimize network requests
2. **Type safety** - Full TypeScript coverage
3. **Clear separation** - API logic vs UI logic
4. **Error resilience** - Graceful error handling
5. **Minimal documentation** - Self-documenting code
