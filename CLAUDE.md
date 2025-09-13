# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical Guidelines

1. **Always communicate in English** - Regardless of the language the user speaks, always respond in English. All code, comments, and documentation must be in English.

2. **Minimal documentation** - Only add comments/documentation when it simplifies understanding and isn't obvious from the code itself. Keep it strictly relevant and concise.

3. **Critical thinking** - Always critically evaluate user ideas. Users can make mistakes. Think first about whether the user's idea is good before implementing.

4. **Use pnpm** - Always use `pnpm` instead of `npm` for package management commands.

## Development Commands

- `just agent-start` - Start the application
- `just agent-stop` - Stop the application
- `just dev` - Never run this command. It's for humans only.

## Type Generation

- `pnpm run generate-types` - Generate TypeScript types from OpenAPI spec at http://localhost:3100/openapi.json
- Generated types are in `src/types/generated.ts` (auto-generated, do not edit)
- Re-exported types are in `src/types/index.ts` for convenient access
