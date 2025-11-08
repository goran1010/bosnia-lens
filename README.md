# Bosnia Lens

A free, open-source project providing structured public data about Bosnia and Herzegovina through a REST API and web interface. Access comprehensive information about cities, municipalities, postal codes, holidays, universities, and more - making Bosnian public data open, searchable, and developer-friendly.

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

Set up environment variables by copying the example files and editing them:

**Backend environment variables** - Copy `/backend/.env.example` to `/backend/.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/bosnia-lens"
TEST_DATABASE_URL="postgresql://user:password@localhost:5432/test-bosnia-lens"
SECRET="your-jwt-secret-key"
```

**Frontend environment variables** (optional) - Copy `/frontend/.env.example` to `/frontend/.env`:

```env
VITE_BACKEND_URL="http://localhost:3000"
```

Initialize the database and run migrations:

```bash
cd backend
npx prisma migrate dev
```

End with running the development servers:

```bash
# Run both frontend and backend concurrently
npm run dev
```

You should now be able to access the API at `http://localhost:3000` and the web interface at `http://localhost:5173`.

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Backend tests use Jest and Supertest to test API endpoints:

```bash
cd backend
npm run test
```

### And coding style tests

Frontend tests use Vitest and React Testing Library:

```bash
cd frontend
npm run test
```

## Deployment

The project is designed to be deployed with:

- **Backend**: Any Node.js hosting service (Railway, Render, Heroku)
- **Frontend**: Static hosting (Netlify, Vercel)
- **Database**: PostgreSQL (Supabase, PlanetScale, or self-hosted)

Configure production environment variables and run build commands for each service.

## Built With

- [Express.js](https://expressjs.com/) - The web framework for the REST API
- [React](https://reactjs.org/) - Frontend library for building the user interface
- [Vite](https://vitejs.dev/) - Build tool and development server
- [Prisma](https://www.prisma.io/) - Database ORM and migration tool
- [PostgreSQL](https://www.postgresql.org/) - Database system
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework for styling

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
