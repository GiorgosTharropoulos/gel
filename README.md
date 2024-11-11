# Greek Election

This project is a full-stack application built with Node.js, TypeScript, and React. It uses a monorepo structure managed by pnpm and TurboRepo, and it is designed to be deployed on Fly.io.

Visit the live site at [https://gel.fly.dev](https://gel.fly.dev).

## Project Structure

- **apps/backend**: The backend application built with Node.js.
- **apps/frontend**: The frontend application built with React and Vite.
- **packages/data**: Shared data models and utilities.
- **packages/party-images**: Utilities for downloading and processing party images.

## Getting Started

### Prerequisites

- Node.js 20.x
- pnpm
- Docker

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-repo/gel.git
   cd gel
   ```

2. Install dependencies:
   ```sh
   pnpm install
   ```

### Running the Development Server

To start the development server for both the backend and frontend:

1. Start the backend:

   ```sh
   pnpm dev
   pnpm --filter backend dev
   ```

### Building the Project

To build the project for production:

```sh
pnpm build
```

## Docker

The project includes a Dockerfile for building a production-ready Docker image. To build and run the Docker image locally:

1. Build the Docker image:

   ```sh
   docker build -t gel-app .
   ```

2. Run the Docker container:
   ```sh
   docker run -p 3000:3000 gel-app
   ```

## Deployment

### Fly.io

This project is configured to be deployed on Fly.io. Follow these steps to deploy:

1. Install Fly CLI:

   ```sh
   curl -L https://fly.io/install.sh | sh
   ```

2. Login to Fly.io:

   ```sh
   flyctl auth login
   ```

3. Initialize Fly.io app:

   ```sh
   flyctl launch
   ```

4. Deploy the app:
   ```sh
   flyctl deploy
   ```

## Configuration

### Vite

The frontend application uses Vite for development and build. The configuration can be found in `apps/frontend/vite.config.ts`.

### ESLint

The project uses ESLint for linting. The configuration can be found in `tooling/eslint/base.js`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
