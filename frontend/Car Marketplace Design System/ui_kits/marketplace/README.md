# Car Marketplace UI Kit

A high‑fidelity, click‑through recreation of the Car Marketplace storefront in the **new** design language (yellow + black + white, Poppins). All routes from the live React app are represented:

- **Landing** — hero with primary CTAs.
- **Login** — email + password form on a warm cream surface.
- **Catalog** — sidebar filters + sort, hot‑deal strip, vehicle grid.
- **Vehicle Details** — image, specs, CO₂ reveal, reviews.
- **Cart** — line items + checkout total.
- **Payment** — personal + card form, success state.
- **Chat** — floating bot widget, available globally.

Open `index.html` to walk the prototype. State is fake (mock vehicles, mock reviews) — every interaction works visually, nothing hits a backend.

## Files

- `index.html` — entry point, wires the components into a router.
- `app.jsx` — top‑level shell + screen routing.
- `components.jsx` — small, reusable atoms (Button, Input, Badge, Card, Logo).
- `Navbar.jsx`
- `LandingPage.jsx`
- `LoginPage.jsx`
- `CatalogPage.jsx`
- `VehicleDetailsPage.jsx`
- `CartPage.jsx`
- `PaymentPage.jsx`
- `ChatWidget.jsx`
- `data.js` — mock vehicle list + reviews.

All styles come from `../../colors_and_type.css` plus a small `kit.css` for kit‑specific layout.
