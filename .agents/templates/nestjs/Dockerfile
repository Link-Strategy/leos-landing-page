# ─── Stage 1: Build ───────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY tsconfig.json nest-cli.json ./
COPY src ./src

RUN npm run build

# ─── Stage 2: Production ─────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

RUN addgroup -S leos && adduser -S leos -G leos

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

USER leos

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

HEALTHCHECK CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

CMD ["node", "dist/main.js"]
