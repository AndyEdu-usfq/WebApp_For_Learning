# Operations and acceptance checks

## Managed hosted deployment

The `.openai/hosting.json` identifies this Site and declares the `DB` binding. The platform provisions D1, applies tracked schema migrations and provides authenticated request identity. Do not deploy this Worker directly to an unprotected endpoint: identity headers are trusted only behind the Sites platform or the supplied private container gateway.

Use the Sites workflow for publishing; it builds, synchronizes source and deploys the matching artifact. The GitHub repository is an additional source copy and CI destination. A push to GitHub alone does not change the hosted Site.

## Local D1 migrations

After a build, execute each pending SQL migration against the generated config, or use the container startup flow for automatic migration tracking:

```sh
pnpm exec wrangler d1 execute DB --local --config dist/server/wrangler.json --file drizzle/0000_curly_whiplash.sql
pnpm exec wrangler d1 execute DB --local --config dist/server/wrangler.json --file drizzle/0001_easy_ares.sql
```

Use the actual names under `drizzle/` if new migrations are added. Never rewrite an applied migration. Local databases and hosted D1 are independent.

## Backup / restore (container)

Stop the app before copying the complete named `learning-data` volume using your Docker backup tooling, then restart it. Restore the entire volume into an empty destination while the app is stopped. Preserve a backup before every schema upgrade. The application must be stopped to avoid a partial SQLite copy.

## Acceptance checklist

1. Sign in and reload: no data-loading error.
2. Open B1 → Tell your story; navigate all four session tabs.
3. Start the video. If embedding is blocked, confirm the original TED link opens.
4. Grant microphone permission, record, stop and play back. Deny permission and confirm the writing lab remains usable.
5. Submit an original 80–120 word response, self-check and compare with the model.
6. Finish a quiz: wrong answers are highlighted and a retry resets choices.
7. Reload and confirm the saved response, score and lesson completion persist.
8. Use a second account: the first account's journal must not be returned.
9. Complete a level checkpoint and export progress.
10. Check narrow-screen navigation, dialog keyboard focus, Escape and scrolling.

## Release limits

The content is an initial curriculum, not a complete accredited B1–C2 programme. Add more listening materials, reading tasks and validated assessment items after learner feedback. Writing feedback is self-reflection and task completion; human or validated model review is required for language-quality grading. The current progress endpoint returns at most 2,000 latest attempts; introduce pagination before long-term high-volume use. No uptime, load testing or independent accessibility audit has been completed.
