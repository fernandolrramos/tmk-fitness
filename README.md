# TMK Fitness — App (Prototype)

A mobile-first, bilingual (🇳🇴 Norsk / 🇬🇧 English) **installable PWA** for
**TMK Fitness**, a real gym in Avaldsnes on Karmøy, Norway. It's a clickable
prototype built to pitch a custom app to the gym owner. It ships two full
experiences behind a login — a **member app** and a **staff/admin console** —
and uses TMK Fitness's **real logo, favicon, brand, classes, trainers and
membership plans**. It runs on a real **Supabase** backend (Postgres + Auth +
Row Level Security) and deploys on **Vercel**.

> Live app. Bookings, profile edits, admin CRUD, attendance check-ins and
> two-way messaging persist to **Supabase** and sync across devices in real
> time. Sign-in uses **Supabase Auth**. The official logo/favicon are pulled
> from tmkfitness.no.

---

## 🔑 Two experiences, one login

Open the app → **Login** screen. Two demo accounts are seeded (password
`demo1234`); the role picker prefills them:

- **Medlem / Member** → `sara.vikingstad@example.no` → the member app (bottom-tab
  navigation).
- **Ansatt / Admin** → `admin@tmkfitness.no` → the staff console (sidebar on
  desktop, bottom-tab on mobile).

**Log out** from the Profile page (member) or the admin menu to switch accounts.

### 🏃 Member app

- **Home** — personalised greeting, membership chip, a **live countdown** to
  your next booked class, a swipeable carousel of upcoming classes, quick-action
  tiles, and a daily motivation quote (rotates by day-of-year).
- **Schedule / Timeplan** — scrollable day pills (localised weekday names),
  colour-coded spots-left, a **booking bottom sheet** with a checkmark success
  animation. Booking instantly appears on Home with a live countdown.
- **My classes / Mine timer** — upcoming + past bookings, cancel a booking.
- **Class detail** — hero, description, next sessions, book from here.
- **Trainers** — Knut Martin & Michel, with bios, specialties and a PT CTA.
- **Treatment & PT** — book a 1:1 slot with Michel (massage, cupping,
  stretching, PT coaching) with its own slot-picker + success state.
- **Membership** — current plan, what's included, upgrade options.
- **Contact** — real address (Helganesveien 34, Avaldsnes), phones, email,
  opening hours, maps link, socials.
- **Community / Fellesskap** — the engagement engine (see below): weekly
  streak, a gym-wide monthly challenge, a leaderboard, and a social activity
  feed with "Heia!" cheers. Streaks and progress can be **shared to Facebook /
  Instagram** (Web Share API + copy-caption fallback).
- **Messages / Meldinger** — in-app chat: start a conversation with a **specific
  coach** *or* the shared **"TMK Fitness" front-desk inbox** any staff member can
  answer. Thread list with unread badges (also on the header icon) and a
  full-screen conversation view; staff replies show **who answered**. Messages
  round-trip live to the admin inbox and back.
- **Profile** — **upload a profile photo** (centre-cropped + downscaled client
  side), editable name, searchable international dial-code picker (default 🇳🇴
  +47), plan picker, an animated **attendance progress ring**, **achievement
  badges**, a **share-your-progress** button, an **invite-a-friend** referral
  card, the language toggle. Edits persist across reloads.

### 🔥 Engagement & retention (why this app pays for itself)

The app is built to change behaviour, not just display a timetable. Each
feature maps to a booking/retention/revenue driver:

| Feature | Where | Behavioural driver | Business effect |
| --- | --- | --- | --- |
| **Weekly streak** | Home chip, Community, Profile | Loss aversion, habit loops | ↑ visit frequency → retention |
| **"Friends going"** avatars | Schedule rows, booking sheet, Home nudge | Social proof | ↑ bookings, fills quiet classes |
| **"Heia!" cheers** | Community feed | Reciprocity, belonging | ↑ daily opens, stickiness |
| **Monthly challenge** (collective) | Community | Shared inclusive goal | "healthier together", no shaming |
| **Leaderboard** | Community | Status, friendly competition | ↑ sessions among motivated members |
| **Achievement badges** | Profile | Progress, dopamine | ↑ long-term retention |
| **Invite a friend** referral | Profile | Acquisition loop | ↑ new paying members |

The social design leads with **support** (cheers + a collective challenge
everyone contributes to) so it reads "stronger together," with the leaderboard
as a lighter, opt-in-feeling touch. Every interaction — cheering, joining the
challenge, copying a referral code — works live on local state and persists
across refresh.

### 🛠️ Admin console

- **Dashboard** — KPI cards (active members, weekly bookings, fill rate, monthly
  revenue), today's classes with fill bars, members-by-plan bars, recent
  signups.
- **Timetable** — full CRUD over sessions (create / edit / delete, set class,
  day, time, instructor, capacity, free-for-members).
- **Bookings & attendance** — pick a class → see its roster → toggle check-ins,
  "X present" and spots-filled figures.
- **Inbox** — every member message in one place (front-desk *and* per-coach),
  with unread badges and a filter by recipient; open a thread to **reply as
  staff**. This is where trainers/admins receive and answer messages.
- **Members** — CRM: search, status filters, add / edit / delete members.
- **Trainers** — register / edit / remove trainers; changes appear instantly on
  the member side (Trainers list, trainer detail, and the message-recipient
  picker). Mark a trainer non-contactable to hide them from messaging.
- **Plans** — prices & packages with member counts and estimated monthly
  revenue per plan.

Admin edits are persisted (localStorage), so they survive a refresh during the
demo.

### 🌍 Everywhere

- **Bilingual, Norwegian by default.** A single typed i18n dictionary
  (`src/i18n/translations.ts`) holds every UI string in both languages. The
  segmented **NO | EN** control flips all copy — including dates/times, formatted
  with `Intl` using `nb-NO` / `en-GB`. Choice persists to `localStorage`.
- **Real PWA.** Web manifest with maskable 192/512 icons generated from TMK's
  official runner mark, app shortcuts, offline precaching, runtime caching for
  fonts/images, and an **"update available"** toast when a new service worker is
  waiting.
- **Native feel.** iOS safe-area padding, pinch-zoom locked, and tasteful
  framer-motion (route transitions, card entrances, the countdown tick, booking
  success, the progress ring).

---

## 🧱 Tech stack

| Concern    | Choice                                                      |
| ---------- | ----------------------------------------------------------- |
| Build      | Vite + React 18 + TypeScript (strict)                       |
| Routing    | React Router v6 (role-guarded routes + layout outlets)      |
| Styling    | Tailwind CSS (brand tokens in `tailwind.config.ts`)         |
| Animation  | framer-motion                                               |
| PWA        | vite-plugin-pwa (Workbox)                                   |
| i18n       | Typed dictionary + `LanguageContext` (no library)           |
| State      | Typed React contexts + `localStorage`                       |

### Project layout

```
src/
├── components/         # Header, BottomNav, ClassRow, BookingSheet, Countdown …
│   └── ui/             # Modal, StatusBadge, Field — shared primitives
├── layouts/            # MemberLayout (tabs), AdminLayout (sidebar + tabs)
├── pages/              # Login, Home, Schedule, Bookings, Profile, ClassDetail,
│   │                   #   Trainers, TrainerDetail, Treatment, Membership, Contact
│   └── admin/          # Dashboard, Timetable, Bookings, Members, Plans
├── context/            # LanguageContext, AuthContext (auth stub + role),
│                       #   AdminDataContext (CRUD store), BookingContext
├── i18n/               # translations.ts — every UI string, no + en
├── data/               # seed data: classes, timetable, plans, trainers, members,
│                       #   member, treatments, roster, gymInfo, quotes, dialCodes
├── hooks/              # useLocalStorage, useCountdown, useInstallPrompt
├── lib/                # dates.ts (Intl formatters), insights.ts (KPI maths)
└── types/              # shared domain types
```

Brand tokens (deep blue `#075586`, dark navy `#222d35`, teal `#449abb`, pink
`#ce7fb6`, **Rajdhani** headings + **Ubuntu** body) live in `tailwind.config.ts`.
The official logo/favicon are in `public/brand/`; PWA icons in `public/icons/`.

---

## 🚀 Run it

Requires Node 18+.

```bash
npm install
cp .env.example .env   # then fill in your Supabase URL + publishable key
npm run dev            # dev server (PWA enabled)
```

The app needs `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (Supabase →
Project Settings → API). Keep `VITE_DEMO_AUTH=false`. `.env` is git-ignored; the
publishable/anon key is safe to expose in the client bundle because Row Level
Security protects the data.

Open the printed local URL on your phone (same Wi-Fi) or in Chrome DevTools'
device mode. To try the installed experience:

```bash
npm run build
npm run preview  # production build with the service worker
```

Then use the browser's "Install app" / "Add to Home Screen" prompt.

### Regenerating brand icons

PWA icons are composited from TMK's official logo by a dependency-free script:

```bash
node scripts/gen-icons.mjs   # writes public/icons/*.png
```

---

## 🏗️ Backend architecture (Supabase)

The app is wired to a live Supabase project:

- **Postgres** — 15 tables for plans, classes, trainers, sessions, treatments,
  members, bookings, conversations/messages, activity feed and challenge. All
  bilingual `{no,en}` content is stored as JSONB. Existing string ids
  (`m-sara`, `s-mon-spin-am`, …) are the primary keys.
- **Supabase Auth** — email/password sign-in. A `profiles` table links each
  `auth.users` row to a `role` (`member` | `admin`) and, for members, a
  `member_id`. A trigger auto-creates the profile on sign-up.
- **Row Level Security** — every table has policies. Members read the catalogue
  and see/write only their own bookings, messages and profile; staff
  (`is_admin()`) manage everything. Helper functions `is_admin()` /
  `my_member_id()` are `SECURITY DEFINER` to avoid policy recursion.
- **Realtime** — `messages`, `conversations` and `bookings` are published for
  live cross-device chat and booking updates.

On the client, `src/lib/supabase.ts` is the single client, `src/lib/mappers.ts`
converts snake_case rows to the app's camelCase domain types, and each React
context (`AuthContext`, `AdminDataContext`, `BookingContext`,
`EngagementContext`, `MessagesContext`) hydrates from Supabase behind a splash
(`HydrationGate`) then serves data synchronously with optimistic write-through.

**Deploy:** hosted on **Vercel** (Vite preset). Set `VITE_SUPABASE_URL`,
`VITE_SUPABASE_ANON_KEY` and `VITE_DEMO_AUTH=false` as environment variables.

> Kept intentionally seed-backed for the demo: the personal streak and
> achievement badges (tied to the demo member). Everything else — bookings,
> messaging, "friends going", the leaderboard and admin KPIs — is live.

---

## 🗣️ One-paragraph pitch for the gym owner

**Norsk:**
> TMK Fitness har allerede et sterkt tilbud — 20 spinningsykler, personlig
> coaching, behandling, solarium og gratis sirkeltrening for pensjonister og
> uføre. Med en egen app får medlemmene alt dette i lomma: de ser timeplanen,
> booker plassen sin på sekunder, og får en levende nedtelling til neste økt.
> Men appen gjør mer enn å booke — den holder folk i gang. Medlemmene ser at
> vennene deres er påmeldt en time og blir med, de heier på hverandre, samler
> streaks og bidrar til en felles månedsutfordring. Jo mer de trener sammen,
> jo lenger blir de værende — og hvert medlem kan invitere venner rett fra
> appen. Samtidig får du som driver senteret en egen adminside med full oversikt
> over medlemmer, bookinger, oppmøte og omsetning. Alt på norsk og engelsk, med
> TMK sin egen logo og profil. Prototypen er fullt klikkbar i dag — neste steg
> er å koble den til en ekte database og publisere den.

**English:**
> TMK Fitness already has a strong offering — 20 spin bikes, personal coaching,
> treatment, solarium, and free circuit training for seniors. A dedicated app
> puts all of it in your members' pockets: they see the timetable, book their
> spot in seconds, and get a live countdown to their next session. But the app
> does more than book — it keeps people coming back. Members see their friends
> are going to a class and join them, they cheer each other on, build streaks,
> and contribute to a shared monthly challenge. The more they train together,
> the longer they stay — and every member can invite friends straight from the
> app. Meanwhile you get an admin side with a full view of members, bookings,
> attendance and revenue. It's fully bilingual (Norwegian and English) and wears
> TMK's own logo and identity. The prototype is fully clickable today — the next
> step is connecting it to a real database and publishing it.

---

*Built as a pitch prototype. The gym's logo, favicon, name, address, contact
details, classes, trainers and plans reflect TMK Fitness's real published
information. The demo member "Sara Vikingstad", the other sample members, the
placeholder timetable slots and opening hours are illustrative sample data.*
