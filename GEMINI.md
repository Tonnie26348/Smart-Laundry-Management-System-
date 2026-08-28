# Repository Conventions

## Testing & Verification Workflow

To maintain code quality and prevent broken builds, the following steps must be run and pass successfully before staging, committing, or pushing any changes to GitHub:

1. **Linting Check:** Run `npm run lint` to ensure there are no linting or formatting errors.
2. **Type-Checking & Build:** Run `npm run build` to verify there are no TypeScript compilation or bundling errors.
3. **Automated Tests:** Run `npm run test` (or `npx vitest run`) to run all unit and integration tests, ensuring all tests pass.
