# Screenshot Tool

Automated screenshot capture tool for Hong Kong regulatory registries: HKEX, SFC, AFRC, and AFRC-firm sources.

## What it does

- Search regulators (HKEX, SFC, AFRC, AFRC-firm) by name or code
- Capture full-page screenshots with a Playwright headless browser
- Download screenshots individually or as a ZIP
- Simple password-protected web UI; self-hosted

## Stack

- **Next.js 16** — app router, server actions
- **Playwright** — headless Chromium for screenshot capture
- **Docker** — containerised for easy self-hosting
- **Cloudflare Tunnel** — optional zero-config HTTPS (no port-forwarding needed)

## Local development

**Prerequisites:** Node.js 20+

1. Install dependencies:
   ```bash
   npm install
   npx playwright install chromium
   ```
2. Copy the env template and set your secret:
   ```bash
   cp .env.example .env.local
   # Edit .env.local — set INTERNAL_API_SECRET to any 32+ char random string
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000)

## Production deploy (Docker)

**Prerequisites:** A Linux VM (GCP e2-micro or Oracle Cloud Free ARM both qualify).

The deploy scripts are in `scripts/`. They:
- Install Docker
- Clone this repo
- Generate a random `INTERNAL_API_SECRET`
- Set up a `systemd` service
- Install `cloudflared` for HTTPS tunnelling

```bash
# Set your own repo URL before running:
export REPO_URL=https://github.com/YOUR_GITHUB_USERNAME/screenshot-tool.git

# GCP (amd64):
bash scripts/deploy-gcp.sh

# Oracle Cloud ARM (arm64):
bash scripts/deploy-oracle.sh
```

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `INTERNAL_API_SECRET` | Yes | Shared login secret. Min 32 chars. Generate with: `openssl rand -hex 24` |
| `NODE_ENV` | No | `development` or `production` (default: `development`) |
| `CIES_SELF_PING_URL` | No | Set to `https://your-host/api/health` to keep the tunnel alive |

## Health check

```bash
curl http://localhost:3000/api/health
```
