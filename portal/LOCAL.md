# Test the portal on your Mac

This local preview uses a separate SQLite file. The hosted portal uses PostgreSQL; no production database or uploads are touched.

1. Install Node.js 22 if it is not already installed. In Terminal, check `node -v`.
2. From the repository, run:

   ```sh
   cd ~/Desktop/pars-omran-farayand/portal
   npm ci
   npm run dev:local
   ```

3. Copy the setup token printed in Terminal. Open <http://localhost:3000/setup> and choose a name, email address, and a password of at least 16 characters.
4. Open <http://localhost:3000/admin/login> and sign in. Create a project, add site users and assign them to the project, then try messages and document uploads. The local data and files remain under `portal/.local-data/`.

Stop the preview with Control-C. Next time run `npm run dev:local`; the data and your login remain. The setup token only works before the first account exists. For a completely fresh local preview, stop the server and remove `portal/.local-data/`, then start again and create a new account.

External email and reply sync need the organization's Microsoft Graph app registration and shared mailbox credentials. Without those, projects, roles, documents, and internal messages can still be tested locally.
