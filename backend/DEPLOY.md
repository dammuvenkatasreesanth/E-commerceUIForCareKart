# Deploying to Hostinger

## One-time setup

1. Create the Node.js Web App in hPanel, pointing at this `backend/` directory.
2. Create the MySQL database from hPanel and note the connection details.
3. Copy `.env.example` to `.env` on the server and fill in real values:
   - `DATABASE_URL` — Hostinger's MySQL connection string
   - `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` (run twice, once per secret)
   - `BOOTSTRAP_ADMIN_EMAIL` / `BOOTSTRAP_ADMIN_PASSWORD` — first Admin login; **change the password immediately after first login** (seeding refuses to run in production with the default password anyway)
   - `GOOGLE_CLIENT_ID` — from the Google Cloud Console OAuth client (customer "Continue with Google")
   - `FACEBOOK_APP_ID` / `FACEBOOK_APP_SECRET` — from the Facebook Developer app (customer "Continue with Facebook")
   - `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` — from the Cloudinary dashboard (free tier, no card required) — used for product/category/banner images and product videos; upload endpoints 400 with a clear message until this is configured
   - `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` — the mailbox that ships with the Hostinger plan
   - `PHONEPE_MERCHANT_ID` / `PHONEPE_SALT_KEY` / `PHONEPE_SALT_INDEX` — from the PhonePe Business Dashboard's V1 ("Standard Checkout") Production Credentials — this account is on the V1 flow, not V2, so there's no separate webhook username/password to set; the callback signature reuses the Salt Key
   - `PHONEPE_ENV=PROD`
   - `PUBLIC_API_BASE_URL` — the real public URL of this API (e.g. `https://api.carekart.example/api/v1`) — PhonePe redirects and calls back here
   - `FRONTEND_ORDER_CONFIRMATION_URL` — the deployed frontend's confirmation page
   - `CORS_ORIGIN` — comma-separated list of every origin the frontend is actually reachable at (e.g. `https://mycarekart.com,https://www.mycarekart.com`) — a browser rejects the response the moment the page's own origin isn't in this list, surfacing as a generic "Failed to fetch" on every API call including login; if `www.` resolves to the same site, it needs to be listed explicitly, the bare domain alone isn't enough
   - `NODE_ENV=production`

## Every deploy

```bash
npm install
npm run build                # compiles TypeScript to dist/
npm run db:seed               # safe to re-run — only creates the bootstrap admin/categories/coupons if missing
npm start                    # or let Hostinger's process manager run `node dist/src/server.js`
```

Set Hostinger's Node app entry point to `dist/src/server.js` and its startup command to `npm start` (or the two lines above) so it survives restarts.

## Notes

- The backend talks to MySQL via Drizzle ORM + the `mysql2` driver — a plain Node.js TCP client with no native/Rust runtime. There is no `prisma generate`/`prisma migrate` step; schema changes are applied directly against the database (see `backend/src/db/schema.ts` for the current schema, and `backend/prisma/migrations/` for the historical SQL log from when this project used Prisma).
- Product/category/banner images and product videos go straight to Cloudinary — nothing is written to local disk, so this survives redeploys regardless of whether the platform preserves the app's working directory between deploys. (Chosen over Cloudflare R2 specifically because R2 requires a card on file to activate even on its free tier.)
- The in-process payment reconciliation sweep and any other background timers only run in the single Node process — this deployment assumes one instance, not a multi-instance/load-balanced setup.
- `trust proxy` is enabled automatically when `NODE_ENV=production`, which is required for rate limiting and `req.ip` to see the real client IP behind Hostinger's reverse proxy.
