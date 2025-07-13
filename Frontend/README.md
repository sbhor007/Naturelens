# Naturelens Frontend

This is the frontend for the Naturelens project, built with Angular. It provides a user interface for interacting with the Naturelens backend API.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Development Server](#development-server)
- [Code Scaffolding](#code-scaffolding)
- [Building](#building)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [Additional Resources](#additional-resources)

---

## Features

- Modern Angular SPA
- REST API integration
- User authentication
- Photo gallery and upload
- Social features

---

## Requirements

- Node.js (v18+ recommended)
- npm (v9+ recommended)
- Angular CLI

---

## Setup Instructions

1. **Clone the repository**

   ```sh
   git clone <your-repo-url>
   cd Naturelens/Frontend
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Configure environment variables**

   Edit the environment files in `src/environments/`:

   - `environment.ts` (for development)
   - `environment.prod.ts` (for production)

   Example:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8000/api',
     // Add other environment variables here
   };
   ```

---

## Environment Variables

Environment variables for the Angular app are managed in the files:

- `src/environments/environment.ts` (development)
- `src/environments/environment.prod.ts` (production)

Common variables you may want to set:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api', // Backend API URL
  // Add other variables as needed
};
```

---

## Development Server

To start a local development server, run:

```sh
ng serve
```

Once the server is running, open your browser and navigate to [http://localhost:4200/](http://localhost:4200/). The application will automatically reload whenever you modify any of the source files.

---

## Code Scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```sh
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```sh
ng generate --help
```

---

## Building

To build the project for production, run:

```sh
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

---

## Running Tests

- **Unit tests:**  
  ```sh
  ng test
  ```
- **End-to-end tests:**  
  ```sh
  ng e2e
  ```

---

## Project Structure

```
Frontend/
  src/
    app/
    environments/
    assets/
    ...
  angular.json
  package.json
  tsconfig.json
  README.md
```

---

## Additional Resources

- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [Angular Official Docs](https://angular.dev/)

---

**Note:**  
- Update the `apiUrl` and other environment variables in `src/environments/` as needed for your backend.  
- For Docker or production deployment, ensure the environment files are set correctly.
