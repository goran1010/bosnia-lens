# Bosnia Lens

A free, open-source project providing structured public data about Bosnia and Herzegovina through a REST API and web interface. Access comprehensive information about cities, municipalities, postal codes, holidays, universities (and their programs), and more - making Bosnian public data open, searchable, and developer-friendly.

## Features

- **REST API**: Access open data about Bosnia and Herzegovina
- **User Authentication**: JWT-based authentication with email confirmation
- **Web Interface**: React-based frontend for browsing and searching data
- **Responsive Design**: Built with Tailwind CSS for all devices

## Data Coverage

- Cities and municipalities
- Postal codes
- Holidays and observances
- Universities and their programs

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Before running this project, you need to have the following installed:

- Node.js (v18 or higher)
- PostgreSQL database server
- npm or yarn package manager

```bash
node --version
npm --version
psql --version
```

### Installing

A step by step series of examples that tell you how to get a development environment running

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

- Backend: copy `backend/.env.example` to `backend/.env` and edit values (database URLs, JWT secrets, email API key, etc.).

  ```bash
  cp backend/.env.example backend/.env
  # edit backend/.env
  ```

- Frontend: copy `frontend/.env.example` to `frontend/.env` and update `VITE_BACKEND_URL` if needed.

  ```bash
  cp frontend/.env.example frontend/.env
  # edit frontend/.env (optional)
  ```

Initialize the database and run migrations:

```bash
cd backend
# run existing migrations
npx prisma migrate deploy

# generate the Prisma client
npx prisma generate
```

End with running the development servers:

```bash
# Run both frontend and backend concurrently
npm run dev:all

# Or run individually:
npm run dev:backend  # Backend only on http://localhost:3000
npm run dev:frontend # Frontend only on http://localhost:5173
```

You should now be able to access the API at `http://localhost:3000` and the web interface at `http://localhost:5173`.

## Running the tests

### Backend Tests

Backend tests use Jest and Supertest to test API endpoints, authentication, and controllers:

```bash
# From root directory
npm run test:backend

# Or from backend directory
cd backend
npm run test
```

### Frontend Tests

Frontend tests use Vitest and React Testing Library for unit and integration tests:

```bash
# From root directory
npm run test:frontend

# Or from frontend directory
cd frontend
npm run test
```

### Run All Tests

```bash
# Run both backend and frontend tests concurrently
npm run test:all
```

## Deployment

The project is designed to be deployed with:

- **Backend**: Any Node.js hosting service (Koyeb, Railway, Render, Heroku)
- **Frontend**: Static hosting (Netlify, Vercel)
- **Database**: PostgreSQL (Supabase, PlanetScale, or self-hosted)

Configure production environment variables and run build commands for each service.

## Built With

### Backend

- [Express.js](https://expressjs.com/) - Web framework for the REST API
- [Prisma](https://www.prisma.io/) - Database ORM and migration tool
- [PostgreSQL](https://www.postgresql.org/) - Database system
- [JSON Web Tokens](https://jwt.io/) - Authentication and authorization
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) - Password hashing
- [Express Validator](https://express-validator.github.io/) - Request validation
- [Resend](https://resend.com/) - Email service for confirmations
- [Jest](https://jestjs.io/) & [Supertest](https://github.com/ladjs/supertest) - Testing

### Frontend

- [React](https://reactjs.org/) - UI library (v19)
- [Vite](https://vitejs.dev/) - Build tool and development server
- [React Router](https://reactrouter.com/) - Client-side routing
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/react) - Testing

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us. We welcome contributions of data, code improvements, documentation, and bug reports.

## Authors

- **Goran Jović** - _Initial work_ - [@goran1010](https://github.com/goran1010)

See also the list of [contributors](https://github.com/goran1010/bosnia-lens/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details. All data used will be public domain or properly attributed to its original source.

## Acknowledgments

- Inspired by global open data initiatives
- Thanks to the open-source community for tools and libraries
- Special recognition to contributors helping maintain accurate data about Bosnia and Herzegovina
