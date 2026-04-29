# Car Marketplace

A full-stack e-commerce platform for browsing and purchasing vehicles. The backend is a REST API built with Spring Boot and secured with JWT authentication; the frontend is a React single-page application.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Java 17 |
| Framework | Spring Boot 3.4 |
| Security | Spring Security 6, JWT (jjwt 0.12.6) |
| Persistence | Spring Data JPA / Hibernate, PostgreSQL |
| Validation | Jakarta Bean Validation |
| Frontend | React |
| Deployment | AWS EC2 |

---

## Project Structure

```
Car-Marketplace/
├── backend/      # Spring Boot REST API
└── frontend/     # React SPA
```

---

## Running Locally

### Backend

```bash
cd backend
mvn spring-boot:run
```

The API starts on `http://localhost:8080`. See **Database Setup** below before running for the first time.

### Frontend

```bash
cd frontend
npm install
npm start
```

The React app starts on `http://localhost:3000`.

---

## API Overview

### Authentication (`/auth` — public)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Create account, returns JWT |
| POST | `/auth/login` | Sign in, returns JWT |

All subsequent requests require the header:
```
Authorization: Bearer <token>
```

### Vehicles (`/vehicles`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/vehicles` | Public | List vehicles with optional filters (`brand`, `shape`, `modelYear`, `vehicleHistory`, `onSale`) and sorting (`sortBy`, `direction`) |
| GET | `/vehicles/{id}` | Public | Get vehicle by ID |
| POST | `/vehicles` | Admin | Create vehicle |
| PUT | `/vehicles/{id}` | Admin | Update vehicle |
| DELETE | `/vehicles/{id}` | Admin | Delete vehicle |

### Cart (`/users/{userId}/cart`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/users/{userId}/cart` | Owner / Admin | View cart |
| POST | `/users/{userId}/cart/{vehicleId}` | Owner / Admin | Add vehicle |
| DELETE | `/users/{userId}/cart/{vehicleId}` | Owner / Admin | Remove vehicle |
| POST | `/users/{userId}/cart/checkout` | Owner / Admin | Checkout |

### Orders (`/users/{userId}/orders`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/users/{userId}/orders` | Owner / Admin | List all orders for a user |
| GET | `/users/{userId}/orders/{orderId}` | Owner / Admin | Get a single order by ID |

Orders are created automatically when a cart checkout succeeds. Each order captures a snapshot of the purchased vehicles, the total price, the timestamp (`orderDate`), and a `status` field (currently always `"COMPLETED"`).

### Reviews (`/vehicles/{vehicleId}/reviews`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/vehicles/{vehicleId}/reviews` | Public | List reviews for a vehicle |
| POST | `/vehicles/{vehicleId}/reviews/{userId}` | Owner / Admin | Submit review |

### Chatbot (`/chat` — public)

```
POST /chat
{ "message": "show me tesla vehicles" }
```

Supports natural-language queries for vehicle lookup, loan calculations, and inventory browsing.

---

## Architecture

```
Request
  └── JwtAuthenticationFilter       # validates Bearer token, sets SecurityContext
        └── SecurityConfig          # route-level rules (public vs authenticated)
              └── Controller        # @PreAuthorize for ownership / role checks
                    └── Service     # business logic, typed exceptions
                          └── Repository  # Spring Data JPA (Specifications for filtering)
```

**Key design decisions:**

- **Stateless JWT** — no server-side sessions; identity is verified on every request from the token
- **BCrypt password hashing** — passwords are never stored or returned in plaintext; `@JsonIgnore` on `User.password`
- **Role-based + ownership access control** — `ROLE_ADMIN` or account owner required for user/cart mutations; a `UserSecurity` component exposes `isOwner()` for `@PreAuthorize` expressions
- **Database-level filtering** — vehicle search uses JPA `Specification` predicates pushed to PostgreSQL rather than loading all rows into memory
- **Global exception handler** — `@RestControllerAdvice` maps typed exceptions to consistent JSON error responses (`timestamp`, `status`, `error`, `message`)

---

## Database Setup

Requires a running PostgreSQL instance with a database named `car_marketplace`.

```sql
CREATE DATABASE car_marketplace;
```

The app reads connection details from environment variables. `DB_PASSWORD` has no default and **must be set** before starting the backend — the other variables fall back to the defaults shown.

| Variable | Default | Description |
|---|---|---|
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_NAME` | `car_marketplace` | Database name |
| `DB_USER` | `postgres` | Database username |
| `DB_PASSWORD` | *(none — required)* | Database password |

**Set `DB_PASSWORD` before running the app:**

Windows PowerShell:
```powershell
$env:DB_PASSWORD="yourpassword"
```

Mac/Linux:
```bash
export DB_PASSWORD=yourpassword
```

> Tests use an H2 in-memory database and do not require PostgreSQL to be running.

---

## Planned Improvements

- **Docker** — containerize backend and frontend with a `docker-compose.yml` for one-command local setup
- **Flyway** — replace `ddl-auto=update` with versioned schema migrations
- **CI/CD** — GitHub Actions pipeline for automated build, test, and deployment on push to `main`
- **Stripe integration** — replace the stub `PaymentService` with real Stripe payment processing
