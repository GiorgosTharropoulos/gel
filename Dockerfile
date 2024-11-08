FROM node:20-alpine AS base

FROM base AS builder
RUN apk add --no-cache gcompat

WORKDIR /app

COPY . .

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
RUN pnpm build
RUN pnpm prune --prod

FROM base AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/packages/data/dist /app/packages/data/dist
COPY --from=builder --chown=hono:nodejs /app/packages/data/package.json /app/packages/data/package.json
COPY --from=builder --chown=hono:nodejs /app/apps/backend/node_modules /app/apps/backend/node_modules
COPY --from=builder --chown=hono:nodejs /app/apps/frontend/dist /app/apps/backend/public/dist
COPY --from=builder --chown=hono:nodejs /app/apps/backend/dist /app/apps/backend/dist
COPY --from=builder --chown=hono:nodejs /app/apps/backend/package.json /app/apps/backend/package.json

USER hono
EXPOSE 3000

WORKDIR /app/apps/backend
CMD [ "node",  "dist/index.js"]
