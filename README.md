# Koded OS: v18 — Product Requirements Document

> **"This is the current state of Abdulrahman."**
>
> Not a birthday website. A personal operating system. A living archive. A digital identity.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Vision & Philosophy](#2-vision--philosophy)
3. [User Types](#3-user-types)
4. [Site Architecture & Routes](#4-site-architecture--routes)
5. [Tech Stack](#5-tech-stack)
6. [Feature Specs](#6-feature-specs)
   - [F-01: Boot Screen](#f-01-boot-screen)
   - [F-02: Main Dashboard](#f-02-main-dashboard)
   - [F-03: Contribution Graph (Memory Grid)](#f-03-contribution-graph-memory-grid)
   - [F-04: Fake Commit Feed](#f-04-fake-commit-feed)
   - [F-05: System Stats Panel](#f-05-system-stats-panel)
   - [F-06: Message Wall](#f-06-message-wall)
   - [F-07: Wish Oracle](#f-07-wish-oracle)
   - [F-08: World Map / Visitor Pins](#f-08-world-map--visitor-pins)
   - [F-09: Outside the Code](#f-09-outside-the-code)
   - [F-10: Roadmap to v20](#f-10-roadmap-to-v20)
   - [F-11: Digital Scrapbook](#f-11-digital-scrapbook)
   - [F-12: Music Player](#f-12-music-player)
   - [F-13: Easter Eggs](#f-13-easter-eggs)
   - [F-14: Birthday Countdown](#f-14-birthday-countdown)
7. [Data Models](#7-data-models)
8. [API Endpoints](#8-api-endpoints)
9. [Design System](#9-design-system)
10. [Deployment Architecture](#10-deployment-architecture)
11. [Build Phases](#11-build-phases)

---

## 1. Overview

| Field | Value |
|---|---|
| **Project Name** | Koded OS: v18 |
| **Type** | Personal interactive web experience |
| **Birthday** | May 31, 2026 |
| **Primary URL** | `kodedos.xyz` *(or similar)* |
| **Audience** | Friends, colleagues, the internet |
| **Goal** | A living digital archive of who Abdulrahman is at 17 entering 18 — interactive, emotional, technically impressive |

---

## 2. Vision & Philosophy

Koded OS: v18 sits at the intersection of four things:

- **Digital birthday experience** — shareable, alive, emotionally resonant
- **Personal operating system** — structured like a dev environment, not a portfolio
- **Interactive memory archive** — people can read, explore, and leave their mark
- **A glimpse into a mind** — reflective, honest, slightly mysterious

The aesthetic language is: GitHub × Linear × Vercel × Terminal.

The emotional language is: intentional, reflective, slightly vulnerable, deeply human.

**It should feel like accessing someone's system, not visiting their website.**

---

## 3. User Types

### Owner (Abdulrahman)
- Has full visibility of all sections
- Pre-populates memory graph, commits, journal entries, scrapbook, roadmap
- Can view and moderate all public messages

### Visitor (Anyone with the link)
- Can explore all read-only sections (contribution graph, commits, stats, roadmap, scrapbook, journal)
- Can interact with: Message Wall, Wish Oracle, World Map
- Cannot see moderation tools or private notes

---

## 4. Site Architecture & Routes

```
/                   → Boot screen (redirects to /home after sequence)
/home               → Main dashboard
/contributions      → Full memory grid view
/commits            → Expanded commit feed
/messages           → Message wall (read + write)
/oracle             → Wish oracle
/map                → World map visitor pins
/logs               → Outside the Code / journal
/roadmap            → Roadmap to v20
/archive            → Digital scrapbook
/system             → System stats panel
/terminal           → Hidden easter egg terminal
```

---

## 5. Tech Stack

### Frontend
| Layer | Choice | Reason |
|---|---|---|
| Framework | React (Vite) | Fast, composable |
| Styling | Tailwind CSS | Rapid utility-first dev |
| Animations | Framer Motion | Smooth cinematic transitions |
| Canvas / Map | React Simple Maps + D3 | World map pins |
| Terminal UI | xterm.js or custom | Boot screen, easter eggs |
| Hosting | Vercel | Zero-config, fast CDN |

### Backend
| Layer | Choice | Reason |
|---|---|---|
| Framework | Django + DRF | Already familiar, fast APIs |
| Database | PostgreSQL (Supabase) | Managed, free tier, realtime option |
| AI Integration | google gemini API (2.5 flash) | Wish oracle prophecy generation |
| File Storage | Cloudinary | Scrapbook images, voice notes |
| Hosting | Render | Django-friendly, free tier |

### Infrastructure
| Tool | Purpose |
|---|---|
| GitHub | Source control |
| Supabase | Postgres DB + optional realtime |
| Cloudinary | Media CDN |
| google gemini API | AI wish oracle |

---

## 6. Feature Specs

---

### F-01: Boot Screen

**Route:** `/` (auto-transitions to `/home`)

**Description:**
Full-screen black terminal that plays on first load. Sets the emotional and aesthetic tone for the entire experience.

**Behaviour:**
1. Page loads — black screen, blinking cursor
2. Terminal lines appear one-by-one, typewriter effect:
   ```
   booting koded_os_v18...
   loading memories...
   checking system integrity...
   initializing future...
   > all systems nominal.
   > welcome.
   ```
3. Optional: keyboard typing SFX (user can mute)
4. Fake progress bar fills to 100%
5. Auto-transition to `/home` after ~4 seconds OR user presses `ENTER` / clicks anywhere
6. First-time visitors only — subsequent visits skip to `/home` (localStorage flag)

**Design Notes:**
- Font: monospace (JetBrains Mono or Fira Code)
- Background: `#000000`
- Text: terminal green `#00FF41` with subtle glow
- Cursor: blinking block `█`

**Acceptance Criteria:**
- [ ] Typewriter animation plays in sequence, not all at once
- [ ] Skip on keypress or click
- [ ] Does not replay on page refresh (localStorage: `booted = true`)
- [ ] Mobile: animation still plays, tap to skip

---

### F-02: Main Dashboard

**Route:** `/home`

**Description:**
The OS home screen. A GitHub-profile-inspired layout that serves as the navigation hub and primary visual experience.

**Layout Sections (top to bottom):**
1. **Header bar** — `koded@os:~$` + nav links + mute button
2. **Hero block** — name, age, tagline, current status
3. **Contribution graph preview** (mini, 6-month view) → links to `/contributions`
4. **Recent commits** (5 items) → links to `/commits`
5. **System stats** (compact panel)
6. **CTA strip** — "Leave a message", "Make a wish", "Drop a pin"
7. **Footer** — build timestamp, version tag, faith note

**Design Notes:**
- Dark background, subtle grid or scanline texture
- Section dividers feel like terminal separators: `─────────────────`
- Hover states on all interactive elements
- Slight parallax or scroll-linked animation on hero

**Acceptance Criteria:**
- [ ] All sections visible without horizontal scroll on mobile
- [ ] Nav links work and feel like a terminal tab bar
- [ ] CTA strip links to correct public-interactive features

---

### F-03: Contribution Graph (Memory Grid)

**Route:** `/contributions`

**Description:**
The visual centrepiece. A GitHub contribution graph where each square is a memory, not a commit. Covers the last ~365 days (or age 17 → 18 period). Clicking any filled square opens a memory modal.

**Grid Behaviour:**
- Default: 52 columns (weeks) × 7 rows (days) = 364 squares
- Empty days render as very dark, unfilled squares
- Filled squares have colour based on memory category

**Colour Legend:**

| Colour | Category |
|---|---|
| Dark green | Major growth / achievement |
| Light green | Productive / consistent day |
| Blue | Emotional / relational moment |
| Yellow | Experimentation / ideation |
| Red | Difficult period / failure |
| Purple | Faith moment |
| Orange | Basketball / physical |

**Memory Modal (on square click):**

Each modal can contain any combination of:
- Title + date
- Short description / reflection
- Image (optional)
- Quote (optional)
- Code snippet (optional)
- Song / track name (optional)
- Voice note player (optional)
- Category badge

**Data:**
- Memories are pre-seeded by the owner via Django admin or a seed script
- Visitors can view, not edit

**Acceptance Criteria:**
- [ ] Grid renders all 364+ squares
- [ ] Empty squares do not open modals
- [ ] Modal opens with smooth animation
- [ ] Mobile: grid scrolls horizontally, squares are 12px minimum
- [ ] Colour legend is visible and accurate
- [ ] At least 30 pre-seeded memories at launch

---

### F-04: Fake Commit Feed

**Route:** `/commits`

**Description:**
A reverse-chronological feed of life events written as git commit messages. Pure storytelling in developer syntax.

**Commit Format:**
```
<type>(<scope>): <message>

timestamp | branch: life/main | tag: v17.x
```

**Commit Types:**
- `feat` — new chapter, new skill, new relationship
- `fix` — mindset shift, correcting a mistake
- `refactor` — identity or habit change
- `perf` — discipline, consistency improvements
- `chore` — daily grind
- `hotfix` — crisis management
- `revert` — lessons from going backwards
- `merge` — collaboration, friendships

**Example entries:**
```
feat(life): entered university as a 200-level CS student
fix(mindset): stopped chasing external validation
refactor(identity): learning who I am outside the code
perf(discipline): improved sleep consistency — 3 weeks straight
hotfix(hackathon): debugged Anchor contract at 2am, shipped at 4am
feat(team): founded Teenovatex Labs with Shaz and Anas
chore(grind): day 47 of DSA prep. still going.
```

**UI Notes:**
- Each commit is a card with monospace font
- Hover reveals full "diff" (expanded context or reflection)
- Filter by commit type (dropdown or tag pills)
- Timeline view option (vertical line, dot per commit)

**Data:**
- Seeded by owner. Static or DB-backed.

**Acceptance Criteria:**
- [ ] At least 20 commits at launch
- [ ] Filter by type works
- [ ] Each commit has at minimum: type, scope, message, timestamp
- [ ] Expanded hover/click state shows optional longer reflection

---

### F-05: System Stats Panel

**Route:** `/system` (also appears compact on `/home`)

**Description:**
A system monitoring panel styled like `htop` or a status dashboard. Shows personality stats and fun counters.

**Static Stats Block:**
```yaml
Name:            Abdulrahman Raufu
Handle:          Koded
Version:         18.0.0
Build Date:      May 31, 2026
Current Mission: Becoming undeniable
Status:          IN PROGRESS
Uptime:          18 years, 0 days
Location:        Lagos, Nigeria
Faith:           Muslim
```

**Dynamic / Fun Stats:**
```yaml
cgpa:                     4.59
all_nighters_survived:    [seeded number]
hackathons_entered:       [seeded]
hackathons_won:           [seeded]
bugs_created:             ∞
ideas_started:            [seeded]
ideas_shipped:            [seeded]
songs_on_repeat:          [seeded]
prayers_said:             countless
```

**Acceptance Criteria:**
- [ ] All stats visible on desktop and mobile
- [ ] Fun stats feel authentic, not forced
- [ ] Monospace font throughout
- [ ] Optional: animated number counters on scroll-into-view

---

### F-06: Message Wall

**Route:** `/messages`

**Description:**
The primary public interaction feature. Visitors leave messages framed as git operations. This becomes an emotional archive of birthday messages in developer language.

**Message Types (visitor selects one):**

| Type | Template |
|---|---|
| `commit` | `commit <hash>: <message>` |
| `pull request` | `PR #18 approved: <message>` |
| `issue` | `Issue #<n>: <message>` |
| `log` | `[INFO] <timestamp>: <message>` |

**Submission Form Fields:**
- Name (optional — can be anonymous)
- Message (max 280 characters)
- Type (commit / PR / issue / log)
- Location (text, optional — feeds into map pins F-08)

**Feed Display:**
- Reverse-chronological
- Each message renders as a terminal card
- Random commit hash generated for `commit` type
- Issue numbers auto-increment
- Real timestamp shown

**Moderation:**
- Owner can soft-delete messages via Django admin
- No auth required for visitors — rate-limited by IP (5 messages/hour)

**Acceptance Criteria:**
- [ ] Form submits without page reload (async)
- [ ] Success state shows submitted message immediately
- [ ] All message types render correctly in terminal style
- [ ] Rate limiting works
- [ ] Mobile form is usable
- [ ] At least one "seed" message so wall is not empty at launch

---

### F-07: Wish Oracle

**Route:** `/oracle`

**Description:**
Visitor types a birthday wish. The AI (Claude Sonnet) reads it and returns a mystical, slightly cryptic prophecy in response. All wishes + prophecies are saved in a gallery.

**Flow:**
1. Visitor lands on `/oracle` — dramatic intro text ("The Oracle is listening...")
2. Text input: "Type your wish for Abdulrahman..."
3. Submit — loading animation ("consulting the oracle...")
4. Response appears: the original wish + AI-generated prophecy
5. Both are saved to the DB and appear in the public Wishes Gallery below

**AI Prompt Design:**
```
System: You are a mystical oracle who responds to birthday wishes for a young software engineer named Abdulrahman (Koded) who is turning 18. You speak in short, cinematic, slightly cryptic prophecies — 2-4 sentences max. You reference themes of engineering, growth, faith, hustle, and the future. Never be generic. Always feel intentional.

User: The wish is: "{wish_text}"

Respond only with the prophecy. No preamble.
```

**Gallery:**
- Shows all submitted wishes + prophecies
- Cards with: wisher name (or "Anonymous"), wish, prophecy, timestamp
- Sorted newest first
- Shareable individual wish cards (OG image or copy link)

**Acceptance Criteria:**
- [ ] API call to google works, response under 5 seconds
- [ ] Loading state is shown during generation
- [ ] Wish + prophecy saved to DB on success
- [ ] Gallery updates in real-time (or on submit)
- [ ] Error state handled gracefully ("The Oracle is silent. Try again.")
- [ ] Rate limit: 3 wishes per IP per day

---

### F-08: World Map / Visitor Pins

**Route:** `/map`

**Description:**
An interactive world map showing where everyone wishing Abdulrahman a happy birthday is located. Every message left on the wall or wish submitted can optionally drop a pin.

**Pin Data:**
- Location name (text input, reverse-geocoded to coordinates via API)
- Auto-populated from message wall location field or oracle submission
- Visitor can also drop a pin directly on `/map` with just a name + location

**Map UI:**
- Dark-themed world map (matching OS aesthetic)
- Pins animate in on load
- Hover on pin: shows name + message snippet
- Cluster pins when zoomed out

**Acceptance Criteria:**
- [ ] Map renders on desktop and mobile
- [ ] Pins are clickable with tooltip
- [ ] Location input geocodes correctly
- [ ] Lagos (home) is always pinned as `@koded — home base`
- [ ] Works without exposing geocoding API key on frontend

---

### F-09: Outside the Code

**Route:** `/logs`

**Description:**
A reflective journal section. Raw, personal, written. Essays, thoughts, fears, philosophies, things learned at 17. This gives the project depth beyond the technical aesthetic.

**Structure:**
- List of journal entries (title + date + excerpt)
- Click → full entry page
- Entries written in Markdown, rendered on frontend

**Possible Entry Titles:**
- "Things I learned at 17"
- "Why I build"
- "On faith and ambition"
- "What burnout felt like"
- "People who shaped me"
- "What I'm scared of at 18"

**UI Notes:**
- Clean, readable — contrast to the terminal aesthetic of the rest of the site
- Serif font option for journal body text
- Subtle grain or paper texture on entry background

**Data:**
- Owner-written. Stored in DB as Markdown. Not editable by visitors.

**Acceptance Criteria:**
- [ ] At least 3 entries at launch
- [ ] Markdown renders correctly (headings, bold, lists, quotes)
- [ ] Entry list shows title, date, excerpt
- [ ] Mobile reading experience is comfortable

---

### F-10: Roadmap to v20

**Route:** `/roadmap`

**Description:**
A software-release-style roadmap for ages 18, 19, and 20. Personal milestones framed as version changelogs.

**Format:**

```
v18.0.0 — May 31, 2026 [CURRENT]
  - Build meaningful products people use
  - Secure Microsoft London internship
  - Deepen AI/ML systems knowledge
  - Become stronger mentally and physically
  - Grow Stackd with Koded to 20+ students

v19.0.0 — May 31, 2027 [PLANNED]
  - Launch first real startup
  - Robotics projects ship
  - 500k revenue milestone
  - Move closer to global opportunities

v20.0.0 — May 31, 2028 [VISION]
  - Financial freedom milestone
  - Global impact through products
  - Recognised name in African tech
  - (redacted — too ambitious to publish yet)
```

**UI Notes:**
- Vertical timeline layout
- Current version highlighted / pinned
- Future versions slightly dimmed / greyed
- Items render as checklist — owner can mark items `done` via admin
- Progress bars per version (% of items checked off)

**Acceptance Criteria:**
- [ ] All three versions visible
- [ ] Current version visually distinct
- [ ] Completed items visually strikethrough or checkmarked
- [ ] Mobile-friendly vertical layout

---

### F-11: Digital Scrapbook

**Route:** `/archive`

**Description:**
A polaroid-style photo gallery of the year. Screenshots, hackathon pics, random chats, basketball moments, code screenshots. Feels like archived fragments of age 17.

**Grid Layout:**
- Masonry grid of polaroid-style cards
- Each card: image + optional caption + date
- Slight rotation on each card (feels physical)
- Hover: card straightens, slight lift

**Categories (filter pills):**
- All / Hackathons / Code / People / Basketball / Random

**Data:**
- Images hosted on Cloudinary
- Metadata (caption, category, date) in DB
- Owner uploads via Django admin or seeding script

**Acceptance Criteria:**
- [ ] Masonry layout works on desktop and mobile
- [ ] Images lazy-load for performance
- [ ] Filter by category works
- [ ] At least 10 images at launch
- [ ] Hover animation is smooth

---

### F-12: Music Player

**Description:**
Ambient/cinematic/lofi soundtrack plays in the background. Tied to the emotional feel of the site.

**Behaviour:**
- Audio is muted by default — user must click to play (browser autoplay policy)
- Mute/unmute button always visible in top-right nav
- Playlist of 3–5 tracks, cycles through
- Track name + artist shown when playing
- Optional: different tracks tied to different sections

**Track Suggestions:**
- Tems — instrumentals
- Sarz beats
- Lofi hip-hop
- Cinematic ambient (Hans Zimmer adjacent)

**Implementation:**
- Host audio files on Cloudinary or a public CDN
- Use HTML5 `<audio>` with a custom React player wrapper

**Acceptance Criteria:**
- [ ] Audio does not autoplay (muted by default)
- [ ] User-toggled play/pause works
- [ ] Track cycles automatically on end
- [ ] Current track name is visible
- [ ] Does not block page performance

---

### F-13: Easter Eggs

**Description:**
Hidden interactions that reward curious visitors. This is what makes people screenshot and share.

**Easter Egg List:**

| Trigger | Effect |
|---|---|
| Konami Code (↑↑↓↓←→←→BA) | Unlocks secret `/terminal` page |
| Type `whoami` in any input on the site | Returns: *"Abdulrahman. Still figuring it out."* |
| Type `sudo reveal_truth` in terminal | Returns a hidden honest thought |
| Click the version number in footer 5× | Plays a hidden audio clip or shows a secret message |
| Visit `/404` | Custom page: fake kernel panic or `segmentation fault` |
| Visit `/sudo` | Fun access-denied terminal error |
| `meaning_of_life` command in terminal | Loads... loads... loads... `Error 418: I'm a teapot` |

**Terminal Page (`/terminal`):**
- Full-screen terminal emulator
- Accepts a set of known commands:
  - `help` — lists available commands
  - `whoami` — identity response
  - `ls memories/` — lists memory categories
  - `cat /logs/faith` — returns a faith-related note
  - `ping future` — returns a motivational or cryptic line
  - `clear` — clears terminal

**Acceptance Criteria:**
- [ ] Konami code detection works on desktop and mobile (swipe pattern on mobile)
- [ ] Terminal page has at least 8 working commands
- [ ] 404 page is custom and on-brand
- [ ] Easter eggs do not break normal flow

---

### F-14: Birthday Countdown

**Description:**
Before May 31: a countdown timer. After May 31: a "released successfully" message.

**Pre-birthday state:**
```
deploying in...
2 days, 14 hours, 32 minutes, 09 seconds
```

**On birthday (May 31, 2026):**
```
✓ koded_os_v18 deployed successfully.
  May 31, 2026 — 00:00:00

> happy birthday, Abdulrahman.
```

**Post-birthday:**
```
koded_os_v18 — released.
deployed 3 days ago.
```

**Placement:** Shown on `/home` hero section. Optional: boot screen shows countdown if pre-birthday.

**Acceptance Criteria:**
- [ ] Countdown is accurate to the second
- [ ] Transitions correctly at the exact birthday timestamp
- [ ] Timezone: WAT (UTC+1, Lagos)

---

## 7. Data Models

### `Memory`
```python
class Memory(models.Model):
    title       = models.CharField(max_length=200)
    description = models.TextField()
    date        = models.DateField()
    category    = models.CharField(max_length=50)  # growth, emotional, faith, etc.
    color       = models.CharField(max_length=20)   # hex or label
    image       = models.URLField(blank=True)
    quote       = models.TextField(blank=True)
    song        = models.CharField(max_length=200, blank=True)
    code_snippet = models.TextField(blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)
```

### `Commit`
```python
class Commit(models.Model):
    TYPE_CHOICES = [('feat','feat'),('fix','fix'),('refactor','refactor'),
                    ('perf','perf'),('chore','chore'),('hotfix','hotfix'),
                    ('revert','revert'),('merge','merge')]
    type        = models.CharField(max_length=20, choices=TYPE_CHOICES)
    scope       = models.CharField(max_length=100)
    message     = models.CharField(max_length=500)
    reflection  = models.TextField(blank=True)
    timestamp   = models.DateTimeField()
    branch      = models.CharField(max_length=100, default='life/main')
    tag         = models.CharField(max_length=50, blank=True)
```

### `Message`
```python
class Message(models.Model):
    TYPE_CHOICES = [('commit','commit'),('pr','pull request'),
                    ('issue','issue'),('log','log')]
    name        = models.CharField(max_length=100, blank=True, default='Anonymous')
    message     = models.TextField(max_length=280)
    type        = models.CharField(max_length=20, choices=TYPE_CHOICES)
    location    = models.CharField(max_length=200, blank=True)
    ip_hash     = models.CharField(max_length=64, blank=True)  # for rate limiting
    created_at  = models.DateTimeField(auto_now_add=True)
    is_visible  = models.BooleanField(default=True)
```

### `Wish`
```python
class Wish(models.Model):
    name        = models.CharField(max_length=100, blank=True, default='Anonymous')
    wish_text   = models.TextField(max_length=500)
    prophecy    = models.TextField()
    ip_hash     = models.CharField(max_length=64, blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)
```

### `MapPin`
```python
class MapPin(models.Model):
    name        = models.CharField(max_length=100, blank=True)
    location    = models.CharField(max_length=200)
    latitude    = models.FloatField()
    longitude   = models.FloatField()
    message_ref = models.ForeignKey(Message, null=True, blank=True, on_delete=models.SET_NULL)
    created_at  = models.DateTimeField(auto_now_add=True)
```

### `JournalEntry`
```python
class JournalEntry(models.Model):
    title       = models.CharField(max_length=200)
    content     = models.TextField()  # Markdown
    excerpt     = models.TextField(max_length=300)
    created_at  = models.DateTimeField(auto_now_add=True)
    is_public   = models.BooleanField(default=True)
```

### `ScrapbookItem`
```python
class ScrapbookItem(models.Model):
    CATEGORY_CHOICES = [('hackathon','Hackathon'),('code','Code'),
                        ('people','People'),('basketball','Basketball'),('random','Random')]
    image_url   = models.URLField()
    caption     = models.CharField(max_length=200, blank=True)
    category    = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    date_taken  = models.DateField(blank=True, null=True)
```

---

## 8. API Endpoints

All prefixed with `/api/v1/`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/memories/` | All memories (for contribution graph) |
| GET | `/memories/<id>/` | Single memory detail |
| GET | `/commits/` | All commits, supports `?type=feat` filter |
| GET | `/messages/` | All visible messages |
| POST | `/messages/` | Submit a new message |
| GET | `/wishes/` | All wishes + prophecies |
| POST | `/wishes/` | Submit a wish, triggers AI, returns prophecy |
| GET | `/pins/` | All map pins |
| POST | `/pins/` | Submit a map pin |
| GET | `/journal/` | All public journal entries |
| GET | `/journal/<id>/` | Single entry |
| GET | `/scrapbook/` | All scrapbook items, supports `?category=` |
| GET | `/stats/` | System stats (returns JSON for dynamic rendering) |

---

## 9. Design System

### Typography
| Use | Font | Size |
|---|---|---|
| Terminal / code / commits | JetBrains Mono | 13–15px |
| Body (journal, descriptions) | Inter | 16px |
| Journal entries (optional) | Lora (serif) | 18px |
| Section headers | Inter 500 | 20–28px |

### Colour Palette
| Token | Value | Use |
|---|---|---|
| `--bg-primary` | `#0A0A0A` | Page background |
| `--bg-surface` | `#111111` | Cards, panels |
| `--bg-elevated` | `#1A1A1A` | Modals, dropdowns |
| `--border` | `#2A2A2A` | Dividers, card borders |
| `--text-primary` | `#F0F0F0` | Main text |
| `--text-secondary` | `#888888` | Muted labels, timestamps |
| `--green-bright` | `#00FF41` | Terminal cursor, highlights |
| `--green-mid` | `#39D353` | Contribution graph (high) |
| `--green-dim` | `#0E4429` | Contribution graph (low) |
| `--blue-accent` | `#58A6FF` | Emotional memory, links |
| `--yellow-accent` | `#E3B341` | Experimentation, warnings |
| `--red-accent` | `#F85149` | Difficult period, errors |
| `--purple-accent` | `#BC8CFF` | Faith moments |
| `--orange-accent` | `#D29922` | Basketball / physical |

### Motion Principles
- Boot screen: typewriter with `setTimeout` stagger
- Page transitions: Framer Motion `AnimatePresence` with fade + slide
- Modal open: scale from 0.95 → 1, fade in
- Contribution squares: stagger animation on grid mount
- Commit cards: fade in on scroll (Intersection Observer)
- Map pins: drop-in animation on load

### Component Patterns
- All cards: `1px solid var(--border)`, `border-radius: 6px`, `bg: var(--bg-surface)`
- Terminal blocks: monospace, `bg: #000`, left border `3px solid var(--green-bright)`
- Buttons: ghost style — transparent bg, border, hover fills with dim green
- Section headers: preceded by `// ` or `> ` in terminal green

---

## 10. Deployment Architecture

```
Browser
   │
   ├── Vercel (React frontend)
   │     └── Calls Django API
   │
   └── Render (Django backend)
         ├── Supabase (PostgreSQL)
         ├── Cloudinary (images, audio)
         └── gemini API (wish oracle)
```

### Environment Variables

**Frontend (Vercel):**
```
VITE_API_BASE_URL=https://koded-os-api.onrender.com/api/v1
```

**Backend (Render):**
```
DATABASE_URL=postgresql://...
GEMINIAI_API_KEY=AI-ant-...
CLOUDINARY_URL=cloudinary://...
GEOCODING_API_KEY=...
ALLOWED_HOSTS=koded-os-api.onrender.com
CORS_ALLOWED_ORIGINS=https://kodedos.xyz
SECRET_KEY=...
```

---

## 11. Build Phases

### Phase 1 — Shell (Day 1–2)
- [ ] React app scaffolded (Vite + Tailwind + Framer Motion)
- [ ] Django project scaffolded (DRF, CORS, Supabase connected)
- [ ] Boot screen complete
- [ ] `/home` dashboard layout (static, no data yet)
- [ ] Design system tokens set up (colours, fonts, motion)
- [ ] Deployed: Vercel + Render (CI/CD)

### Phase 2 — Personal Content (Day 2–3)
- [ ] Contribution graph (seeded memories in DB)
- [ ] Commit feed (seeded, filterable)
- [ ] System stats panel
- [ ] Journal entries (at least 3 written + rendered)
- [ ] Roadmap to v20 (all 3 versions)
- [ ] Digital scrapbook (images uploaded to Cloudinary)
- [ ] Music player

### Phase 3 — Public Interactions (Day 3–4)
- [ ] Message wall (form + feed + rate limiting)
- [ ] Wish oracle (gemini API integration)
- [ ] World map (pins from messages + standalone)
- [ ] Birthday countdown timer

### Phase 4 — Polish & Secrets (Day 4–5)
- [ ] Easter eggs (Konami code, terminal page, 404)
- [ ] Mobile responsiveness audit
- [ ] Performance (lazy loading, image optimisation)
- [ ] SEO meta tags + OG image for share preview
- [ ] Final content pass (all journal entries, memories, commits written)

### Phase 5 — Ship (May 31)
- [ ] Domain pointed
- [ ] Soft launch to close people (May 30 night)
- [ ] Public drop on birthday

---

> *Built with intention. I AM KODED. version eighteen.*
>
> `koded_os_v18 — init commit — May 2026`