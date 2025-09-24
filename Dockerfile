# syntax=docker/dockerfile:1.6

FROM node:24.8-alpine AS builder

WORKDIR /app

ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@10.16.1 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

FROM node:24.8-alpine AS runner

WORKDIR /app

RUN npm install --global serve@14.2.1

COPY --from=builder /app/dist ./dist
COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENV NODE_ENV=production

EXPOSE 4173

ENTRYPOINT ["/entrypoint.sh"]
CMD ["serve", "-s", "dist", "-l", "4173"]
