FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

# Copy source code and build
COPY . .
RUN npx prisma generate
RUN npm run build

# --- Production Image ---
FROM node:20-alpine

WORKDIR /app

# Copy dependencies and built files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001

# Command to run (including prisma db push or deploy, usually handled outside, but for simplicity here we just start)
# Note: For production, consider using 'npx prisma migrate deploy' before starting
CMD ["npm", "run", "start:prod"]
