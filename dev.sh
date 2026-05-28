#!/usr/bin/env bash
# Koded OS v18 — dev launcher
# Starts backend + frontend + optional ngrok tunnel
# Usage:
#   ./dev.sh          — local only (no tunnel)
#   ./dev.sh --tunnel — local + ngrok public URL

set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
TUNNEL=false
[[ "$1" == "--tunnel" ]] && TUNNEL=true

GREEN='\033[0;32m'
CYAN='\033[0;36m'
DIM='\033[0;37m'
RESET='\033[0m'

PIDS=()

cleanup() {
  echo -e "\n${DIM}shutting down...${RESET}"
  for pid in "${PIDS[@]}"; do
    kill "$pid" 2>/dev/null
  done
  pkill -f "manage.py runserver" 2>/dev/null
  pkill -f "vite --port" 2>/dev/null
  pkill -f "ngrok http" 2>/dev/null
  exit 0
}
trap cleanup INT TERM

# ── 1. Backend ────────────────────────────────────────────────────────────────
echo -e "${DIM}starting django backend...${RESET}"
cd "$ROOT/backend"
.venv/bin/python manage.py runserver 8000 --noreload 2>/dev/null &
PIDS+=($!)

# ── 2. Frontend ───────────────────────────────────────────────────────────────
echo -e "${DIM}starting vite frontend...${RESET}"
cd "$ROOT/frontend"
npm run dev -- --port 5173 2>/dev/null &
PIDS+=($!)

# ── 3. Wait for frontend to be ready ─────────────────────────────────────────
printf "${DIM}waiting for servers"
for i in $(seq 1 20); do
  if curl -s -o /dev/null http://localhost:5173/ 2>/dev/null; then
    break
  fi
  printf "."
  sleep 1
done
printf "${RESET}\n"

# ── 4. Optional ngrok tunnel ──────────────────────────────────────────────────
PUBLIC_URL=""

if $TUNNEL; then
  echo -e "${DIM}starting ngrok tunnel on port 5173...${RESET}"
  ngrok http 5173 --log=stdout --log-level=warn > /tmp/v18_ngrok.log 2>&1 &
  PIDS+=($!)

  # poll ngrok local API until tunnel is up
  for i in $(seq 1 15); do
    PUBLIC_URL=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null \
      | python3 -c "
import sys, json
try:
  t = json.load(sys.stdin)['tunnels']
  https = [x for x in t if x.get('proto') == 'https']
  print(https[0]['public_url'] if https else '', end='')
except:
  print('', end='')
" 2>/dev/null)
    [[ -n "$PUBLIC_URL" ]] && break
    sleep 1
  done
fi

# ── 5. Print URLs ─────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}  koded_os_v18 — running${RESET}"
echo -e "  ──────────────────────────────────────"
echo -e "  ${CYAN}frontend${RESET}   http://localhost:5173"
echo -e "  ${CYAN}backend${RESET}    http://localhost:8000"
echo -e "  ${CYAN}admin${RESET}      http://localhost:8000/admin"
if $TUNNEL; then
  if [[ -n "$PUBLIC_URL" ]]; then
    echo -e "  ${GREEN}public${RESET}     $PUBLIC_URL"
    echo ""
    echo -e "  ${DIM}share that URL — API calls tunnel through Vite proxy${RESET}"
  else
    echo -e "  ${DIM}tunnel: ngrok did not start — check /tmp/v18_ngrok.log${RESET}"
  fi
fi
echo -e "  ──────────────────────────────────────"
echo -e "  ${DIM}ctrl+c to stop all processes${RESET}"
echo ""

wait
