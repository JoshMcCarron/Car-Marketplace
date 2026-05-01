# Car Marketplace Design System

A warm, confident, taxi-yellow design language for **Car Marketplace** — a full‑stack vehicle e‑commerce app with a React frontend and Spring Boot backend. The current product ships with inline React styles and a few legacy palettes (teal `#335C67`, brick `#9E2A2B`, ochre `#E09F3E`); this design system is the migration target: a single yellow + black + white system, expressed via CSS variables, with Poppins as the type voice.

> Status: foundational. Ready for designers + engineers to migrate page‑by‑page.

---

## Sources consulted

- **Local codebase** (mounted): `src/components/*` — `LandingPage.js`, `Navbar.js`, `Catalog.js`, `VehicleDetails.js`, `Cart.js`, `Payment.js`, `LoginForm.js`, `RegisterForm.js`, `LoanCalculator.js`, `Chat/`, `services/api.js`. All pages use inline styles today.
- **GitHub repo:** `JoshMcCarron/Car-Marketplace` (`frontend/src/...` mirrors local). Backend is Spring Boot under `backend/`.
- **Brand direction (provided by user):** primary `#FECE14`, secondary black, white surfaces, **Poppins** typeface.

---

## Product surfaces

The frontend is a single React SPA with these routes:

| Route | Component | Purpose |
| --- | --- | --- |
| `/` | `LandingPage` | Marketing hero, login / register entry. |
| `/login`, `/register` | `LoginForm`, `RegisterForm` | Auth, returns JWT + user profile. |
| `/catalog` | `Catalog` | Vehicle grid with filters (brand, shape, year, on‑sale) + sort. Hot‑deals strip. |
| `/vehicle/:id` | `VehicleDetails` | Hero image, specs grid, CO₂ reveal card, reviews. |
| `/cart` | `Cart` | Line items, total, checkout CTA. |
| `/payment` | `Payment` | Personal info + card details form. |
| `/loan-calculator` | `LoanCalculator` | Standalone calculator. |
| (overlay) | `Chat/Chat` | Floating bot widget, bottom-right. |

There is **one product** — the customer‑facing storefront. The UI kit in `ui_kits/marketplace/` is the canonical recreation.

---

## Index

| File / folder | What's in it |
| --- | --- |
| `README.md` | This file. |
| `SKILL.md` | Agent‑Skill compatible entry point. |
| `colors_and_type.css` | All design tokens — colors, type, spacing, radii, shadows, motion. |
| `assets/` | Logos, illustrations, icon references. |
| `preview/` | Design‑system cards (one HTML per concept, registered for the Design System tab). |
| `ui_kits/marketplace/` | High‑fidelity React UI kit: components + interactive `index.html`. |

---

## Content fundamentals

**Voice** — Friendly storefront, not a luxury concierge. Reads like a confident dealership website: clear, action‑first, mildly enthusiastic. The bot greets with *"Welcome to Car Marketplace! How can I help you today?"* — that warmth is the target.

**Person & address** — Speak to the user directly: **"you" / "your cart"**, never "the customer". First person plural for the platform: **"we"**, **"our vehicles"**.

**Casing** — Title Case for buttons and section titles ("Add to Cart", "Hot Deals", "Loan Calculator"). Sentence case for body and helper text ("Please log in to add items to the cart."). Never ALL CAPS except for short tags / eyebrow labels (`HOT DEAL`, `NEW`).

**Tone examples (from the codebase):**
- Hero: *"Welcome to Car Marketplace"* / *"Browse and purchase quality vehicles"*
- Login: *"Welcome back!"* / *"Don't have an account? Sign up here!"*
- Empty state: *"Your cart is empty."*
- Filter prompt: *"No vehicles match your search criteria. Try adjusting your filters."*
- Bot suggestions: *"Show me Toyota vehicles"*, *"What are your hot deals?"*

**Numbers, money, units** — Prices use `$` prefix, no thousands separator in the current data model (`$24999`); the design system **standardises on `$24,999`** going forward. Mileage uses `km` suffix (`120,500 km`). Fuel uses `L/100km`. Year is the bare four‑digit value.

**Emoji** — Used sparingly and only for moments of delight: 🔥 marks Hot Deals, ⬆️ ⬇️ for sort direction, 💬 on the chat toggle. Never in body copy, headings, or error messages. Treat them as **product accents**, not punctuation.

**Vibe** — Approachable + practical. Like a clean used‑car lot run by people who actually know cars. Yellow signals attention and sale energy without screaming.

---

## Visual foundations

**Color** — One bold, one quiet. **Yellow `#FECE14`** is the accent — buttons, badges, sale flags, focus rings. **Black `#0E0E10`** is the structural color — type, borders on cards that need to feel premium, the navbar background. **White** and **warm cream `#FAF7EE`** carry the page. Warm grays (n50→n800) handle every neutral; do not introduce cool grays. Status colors are tuned warm: success a forest green, danger a brick red (replaces the old `#9E2A2B`), warning an amber that's deeper than the brand yellow so it's distinguishable.

**Type** — **Poppins** across the board. Display weights 700/800 with tight tracking (-0.02em). Body 400/500. The product mixes UI text and price callouts; prices are always **semibold or bold** to anchor attention.

**Backgrounds** — Mostly flat white or `--color-bg-2` (n50) for sections. The hero uses warm cream (`--color-bg-tinted`) or solid black with yellow type. **No gradients** in product UI; the legacy chat used a magenta gradient — this is removed in the new system. Photography is the only "rich" background: full‑bleed vehicle photography on hero and detail pages, otherwise solid surfaces.

**Imagery vibe** — Warm, daylight, slightly contrasty. Cars on neutral / asphalt / studio backdrops. Avoid moody blue‑hour or heavy color grading. When a real photo isn't available, use a warm gray placeholder card (`--color-n100`) with a small mono icon — never an SVG illustration.

**Animation** — Subtle, fast, functional. `--dur-base: 200ms` with `--ease-out` for hovers; `--dur-slow: 320ms` for panel transitions. No bouncing, no parallax, no spring physics. The chat toggle has a 1.05 hover scale — that's the maximum playfulness.

**Hover states** — Buttons darken (yellow → `--color-yellow-hover`), text links underline, cards lift via shadow (`--shadow-sm` → `--shadow-md`) and **never** translate up. Outline buttons fill on hover. Nav links get a subtle bg tint (`rgba(0,0,0,0.06)`).

**Press states** — Buttons drop to `--color-yellow-press` and scale to 0.98. No color change on outline buttons; just the scale.

**Focus** — 2px solid `--color-yellow` ring with a 2px offset. Always visible — accessibility is non‑negotiable on a transactional site.

**Borders** — 1px `--color-border` (n200) for most surfaces. 2px `--color-black` for "premium" emphasis (chosen vehicle, primary card on detail page). Sale cards use 2px `--color-sale`.

**Shadows** — Five‑step ramp from `--shadow-xs` (hairline) to `--shadow-lg` (modal). All warm‑black tinted. A dedicated `--shadow-yellow` (rgba 254,206,20,0.35) is used on the primary CTA at hover for a confident glow — this is the system's signature.

**Corner radii** — Generous but not pillowy. `--radius-md: 10px` is the default for cards and inputs (matches what's already shipping). Pills (`--radius-pill`) for chips and the chat input. Avoid nesting different radii at different scales in one card.

**Cards** — White surface, 1px n200 border, `--radius-md`, `--shadow-sm` at rest. Vehicle cards have a 16:10 image area on top, content padding `--space-4` to `--space-5`. Hot‑deal cards swap the border for 2px `--color-sale`.

**Layout rules** — Max content width `1200px`, gutter `--space-5`. Catalog uses a 250px sidebar + auto‑grid (`minmax(260px, 1fr)`). Navbar is fixed-feel (sticky top), 64px tall, full‑width black. The chat widget is fixed bottom‑right, 20px inset.

**Transparency / blur** — Used only for one thing: the floating chat panel uses an opaque white surface — no blur. There is no glassmorphism in this system. Filter chips on the catalog use solid `--color-bg-3`, not transparency.

**Density** — Comfortable, not tight. Inputs are 44px tall. Buttons 44–48px. Forms stack with `--space-4` gaps.

---

## Iconography

**Approach** — The codebase **does not ship an icon system today**. The few "icons" present are emoji (🔥 for hot deals, 💬 for chat, ⬆️ ⬇️ for sort). The chat toggle uses the `×` glyph for close.

**Going forward** — Adopt **Lucide** (CDN: `https://unpkg.com/lucide@latest`) as the primary icon set. Lucide is open‑source, has a 1.5px stroke that pairs cleanly with Poppins, and covers every storefront need (cart, search, filter, fuel, gauge, calendar, message‑circle, user, log‑in, etc.). 24px default, 20px in dense rows, 16px inside chips. Stroke color inherits from `currentColor` — set the parent's `color` to control it.

> **Substitution flag:** Lucide is a substitution, not a copy of an existing system. The repo had no SVG icon set to import. Approve or swap before shipping.

**Emoji use** — Keep 🔥 for sale energy. Replace 💬 with a Lucide `message-circle` icon. Replace sort arrows ⬆️ ⬇️ with `arrow-up` / `arrow-down`. No emoji in error states.

**Logo** — There is no real logo in the codebase (`src/logo.svg` is the default Create‑React‑App atom). The system ships a wordmark placeholder — bold "Car Marketplace" in Poppins 800 with a yellow underline accent — until a real mark is provided. **Asked: please supply a logo file (SVG preferred).**

---

## Caveats

1. **Legacy palette mismatch.** The shipped code uses teal `#335C67`, brick `#9E2A2B`, ochre `#E09F3E`. The new system uses yellow + black + white. The UI kit recreates pages in the **new** system; the live React code will need a migration pass.
2. **No real logo.** Placeholder wordmark only. Please provide one.
3. **Iconography substitution.** Lucide CDN, since no icon system was found in the repo.
4. **Poppins from Google Fonts CDN** — no local `.ttf` checked in. Switch to local fonts if offline rendering is required.
5. **No vehicle photography.** Cards in the UI kit show warm‑gray placeholder tiles. Drop real images into `assets/vehicles/` and the kit will use them.
