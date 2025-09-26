FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
WORKDIR /app
COPY . .
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
ENV NODE_ENV=production
RUN pnpm run build

FROM base AS dokploy
WORKDIR /app
ENV NODE_ENV=production

# Install FFmpeg
RUN apk add --no-cache ffmpeg

# Copy only the necessary files
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules

# Define volume for audio previews to persist data
VOLUME ["/app/uploads/previews"]

EXPOSE 3000
CMD ["node", "dist/src/main.js"]