# Contributing to Skynet AI Assistant

Thank you for your interest in contributing to Skynet AI Assistant! This document provides guidelines and instructions for contributing to this project.

## Getting Started

1. Fork the repository
2. Clone your forked repository
3. Create a new branch for your feature or bug fix
4. Make your changes
5. Push your changes to your fork
6. Open a pull request

## Environment Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Add your Groq API key to the `.env` file:
```
VITE_GROQ_API_KEY=your_groq_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

## Code Style

This project uses ESLint and TypeScript for code quality. Please ensure your code follows the existing style.

- Run linting: `npm run lint`

## Commit Guidelines

Please use clear and descriptive commit messages. Consider using conventional commits format:

```
feat: add new feature
fix: correct bug
docs: update documentation
style: formatting, missing semicolons, etc.
refactor: code change that neither fixes a bug nor adds a feature
test: adding tests
chore: updating build tasks, package manager configs, etc.
```

## Pull Request Process

1. Update the README.md with details of changes if appropriate
2. Update documentation if necessary
3. The PR should work on the development environment
4. Make sure all checks pass
5. Request a review from a maintainer

## Adding Features

When adding new features, please consider:

1. Is it aligned with the project's goals?
2. Does it maintain backward compatibility?
3. Is it properly tested?
4. Is it properly documented?

## Security

If you discover a security vulnerability, please do NOT open an issue. Email [your-email@example.com] instead.

## License

By contributing to this project, you agree that your contributions will be licensed under the project's MIT license.