# FluencyLab — English in action

A private English-learning workspace for an independent learner progressing from B1 towards B2, C1 and C2. Inspired by the learning-path → guided lesson → practical lab → assessment pattern, with original branding and exercises.

## What works

- 16 authored lessons, four at each intended CEFR difficulty. Language notes, speakable phrases, original scenarios, self-reflection checklists and model approaches.
- Two publisher-hosted TED videos with guided activities adjusted by level. Embeds load only on request, with original TED source/transcript links as fallback.
- 48 questions, lesson quizzes and four 12-question level checkpoints. Answer keys and scores stay on the server; attempts are stored per user.
- Writing labs with device-local draft recovery and account-based submitted work. Explicitly labelled task-completion feedback based on length and self-checks.
- Optional microphone recording, playback and download. Audio remains in browser memory and is not uploaded.
- Saved progress, journal and JSON export. A lesson is complete after a lab submission and a quiz score of at least 70%.
- Responsive interface, keyboard controls, reduced-motion handling and labelled inputs.

These practice activities are not a validated CEFR placement exam or certification. The app does not provide automated grammar correction, AI tutoring or pronunciation scoring. Its initial media collection contains two authentic talks, not a proprietary video course. Model approaches illustrate language/structure and may need expansion to reach task word counts.

## Architecture

TypeScript, React 19, Vinext/Vite, Cloudflare Workers and D1 (SQLite), Drizzle migrations. The private hosted version uses the Sites access boundary and ChatGPT identity. Each API operation authorizes the visitor and scopes progress to their stable Site user ID.

`app/api/attempt`: validates and scores submissions, then persists attempts. `app/api/progress`: returns the signed-in user's latest 2,000 attempts. `lib/curriculum.ts`: public lesson content. `lib/scoring.ts`: server-only keys and scoring. `components/workspace.tsx`: learning interface. `db/schema.ts` and `drizzle/`: durable schema and migrations.

## Run in Docker

Requires Docker Engine with Compose. This deployment is **single-owner**, matching the personal-learning use case. It uses a password-protected gateway rather than hosted ChatGPT sign-in.

```sh
cp .env.example .env
# Set APP_PASSWORD to a unique value of at least 16 characters.
docker compose up --build -d
```

Open http://localhost:3000 and enter `APP_USERNAME` / `APP_PASSWORD`. The internal Worker only binds to loopback; do not expose port 8787. Identity headers received from clients are stripped by the gateway. `learning-data` stores the local D1 database and survives restarts. Do not run `docker compose down -v` unless you intend to delete your learning data.

For a remote deployment, place an HTTPS reverse proxy in front and set `PUBLIC_ORIGIN` to the exact HTTPS origin. The default Compose port is intentionally loopback-only. Change proxy routing explicitly for your infrastructure. HTTP Basic credentials are browser-session credentials; close the browser session to clear them. Multi-user container auth requires a real identity provider and is outside this initial release.

The image builds and tests the application, runs as a non-root user, applies pending schema migrations at startup and has a health check. It runs the built Worker under the local workerd runtime through Wrangler. This portable personal deployment is distinct from the scalable managed Worker/D1 hosted deployment.

## Development and checks

Use Node 22.13+ and pnpm 11.25.0.

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm typecheck
pnpm dev
pnpm build
```

Clean clones use the portable development profile. Local mock identity is restricted by the starter to local development. Apply D1 migrations before testing saved progress locally; see [operations](docs/OPERATIONS.md).

GitHub Actions runs tests, type checking, a production build, a Docker build and container smoke tests. It verifies unauthorized access, origin rejection, persisted quiz submission and data surviving a container restart. It does not automatically publish a container or deploy cloud infrastructure; those need a chosen destination and credentials.

## Verification at initial delivery

Unit tests, TypeScript checks and the managed production build were run in the authoring environment. Docker was unavailable there, and supported browser automation was unavailable. Container runtime smoke tests are defined in CI; inspect the actual GitHub Actions result before treating the image as verified. Video playback, microphone permissions and mobile layouts require browser acceptance testing. Hosted deployment status is reported separately in the delivery message.

## Data and media

The app stores written submissions, self-checks, scores and timestamps. Audio is session-local. Drafts use localStorage and can be removed using the browser's site data controls. Export progress from My progress. Back up the container volume before upgrades. This initial version has no in-app account deletion flow; deletion is an administrative database operation.

External video content remains with its publishers and is credited in the app. No videos or transcripts are copied into the repository. Font loading uses Google Fonts with system fallbacks. No paid APIs or API keys are needed for this version.
