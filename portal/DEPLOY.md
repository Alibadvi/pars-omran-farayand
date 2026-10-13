# Production deployment on pofco.ir

The public site is a static Vite build at `https://pofco.ir`. The private portal is a separate Next/Payload Node application at `https://portal.pofco.ir`. Do not put portal source, uploads, or database credentials under `public_html`.

## 1. Public site

On your laptop, from the repository root:

```sh
npm ci
npm run build:static
cd dist && zip -qr ../pofco-public.zip . && cd ..
```

In cPanel File Manager open `/home/pofcoir/public_html`, upload `pofco-public.zip`, and extract it **there**. `index.html`, `assets/`, and `.htaccess` must be directly inside `public_html` (enable **Show Hidden Files**). Remove the uploaded zip afterwards. The public site does not require a Node app or PostgreSQL.

## 2. Portal domain and database

In cPanel **Domains**, create `portal.pofco.ir` with its own document root. Confirm the DNS A record resolves to the hosting IP and AutoSSL gives the subdomain a valid certificate before entering credentials on it.

In **PostgreSQL Databases**, create an empty database such as `pofcoir_portal` and user such as `pofcoir_portalapp`; give that user **all privileges** on this database. Record the full names with the `pofcoir_` prefix. Do not import the laptop's local SQLite preview database.

## 3. Portal application

On the laptop, from `portal/`:

```sh
npm ci
npm run build
npm run package:cpanel
```

In cPanel **Setup Node.js App**, create a **Node.js 22 / Production** application with root `portal-app`, URL `portal.pofco.ir` and startup file `app.cjs`. In File Manager upload `portal-cpanel.tar.gz` to `/home/pofcoir`, then extract into `/home/pofcoir/portal-app` (the archive contains `app.cjs` and `server.js` at its root). Keep the `/home/pofcoir/portal-private-files` upload directory outside both web roots.

Add these **Node.js application environment variables** in cPanel; use the actual PostgreSQL names and password:

| Name | Value |
| --- | --- |
| `PGHOST` | `127.0.0.1` |
| `PGPORT` | `5432` |
| `PGDATABASE` | your full database name |
| `PGUSER` | your full database username |
| `PGPASSWORD` | your database user's password |
| `PAYLOAD_SECRET` | an independent random value from `openssl rand -hex 32` |
| `PORTAL_URL` | `https://portal.pofco.ir` |
| `PORTAL_UPLOAD_DIR` | `/home/pofcoir/portal-private-files` |
| `PORTAL_BOOTSTRAP_TOKEN` | another independent value from `openssl rand -hex 32` |

Save and restart the app. Visit `https://portal.pofco.ir/api/portal/health`; expect `{"status":"ok"}`. First startup applies the checked-in PostgreSQL migrations. At `/setup`, enter the temporary bootstrap token and choose the first Tehran administrator email and a password of at least 16 characters. Then log in at `/admin/login`. Remove `PORTAL_BOOTSTRAP_TOKEN` from cPanel and restart the app after setup.

## 4. Email connection (after the portal works)

Project records, internal messages and file uploads work before email is connected. Sending and importing external mail require a Microsoft account, Graph app registration, `MS_GRAPH_CLIENT_ID`, `MS_GRAPH_CLIENT_SECRET`, `MS_GRAPH_MAILBOX`, `PORTAL_ENCRYPTION_KEY`, and a private scheduled sync job with `MAIL_SYNC_KEY`. Register `https://portal.pofco.ir/api/portal/mail/callback` as the OAuth redirect URI. Configure these only after the mailbox is ready; the email composer stays disabled until the administrator connects it.

## Updates and backups

Before later releases, back up the PostgreSQL database and `portal-private-files`. Replace only the files in `portal-app`, keeping environment variables and the separate upload directory. Restart the Node app and check `/api/portal/health`. Never extract a portal archive into `public_html` and never overwrite the production database to update code.
