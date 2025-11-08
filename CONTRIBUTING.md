# Contributing to Bosnia Lens

## Introduction

First off, thank you for considering contributing to Bosnia Lens! It's people like you that make Bosnia Lens a valuable resource for accessing open data about Bosnia and Herzegovina. Whether you're a developer, data enthusiast, or someone who just wants to help improve access to public information, your contributions are welcome and appreciated.

Following these guidelines helps to communicate that you respect the time of the developers managing and developing this open source project. In return, we'll reciprocate that respect in addressing your issues, assessing changes, and helping you finalize your pull requests.

## What kinds of contributions we're looking for

Bosnia Lens is an open source project and we love to receive contributions from our community! There are many ways to contribute:

- **Data contributions**: Adding new datasets, updating existing data, or improving data quality
- **Code improvements**: Bug fixes, new features, performance improvements
- **Documentation**: Improving setup instructions, API documentation, or adding tutorials
- **Testing**: Writing tests, reporting bugs, or helping with quality assurance
- **Design and UX**: Improving the frontend interface and user experience
- **Community support**: Helping other users, answering questions, or moderating discussions

## What we're NOT looking for

Please don't use the GitHub issue tracker for general support questions. For questions about using the API or project setup, consider starting a [GitHub Discussion](https://github.com/goran1010/bosnia-lens/discussions) first.

We also cannot accept:

- Data that is not from reliable or official sources
- Copyrighted data without proper licensing
- Personal or private information that shouldn't be public

## Ground Rules

### Responsibilities

- **Ensure data quality**: All data contributions must be verified against official sources
- **Cross-platform compatibility**: Code should work on Windows, Mac, and Linux
- **Testing**: Write tests for new features and ensure existing tests pass
- **Documentation**: Update documentation for any new features or API changes
- **Respectful communication**: Be welcoming to newcomers and maintain professional discourse
- **Source attribution**: Always provide proper attribution for data sources
- **Security**: Never commit sensitive information like passwords or API keys

### Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please be respectful, considerate, and constructive in all interactions.

## Your First Contribution

Unsure where to begin contributing to Bosnia Lens? You can start by looking through these beginner-friendly areas:

- **Good first issues**: Look for issues labeled `good first issue` - these require minimal Bosnia-specific knowledge
- **Documentation improvements**: Help improve README files, API documentation, or setup guides
- **Data verification**: Help verify existing datasets against official sources
- **Frontend improvements**: Small UI/UX improvements that don't require backend changes

**New to open source?** Here are some helpful resources:

- [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)
- [Make a Pull Request](http://makeapullrequest.com/)
- [First Timers Only](http://www.firsttimersonly.com/)

At this point, you're ready to make your changes! Feel free to ask for help; everyone is a beginner at first 😸

## Getting Started

### For Code Contributions

1. **Fork the repository** and create your branch from `main`
2. **Install dependencies**: Run `npm run install:all` in the project root
3. **Set up environment**: Copy `.env.example` files and configure your local environment
4. **Run tests**: Ensure all existing tests pass with `npm run test` in both backend and frontend
5. **Make your changes**: Follow our coding standards and write tests for new features
6. **Test your changes**: Run the full test suite and test manually
7. **Update documentation**: Update README, API docs, or other relevant documentation
8. **Submit a pull request**: Use our PR template and reference any related issues

### For Data Contributions

1. **Use our issue template**: Create a new issue using the "Data contribution" template
2. **Verify data sources**: Ensure data comes from official government sources or reliable institutions
3. **Check data format**: Follow our JSON/CSV formatting standards
4. **Provide attribution**: Include source URLs and access dates
5. **Geographic scope**: Clearly indicate which part of Bosnia and Herzegovina the data covers

### Small or Obvious Fixes

Small contributions such as fixing spelling errors, typos, or formatting issues can be submitted directly via pull request without creating an issue first. These include:

- Spelling/grammar fixes
- Typo corrections and formatting changes
- Comment cleanup
- Documentation improvements
- Configuration file updates

## How to Report a Bug

### Security Issues

**If you find a security vulnerability, do NOT open an issue.** Email <goran1010@gmail.com> instead.

Security issues include:

- Ability to access data that shouldn't be public
- Ability to modify or delete data without proper authorization
- Any vulnerability that could compromise user data or system integrity

### Bug Reports

When filing a bug report, please use our bug report template and include:

1. **Environment details**: OS, browser, Node.js version, database version
2. **Steps to reproduce**: Clear, numbered steps to recreate the issue
3. **Expected vs actual behavior**: What should happen vs what actually happens
4. **API endpoint** (if applicable): Which endpoint and what request/response data
5. **Screenshots**: If the issue involves the UI

## How to Suggest Features or Enhancements

### Project Philosophy

Bosnia Lens aims to be the definitive source for open data about Bosnia and Herzegovina. We prioritize:

- **Data accuracy and reliability**: All data must be verifiable and from official sources
- **Developer-friendly APIs**: Clean, well-documented REST endpoints
- **Community-driven**: Sustainable through community contributions and maintenance
- **Accessibility**: Easy to use for both technical and non-technical users

### Feature Request Process

1. **Check existing issues**: Search to see if someone has already suggested your idea
2. **Open an issue**: Use our "Feature request" template
3. **Describe the problem**: Explain what problem this feature would solve
4. **Propose a solution**: Describe how you envision the feature working
5. **Consider implementation**: Think about frontend, backend, and database implications

## Code Review Process

- **Pull requests** are reviewed by project maintainers
- **Response time**: We aim to respond to PRs within one week
- **Feedback incorporation**: Please address feedback within two weeks
- **Approval**: At least one maintainer approval is required before merging
- **Automated checks**: All GitHub Actions checks must pass

The review process focuses on:

- Code quality and testing
- Data accuracy (for data contributions)
- Documentation completeness
- Adherence to project standards

## Community

- **GitHub Discussions**: For questions, ideas, and general discussion
- **Issues**: For bug reports and feature requests
- **Pull Requests**: For code and data contributions
- **Response time**: We aim to respond to issues and discussions within 3-5 days

## Coding Standards

### Backend (Node.js/Express)

- Follow ESLint configuration in the project
- Write tests for all new API endpoints
- Use Prisma for all database interactions
- Validate all input data
- Provide proper error responses

### Frontend (React/Vite)

- Follow ESLint and Prettier configurations
- Write component tests using React Testing Library
- Use semantic HTML and proper accessibility attributes
- Follow existing component patterns

### Data Standards

- **JSON format**: Use consistent field names and structures
- **Source attribution**: Include `source`, `sourceUrl`, and `lastUpdated` fields
- **Geographic data**: Use standard ISO codes where applicable
- **Validation**: Ensure data integrity and completeness

## Commit Message Convention

Use clear, descriptive commit messages:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `data:` for data additions or updates
- `test:` for adding tests
- `refactor:` for code refactoring

Example: `feat: add postal codes endpoint for Sarajevo canton`

## Issue Labels

We use these labels to organize issues:

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `data`: Data-related issues or contributions
- `documentation`: Documentation improvements
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `priority-high`: Critical issues
- `frontend`: Frontend-specific issues
- `backend`: Backend-specific issues
