# CLAUDE.md - Guidelines for AI Assistants

## Build Commands
- Start development server: `yarn dev` or `npm run dev` 
- Build for production: `yarn build` or `npm run build`
- Preview production build: `yarn preview` or `npm run preview`
- Deploy to Firebase: `npm run deploy` or `firebase deploy --only hosting`

## Functions Commands
- Build Functions: `cd functions && npm run build`
- Serve Functions locally: `cd functions && npm run serve`
- Deploy Functions: `cd functions && npm run deploy`

## Lint Commands
- Lint project: `yarn lint` or `npm run lint`

## Code Style Guidelines
- Use TypeScript with strict type checking
- Follow React functional component patterns with hooks
- Use ES modules for imports (`import x from 'y'`)
- Prefer const over let when possible
- Use meaningful, camelCase variable names
- Prefer early returns for error handling
- Use async/await for asynchronous code
- Group imports by: React/external libraries first, then internal modules
- Use tailwind classes for styling
- Keep components small and focused on a single responsibility