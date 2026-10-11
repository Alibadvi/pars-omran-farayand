# Pars Omran Farayand

Public company website in English, Persian, and Arabic. The public pages are Home, Projects, and Contact. The project portal is a separate future application; this repository does not provide authentication or private document storage.

## Develop

```bash
npm ci
npm run dev
```

## Build the public site

```bash
npm ci
npm run build:static
```

The deployable files are in `dist/`. The build creates separate HTML shells for `/projects` and `/contact` with route-specific titles and descriptions. Language selection is client-side and stored on the visitor's device.

## Deploy on cPanel Apache

1. Add the domain to cPanel, point it to the correct document root, and enable HTTPS.
2. Upload the **contents** of `dist/` to that document root (for the main domain, usually `public_html/`). Do not upload `src/`, `node_modules/`, or the enclosing `dist` folder.
3. In File Manager, enable **Show Hidden Files** and confirm `.htaccess` is alongside `index.html`. It serves the two public routes on direct visits and shows the app's 404 page for unknown paths.
4. Visit `/`, `/projects`, and `/contact` directly over HTTPS. The contact form opens the visitor's email application with a prepared message; it does not submit to a server.

This brochure site needs neither a Node.js application nor a database. Keep the private portal on a separate authenticated service when it is built; do not put project files in `public/` or `dist/`.
