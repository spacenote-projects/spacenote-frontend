#!/bin/sh
set -eu

node --input-type=module <<'NODE'
import { writeFileSync } from 'node:fs'

const apiUrl = process.env.API_URL ?? process.env.VITE_API_URL ?? 'http://localhost:3100'

const config = `window.__SPACENOTE_CONFIG__ = {\n  API_URL: ${JSON.stringify(apiUrl)}\n};\n`

writeFileSync('/app/dist/runtime-config.js', config, 'utf8')
NODE

exec "$@"
