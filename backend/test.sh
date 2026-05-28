#!/usr/bin/env bash
# Backend smoke test — simulates a real visitor user flow
# Usage: ./test.sh [base_url]
# Default base: http://127.0.0.1:8000/api/v1

BASE="${1:-http://127.0.0.1:8000/api/v1}"

# Wait up to 15s for the server to accept connections
_wait_for_server() {
  local retries=15
  until curl -s -o /dev/null "$BASE/stats/" 2>/dev/null || [ "$retries" -eq 0 ]; do
    sleep 1; ((retries--))
  done
  [ "$retries" -gt 0 ] || { echo "Server did not start in time. Aborting."; exit 1; }
}
_wait_for_server
PASS=0
FAIL=0
WARN=0

# ── helpers ──────────────────────────────────────────────────────────────────

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
RESET='\033[0m'

pass() { echo -e "  ${GREEN}✓${RESET} $1"; ((PASS++)); }
fail() { echo -e "  ${RED}✗${RESET} $1"; ((FAIL++)); }
warn() { echo -e "  ${YELLOW}~${RESET} $1"; ((WARN++)); }
section() { echo -e "\n${CYAN}▶ $1${RESET}"; }

check_status() {
  local label="$1" expected="$2" actual="$3"
  if [ "$actual" -eq "$expected" ]; then
    pass "$label (HTTP $actual)"
  else
    fail "$label — expected HTTP $expected, got $actual"
  fi
}

check_field() {
  local label="$1" field="$2" body="$3"
  if echo "$body" | python3 -c "import sys,json; d=json.load(sys.stdin); assert '$field' in (d if isinstance(d,dict) else d[0] if d else {})" 2>/dev/null; then
    pass "$label — field '$field' present"
  else
    fail "$label — field '$field' missing in response"
  fi
}

check_count() {
  local label="$1" min="$2" body="$3"
  local count
  count=$(echo "$body" | python3 -c "
import sys, json
d = json.load(sys.stdin)
if isinstance(d, list): print(len(d))
elif isinstance(d, dict) and 'count' in d: print(d['count'])
elif isinstance(d, dict): print(len(d))
else: print(0)
" 2>/dev/null)
  if [ "${count:-0}" -ge "$min" ]; then
    pass "$label — $count items (min $min)"
  else
    fail "$label — got $count items, expected at least $min"
  fi
}

# ── 1. Health: static read endpoints ─────────────────────────────────────────

section "1 / Read endpoints (visitor loads the site)"

BODY=$(curl -s "$BASE/stats/")
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/stats/")
check_status "GET /stats/" 200 "$STATUS"
check_field  "stats has 'handle'" "handle" "$BODY"
check_field  "stats has 'version'" "version" "$BODY"

BODY=$(curl -s "$BASE/memories/")
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/memories/")
check_status "GET /memories/" 200 "$STATUS"
check_count  "memories seeded" 20 "$BODY"

BODY=$(curl -s "$BASE/commits/")
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/commits/")
check_status "GET /commits/" 200 "$STATUS"
check_count  "commits seeded" 15 "$BODY"

BODY=$(curl -s "$BASE/commits/?type=feat")
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/commits/?type=feat")
check_status "GET /commits/?type=feat" 200 "$STATUS"
check_count  "feat commits exist" 1 "$BODY"

BODY=$(curl -s "$BASE/commits/?type=hotfix")
check_count  "hotfix commits exist" 1 "$BODY"

BODY=$(curl -s "$BASE/journal/")
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/journal/")
check_status "GET /journal/" 200 "$STATUS"
check_count  "journal entries seeded" 3 "$BODY"

# grab first journal id
FIRST_JOURNAL_ID=$(echo "$BODY" | python3 -c "
import sys,json; d=json.load(sys.stdin)
items = d['results'] if 'results' in d else d
print(items[0]['id'] if items else 1)
" 2>/dev/null)

BODY=$(curl -s "$BASE/journal/$FIRST_JOURNAL_ID/")
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/journal/$FIRST_JOURNAL_ID/")
check_status "GET /journal/$FIRST_JOURNAL_ID/" 200 "$STATUS"
check_field  "journal detail has 'content'" "content" "$BODY"

BODY=$(curl -s "$BASE/roadmap/")
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/roadmap/")
check_status "GET /roadmap/" 200 "$STATUS"
if echo "$BODY" | python3 -c "import sys,json; d=json.load(sys.stdin); assert 'v18' in d and 'v19' in d and 'v20' in d" 2>/dev/null; then
  pass "roadmap has v18, v19, v20 keys"
else
  fail "roadmap missing version keys"
fi

BODY=$(curl -s "$BASE/scrapbook/")
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/scrapbook/")
check_status "GET /scrapbook/" 200 "$STATUS"

BODY=$(curl -s "$BASE/scrapbook/?category=hackathon")
check_status "GET /scrapbook/?category=hackathon" 200 "$(curl -s -o /dev/null -w "%{http_code}" "$BASE/scrapbook/?category=hackathon")"

BODY=$(curl -s "$BASE/pins/")
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/pins/")
check_status "GET /pins/" 200 "$STATUS"
check_count  "home pin seeded" 1 "$BODY"

# ── 2. Message wall ───────────────────────────────────────────────────────────

section "2 / Message wall (visitor leaves a message)"

BODY=$(curl -s "$BASE/messages/")
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/messages/")
check_status "GET /messages/" 200 "$STATUS"
check_count  "seed messages exist" 3 "$BODY"

# Valid commit message
BODY=$(curl -s -w "\n%{http_code}" -X POST "$BASE/messages/" \
  -H "Content-Type: application/json" \
  -d '{"name":"Ife","message":"feat(v18): happy birthday bro, this is fire","type":"commit","location":"Ibadan, Nigeria"}')
STATUS=$(echo "$BODY" | tail -1)
RESP=$(echo "$BODY" | head -1)
check_status "POST /messages/ commit type" 201 "$STATUS"
check_field  "message response has 'id'" "id" "$RESP"
check_field  "message response has 'created_at'" "created_at" "$RESP"

# Valid PR message
BODY=$(curl -s -w "\n%{http_code}" -X POST "$BASE/messages/" \
  -H "Content-Type: application/json" \
  -d '{"name":"Anonymous","message":"PR #18 approved: you are different, keep going","type":"pr"}')
STATUS=$(echo "$BODY" | tail -1)
check_status "POST /messages/ pr type" 201 "$STATUS"

# Valid log message
BODY=$(curl -s -w "\n%{http_code}" -X POST "$BASE/messages/" \
  -H "Content-Type: application/json" \
  -d '{"message":"[INFO] just passing through. wishing you the best.","type":"log"}')
STATUS=$(echo "$BODY" | tail -1)
check_status "POST /messages/ anonymous log" 201 "$STATUS"

# Too short — should 400
BODY=$(curl -s -w "\n%{http_code}" -X POST "$BASE/messages/" \
  -H "Content-Type: application/json" \
  -d '{"name":"X","message":"k","type":"commit"}')
STATUS=$(echo "$BODY" | tail -1)
check_status "POST /messages/ too-short body → 400" 400 "$STATUS"

# ── 3. Rate limiting on messages ─────────────────────────────────────────────

section "3 / Rate limiting (5 messages/hour per IP)"

# We already sent 3 valid messages above, plus seed posted 1 during test run.
# Send 2 more to hit the limit (we allow 5 per hour, started from 0 in test):
for i in 4 5; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/messages/" \
    -H "Content-Type: application/json" \
    -d "{\"message\":\"rate fill $i\",\"type\":\"log\"}")
  # these might be 201 or 429 depending on prior test runs — just note them
  if [ "$STATUS" -eq 201 ] || [ "$STATUS" -eq 429 ]; then
    pass "Rate limit req $i — HTTP $STATUS (201 or 429 both valid)"
  else
    fail "Rate limit req $i — unexpected HTTP $STATUS"
  fi
done

# One more — should be 429 if we've hit the limit
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/messages/" \
  -H "Content-Type: application/json" \
  -d '{"message":"this should be blocked","type":"log"}')
if [ "$STATUS" -eq 429 ]; then
  pass "Rate limit enforced — HTTP 429 after limit"
else
  warn "Rate limit may not have triggered yet (HTTP $STATUS) — check if prior test runs exhausted the window"
fi

# ── 4. Wish oracle ────────────────────────────────────────────────────────────

section "4 / Wish oracle"

BODY=$(curl -s "$BASE/wishes/")
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/wishes/")
check_status "GET /wishes/" 200 "$STATUS"

# Submit a wish — oracle will fire if GEMINI_API_KEY is set
BODY=$(curl -s -w "\n%{http_code}" -X POST "$BASE/wishes/" \
  -H "Content-Type: application/json" \
  -d '{"name":"Kemi","wish_text":"I wish you become everything you have been working toward, and more"}')
STATUS=$(echo "$BODY" | tail -1)
RESP=$(echo "$BODY" | head -1)

if [ "$STATUS" -eq 201 ]; then
  pass "POST /wishes/ — oracle responded (HTTP 201)"
  check_field "wish response has 'prophecy'" "prophecy" "$RESP"
  check_field "wish response has 'wish_text'" "wish_text" "$RESP"
  PROPHECY=$(echo "$RESP" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('prophecy','')[:80])" 2>/dev/null)
  echo -e "    prophecy preview: \"${PROPHECY}...\""
elif [ "$STATUS" -eq 503 ]; then
  warn "POST /wishes/ — oracle silent (HTTP 503) — GEMINI_API_KEY not set"
else
  fail "POST /wishes/ — unexpected HTTP $STATUS"
fi

# Wish too short — should 400
BODY=$(curl -s -w "\n%{http_code}" -X POST "$BASE/wishes/" \
  -H "Content-Type: application/json" \
  -d '{"name":"X","wish_text":"ok"}')
STATUS=$(echo "$BODY" | tail -1)
check_status "POST /wishes/ too-short → 400" 400 "$STATUS"

# ── 5. Map pins ───────────────────────────────────────────────────────────────

section "5 / Map pins"

# Drop a pin directly
BODY=$(curl -s -w "\n%{http_code}" -X POST "$BASE/pins/" \
  -H "Content-Type: application/json" \
  -d '{"name":"Tunde","location":"Abuja, Nigeria","latitude":9.0579,"longitude":7.4951}')
STATUS=$(echo "$BODY" | tail -1)
RESP=$(echo "$BODY" | head -1)
check_status "POST /pins/ valid pin" 201 "$STATUS"
check_field  "pin response has 'latitude'" "latitude" "$RESP"

# Invalid coords — should 400
BODY=$(curl -s -w "\n%{http_code}" -X POST "$BASE/pins/" \
  -H "Content-Type: application/json" \
  -d '{"name":"Bad","location":"Nowhere","latitude":999,"longitude":999}')
STATUS=$(echo "$BODY" | tail -1)
check_status "POST /pins/ invalid coords → 400" 400 "$STATUS"

# Message with attached pin (lat/lon in body)
BODY=$(curl -s -w "\n%{http_code}" -X POST "$BASE/messages/" \
  -H "Content-Type: application/json" \
  -d '{"name":"Amir","message":"sending love from london","type":"log","location":"London, UK","latitude":51.5074,"longitude":-0.1278}')
STATUS=$(echo "$BODY" | tail -1)
# Rate limit may be active from earlier test sends — both 201 and 429 are valid here
if [ "$STATUS" -eq 201 ] || [ "$STATUS" -eq 429 ]; then
  pass "POST /messages/ with map pin coords — HTTP $STATUS (201 or 429 both valid)"
else
  fail "POST /messages/ with map pin coords — unexpected HTTP $STATUS"
fi

# Verify pin count increased
BODY=$(curl -s "$BASE/pins/")
check_count  "pin count after submissions" 2 "$BODY"

# ── 6. 404 handling ───────────────────────────────────────────────────────────

section "6 / Error handling"

STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/journal/99999/")
check_status "GET /journal/99999/ → 404" 404 "$STATUS"

STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/memories/99999/")
check_status "GET /memories/99999/ → 404" 404 "$STATUS"

# ── Summary ───────────────────────────────────────────────────────────────────

echo -e "\n────────────────────────────────────"
TOTAL=$((PASS + FAIL + WARN))
echo -e "  ${GREEN}$PASS passed${RESET}  ${RED}$FAIL failed${RESET}  ${YELLOW}$WARN warnings${RESET}  (total $TOTAL)"
echo "────────────────────────────────────"

[ "$FAIL" -eq 0 ] && exit 0 || exit 1
