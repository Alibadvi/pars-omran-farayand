# Admin workspace

The portal's `/admin` dashboard is a Persian, right-to-left workspace. It shows live counts, a project directory, recent documents and messages, and shortcuts appropriate to the signed-in user's role. Project search covers name, code, site, and client across all permitted records, with status filtering and eight projects per page. Filters are kept in the URL and are preserved when changing pages.

## Access and records

- All dashboard queries use collection access controls. Site colleagues see only their assigned projects; head-office colleagues see all projects. Only head-office administrators see project/user creation shortcuts.
- Roles and assignments are read from the database, including when an older login token contains previous permissions.
- Required names, titles, codes, and message content reject whitespace-only values. Length limits also apply through the API. Surrounding whitespace is removed before saving.
- Colleagues need an email or username for login. Username-only accounts are supported; clearing the last login identifier is rejected. An empty project assignment means a site colleague cannot see any projects.
- Users cannot delete or demote the account currently signed in. Accounts referenced by messages, uploads, or emails cannot be deleted, preserving attribution.
- A project with documents, messages, emails, or assigned colleagues cannot be deleted. Change its status to completed or on hold instead.
- Message senders and projects cannot be changed after creation. Recipients must belong to that project or head office. A named recipient does **not** make a project message private: all permitted project colleagues can read it.
- Recipient dropdown filtering does not grant read access to another colleague's account. Server-side hooks validate recipient membership independently of account visibility.
- Documents remain immutable. Upload a new document and choose its previous version to create a revision; the previous document must belong to the same project. Revision and uploader values are calculated on the server.
- Persian dates use the `Asia/Tehran` timezone explicitly so server and browser locations do not change their display.

## Validation

From `portal/`:

```bash
npm ci
npm run generate:types
npm run generate:importmap
npm run test:admin
npx tsc --noEmit
npm run build
```

The integration tests create and destroy an isolated temporary SQLite database and temporary upload directory. They do not connect to the configured production database or mail service. They cover access by all four roles, revoked permissions, server-side search, invalid forms, login identity, account safeguards, message permissions, document revisions, deletion rules, and timezone-independent display.

For a local browser preview, run `npm run dev:local` and follow the existing `/setup` flow. Use an existing local administrator if setup is already complete.

This upgrade adds no database fields or schema migration. The existing portal migrations are still required when upgrading an older installation. Production deployment and PostgreSQL migration validation follow `DEPLOY.md`.
