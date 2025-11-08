# Open Bosnia Data Portal

A free, open-source project providing structured public data about **Bosnia and Herzegovina** - cities, municipalities, postal codes, holidays, universities, and more.

Access the data via:

- **Web Interface** (React + Tailwind)
- **REST API** (Node.js + Express + PostgreSQL + Prisma)

## Project Overview

The goal is to make Bosnian public data **open, searchable, and developer-friendly** - similar to global open data portals, but focused on Bosnia and Herzegovina.

This project aims to:

- Centralize public datasets (cities, postal codes, universities, etc.)
- Provide a public REST API
- Offer a searchable and visual web frontend
- Encourage community collaboration and contributions keeping the data up to date

## Setup & Development

### 1. Clone the repository

```bash
git clone https://github.com/goran1010/bosnia-lens.git
cd bosnia-lens
```

### 2. Install dependencies

Install all dependencies for both backend and frontend:

```bash
npm run install:all
```

### 3. Environment variables

Create /backend/.env:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/bosnia-lens"
```

### 4. Setup database

```bash
cd backend
npx prisma migrate dev
```

### 5. Run development servers

```bash
# To run both dev servers (front end and back end) concurrently, in the root directory of the monorepo:
npm run dev
```

Or, to run only front-end or back-end dev servers separately:

```bash
# Backend only dev server
npm run start:backend
```

```bash
# Frontend only dev server
npm run start:frontend
```

## Contributing

Check out the CONTRIBUTING.md for guidelines on how to contribute data, code, or documentation.

## Roadmap

Phase 1 – MVP
Setup monorepo (backend + frontend)

/api/cities endpoint

Add /api/postalcodes

Basic frontend with city search

Deploy on Vercel / Render

Phase 2 – Data Expansion
Add holidays and universities

Enable JSON export

Add search and filters

Phase 3 – Community & Visualization
Auth for contributors/admins

Map integration (Leaflet)

Data submission dashboard

## License

This project is released under the MIT License.
All data used will be public domain or properly attributed to its original source.

## Contact

Created and maintained by @goran1010
