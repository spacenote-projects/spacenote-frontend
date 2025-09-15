dev:
    pnpm run dev

lint:
    pnpm run format
    pnpm run lint
    pnpm run typecheck

agent-start: agent-stop # For AI agents
    sh -c 'pnpm run agent-dev > agent.log 2>&1 & echo $! > agent.pid'

agent-stop: # For AI agents
    -pkill -F agent.pid 2>/dev/null || true
    -rm -f agent.pid agent.log