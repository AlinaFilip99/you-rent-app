# You Rent App

You Rent App is a rental marketplace web app built with Ionic React, Vite, and Firebase. It allows users to browse available properties, filter listings by preferences, save matching criteria, submit rental requests, and communicate with property owners or other users through a request/chat flow.

## Features

- Browse and search for rental properties
- Filter estates by price, bedrooms, bathrooms, area, amenities, and more
- Match listings against saved search criteria
- View detailed property information and photos
- Submit and manage rental requests
- Chat with users about a specific request or property
- User authentication and profile management
- Firebase-backed data storage for listings, users, requests, and messages

## Tech Stack

- React 18
- Ionic React
- TypeScript
- Vite
- Firebase Authentication
- Firestore
- Firebase Storage
- Capacitor
- Vitest + Cypress (testing)

## Project Structure

```bash
src/
├── components/
├── contexts/
├── hooks/
├── interfaces/
├── pages/
├── services/
├── theme/
├── utils/
├── App.tsx
├── main.tsx
├── setupTests.ts
└── vite-env.d.ts
```

## Prerequisites

Before running the project, make sure you have:

- Node.js 18+ recommended
- npm
- A Firebase project with Authentication, Firestore, and Storage enabled

## Setup

1. Clone the repository and open the project folder.
2. Install dependencies:

```bash
npm install
```

3. Create your environment file:

```bash
cp .env.example .env
```

4. Fill in your Firebase configuration values in `.env`:

```bash
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
FIREBASE_MEASUREMENT_ID=
```

These values are loaded by `src/services/firebase/firebaseConfig.ts`.

## Running the App

Start the Vite development server:

```bash
npm run dev
```

The app should open in the browser on the default Vite port, usually:

```bash
http://localhost:5173
```

## Available Scripts

```bash
npm run dev        # start the app in development mode
npm run build      # typecheck and build the production bundle
npm run preview    # preview the production build locally
npm run test.unit  # run unit tests with Vitest
npm run test.e2e   # run Cypress end-to-end tests
npm run lint       # run ESLint checks
```

## Production Build

To build the app for production:

```bash
npm run build
```

The generated build output is placed in the `dist/` directory.

## Notes

- The app is configured for Firebase-backed authentication and data persistence, so the Firebase project must be set up correctly before local development.
- If you plan to package this as a mobile app, Capacitor is already configured in the project via `capacitor.config.ts`.

## License

This project is currently unlicensed unless otherwise specified in a repository policy or project documentation.
