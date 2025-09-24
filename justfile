set dotenv-load

docker_image_name := "spacenote-frontend"

dev:
    pnpm run dev

lint:
    pnpm run format
    pnpm run lint
    pnpm run typecheck

generate-types:
    pnpm run generate-types    

agent-start: agent-stop # For AI agents
    sh -c 'pnpm run agent-dev > agent.log 2>&1 & echo $! > agent.pid'

agent-stop: # For AI agents
    -pkill -F agent.pid 2>/dev/null || true
    -rm -f agent.pid agent.log

docker-build tag="latest":
    docker build -t {{docker_image_name}}:{{tag}} .

docker-push tag="latest":
    docker build -t spacenote-frontend:{{tag}} .
    docker tag spacenote-frontend:{{tag}} ghcr.io/spacenote-projects/spacenote-frontend:{{tag}}
    docker push ghcr.io/spacenote-projects/spacenote-frontend:{{tag}}


docker-run-local tag="latest":
    docker build -t {{docker_image_name}}:{{tag}} .
    docker run --rm -p 4173:4173 -e API_URL=${API_URL:-http://localhost:3100} {{docker_image_name}}:{{tag}}
