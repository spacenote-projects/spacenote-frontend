# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical Guidelines

1. **Always communicate in English** - Regardless of the language the user speaks, always respond in English. All code, comments, and documentation must be in English.

2. **Minimal documentation** - Only add comments/documentation when it simplifies understanding and isn't obvious from the code itself. Keep it strictly relevant and concise.

3. **Critical thinking** - Always critically evaluate user ideas. Users can make mistakes. Think first about whether the user's idea is good before implementing.

4. **Use pnpm** - Always use `pnpm` instead of `npm` for package management commands.

5. **Component props** - Use inline types for simple props (1-3 properties). Never create interfaces for simple props. Only use interfaces for 4+ properties or when JSDoc comments are needed. See `docs/architecture.md` for details.

6. **Never disable linters** - NEVER use eslint-disable comments or disable any other linters/type checkers. Fix the actual issues instead. If absolutely necessary and there's no other way, you MUST ask the user for explicit permission first.

## Development Commands

- `just agent-start` - Start the application
- `just agent-stop` - Stop the application
- `just dev` - Never run this command. It's for humans only.

## Type Generation

- `pnpm run generate-types` - Generate TypeScript types from OpenAPI spec at http://localhost:3100/openapi.json
- Generated types are in `src/types/generated.ts` (auto-generated, do not edit)
- Re-exported types are in `src/types/index.ts` for convenient access

## Code Quality

- `just lint` - Run linters and formatters after making code changes

## Navigation

- **Always use React Router's `useNavigate`** for navigation between pages
- **Never use `window.location.href`** for internal navigation (only exception: login page after auth token changes)
- This preserves SPA benefits: faster transitions, maintained state, no full page reloads
