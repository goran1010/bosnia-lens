# Bosnia Lens

A free, open-source project providing structured public data about Bosnia and Herzegovina through a REST API and a React web interface. The current implemented dataset is postal codes, with universities as a planned addition and focus of the project.

LIVE Web app at - <https://bosnia-lens.netlify.app/>

REST API at - <https://round-leann-goran-jovic-1010-ccad2ae8.koyeb.app/api>

For more info on how to connect your app to the REST API, visit - <https://bosnia-lens.netlify.app/api-docs>

## Table of Contents

- [Features](#features)
- [Data Coverage](#data-coverage)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [API Overview](#api-overview)
- [Running the Tests](#running-the-tests)
- [Deployment](#deployment)
- [Built With](#built-with)
- [Current Status](#current-status)
- [Contributing](#contributing)
- [Authors](#authors)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Features

- **Versioned REST API**: Public endpoints under `/api/v1`
- **Postal Code Search**: Browse all postal codes or search by code and city name
- **Session Authentication**: Passport-based auth with signup, login, logout, and email confirmation
- **Role-based Access**: Contributor and admin roles with protected dashboards for data management
- **CSRF Protection**: Synchronised CSRF tokens required for all mutating requests to authenticated routes

## Data Coverage

- Postal codes (implemented)
- Universities (frontend route placeholder, planned dataset - target focus of the project)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Before running this project, you need to have the following installed:

- Node.js 24.x
- PostgreSQL database server
- npm package manager

```bash
node --version
npm --version
psql --version
```

### Installing

A step by step series of examples that tell you how to get a development environment running.

Clone the repository:

```bash
git clone https://github.com/goran1010/bosnia-lens.git
cd bosnia-lens
```

Install all dependencies for both backend and frontend:

```bash
npm run install:all
```

Set up environment variables:

The repository includes example environment files for both services. Copy them and fill in real values before running the app:

Backend: copy `backend/.env.example` to `backend/.env` and edit the values.

```bash
cp backend/.env.example backend/.env
# edit backend/.env
```

Backend env layout:

- `NODE_ENV`: app mode, usually `development`
- `PORT`: backend port, usually `3000`
- `FRONTEND_URL`: frontend origin allowed by CORS, usually `http://localhost:5173`
- `BACKEND_URL`: backend's own publicly reachable URL, used for building email confirmation links, usually `http://localhost:3000`
- `DATABASE_URL`: development PostgreSQL database
- `TEST_DATABASE_URL`: separate PostgreSQL database used by tests and test migrations
- `ACCESS_TOKEN_SECRET`: access token signing secret
- `REFRESH_TOKEN_SECRET`: refresh token signing secret
- `COOKIE_SECRET`: session/cookie secret
- `RESEND_API_KEY`: Resend API key for email confirmation
- `CLIENT_ID`: OAuth or external client id
- `CLIENT_SECRET`: OAuth or external client secret

The backend validates these variables on startup, so placeholder values should be replaced before running the app.

Frontend: copy `frontend/.env.example` to `frontend/.env` and update `VITE_BACKEND_URL` if needed.

```bash
cp frontend/.env.example frontend/.env
# edit frontend/.env (optional)
```

Frontend env layout:

- `VITE_BACKEND_URL`: backend base URL, usually `http://localhost:3000`
- `VITE_WEATHER_API_KEY`: weather API key used by the home page widget

Initialize the development database and generate the Prisma client:

```bash
npm run db:deploy_generate
```

Initialize the test database as well if you plan to run backend tests locally:

```bash
npm run db:test:deploy_generate
```

Seed the databases if needed:

```bash
npm run db:seed

# Seed test database
npm run db:test:seed
```

Start the development servers:

```bash
# Run frontend and backend together
npm run dev:all

# Or run them separately
npm run dev:backend
npm run dev:frontend
```

You should now be able to access the API at `http://localhost:3000` and the web interface at `http://localhost:5173`.

## Available Scripts

Run these from the repository root.

### Installation

- `npm run install:all`: install root, backend, and frontend dependencies

### Database

- `npm run db:deploy_generate`: apply development migrations and generate Prisma client
- `npm run db:generate`: generate Prisma client only
- `npm run db:seed`: seed the development database
- `npm run db:test:deploy_generate`: create/apply migrations for the test database and generate Prisma client in test mode
- `npm run db:test:seed`: seed the test database
- `npm run prisma_studio`: open Prisma Studio from the backend directory

### Development

- `npm run dev:all`: run backend and frontend together
- `npm run dev:backend`: run the Express backend with file watching
- `npm run dev:frontend`: run the Vite frontend dev server

### Testing

- `npm run test:all`: run backend and frontend tests together
- `npm run test:backend`: run backend tests
- `npm run test:frontend`: run frontend tests
- `npm run test:coverage:all`: run coverage for both apps
- `npm run test:coverage:backend`: backend coverage only
- `npm run test:coverage:frontend`: frontend coverage only

### Maintenance

- `npm run remove_merged`: delete local branches already merged into `main` or `master`

## API Overview

### Response format

All JSON API responses follow a consistent structure:

- Success responses use `data` and can include an optional `message`.
- Error responses use a nested `error.message`.

Success example:

```json
{
  "data": { "status": "ok" },
  "message": "API server is running"
}
```

Error example:

```json
{
  "error": {
    "message": "Validation failed: Postal codes must have 5 numbers Fix the highlighted fields and try again."
  }
}
```

### Public routes (no authentication required)

- `GET /api`: API status response
- `GET /api/v1`: versioned API status response
- `GET /api/v1/postal-codes`: list all postal codes
- `GET /api/v1/postal-codes/search?searchTerm=...`: search postal codes by numeric code or city name

## Running the tests

Backend tests use Vitest and Supertest. Frontend tests use Vitest, React Testing Library, and JSDOM.

### Run all tests

```bash
npm run test:all
```

### Run individual test suites

```bash
npm run test:backend
npm run test:frontend
```

### Run coverage

```bash
npm run test:coverage:all
npm run test:coverage:backend
npm run test:coverage:frontend
```

The backend test suite expects `TEST_DATABASE_URL` to point to a separate PostgreSQL database.

## Deployment

The project is designed to be deployed with:

- **Backend**: Any Node.js hosting service capable of running Express and PostgreSQL-backed Prisma migrations
- **Frontend**: Static hosting (Netlify, Vercel)
- **Database**: PostgreSQL (Supabase, Koyeb, or self-hosted)

Backend deployment currently runs database migration and Prisma client generation with the `build` script. Frontend production builds are handled through Vite.

## Built With

### Backend

- [Express.js](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [Express Validator](https://express-validator.github.io/)
- [Passport](https://www.passportjs.org/) & [Express Session](https://github.com/expressjs/session)
- [Helmet](https://helmetjs.github.io/)
- [Pino](https://getpino.io/)
- [Resend](https://resend.com/)
- [Vitest](https://vitest.dev/) & [Supertest](https://github.com/ladjs/supertest)

### Frontend

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/react)

## Current Status

The repository already contains structure for universities, contributor flows, and admin flows, but the currently complete public dataset and API surface is centered on postal codes.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests. Contributions of data, code improvements, documentation, and bug reports are all welcomed.

## Authors

- **Goran Jović** - _Initial work_ - [@goran1010](https://github.com/goran1010)

See also the list of [contributors](https://github.com/goran1010/bosnia-lens/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details. All data used will be public domain or properly attributed to its original source.

## Acknowledgments

- Initial PostalCode data sourced from [Spisak poštanskih brojeva u Bosni i Hercegovini](https://bs.wikipedia.org/wiki/Spisak_po%C5%A1tanskih_brojeva_u_Bosni_i_Hercegovini)
