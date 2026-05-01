---
name: car-marketplace-design
description: Use this skill to generate well-branded interfaces and assets for Car Marketplace, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick reference

- **Palette:** Yellow `#FECE14` primary, Black `#0E0E10`, White, warm Cream `#FAF7EE`. Warm gray neutrals only. See `colors_and_type.css` for the full token list.
- **Typeface:** Poppins (Google Fonts). 800 for display, 700 for H1, 600 for buttons / titles, 400/500 for body.
- **Tokens:** Always import `colors_and_type.css` rather than redefining colors or sizes. Use CSS variables, not inline styles.
- **Components:** See `ui_kits/marketplace/` — Navbar, Buttons, Inputs, Vehicle Cards, Badges, Chat Widget. Lift the JSX into prototypes; the kit is hand-rolled and dependency-free besides React.
- **Iconography:** Lucide via CDN (`https://unpkg.com/lucide@latest`). 1.75 stroke. `currentColor` for fill.
- **Voice:** Friendly storefront; "you / your cart"; Title Case buttons; sentence case body. Emoji used sparingly (🔥 hot deals, 💬 chat).
- **No-go list:** No gradients, no glassmorphism, no bouncy animations, no cool grays, no purple/teal. The legacy red `#9E2A2B` and teal `#335C67` are out.
