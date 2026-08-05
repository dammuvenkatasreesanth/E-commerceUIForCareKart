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
   - `R2_ACCOUNT_ID` / `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` / `R2_BUCKET_NAME` / `R2_PUBLIC_BASE_URL` — Cloudflare R2 bucket for product/category/banner images and product videos; upload endpoints 400 until this is configured
   - `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` — the mailbox that ships with the Hostinger plan
   - `PHONEPE_MERCHANT_ID` / `PHONEPE_SALT_KEY` / `PHONEPE_SALT_INDEX` / `PHONEPE_ENV=PROD`
   - `PUBLIC_API_BASE_URL` — the real public URL of this API (e.g. `https://api.carekart.example/api/v1`) — PhonePe redirects and calls back here
   - `FRONTEND_ORDER_CONFIRMATION_URL` — the deployed frontend's confirmation page
   - `CORS_ORIGIN` — the deployed frontend's origin
   - `NODE_ENV=production`

## Every deploy

```bash
npm install
npx prisma migrate deploy   # applies any new migrations, never touches existing data
npm run build                # compiles TypeScript to dist/
npm run prisma:seed          # safe to re-run — only creates the bootstrap admin/categories/coupons if missing
npm start                    # or let Hostinger's process manager run `node dist/src/server.js`
```

Set Hostinger's Node app entry point to `dist/src/server.js` and its startup command to `npm start` (or the two lines above) so it survives restarts.

## Notes

- Product/category/banner images and product videos go straight to Cloudflare R2 — nothing is written to local disk, so this survives redeploys regardless of whether the platform preserves the app's working directory between deploys.
- The in-process payment reconciliation sweep and any other background timers only run in the single Node process — this deployment assumes one instance, not a multi-instance/load-balanced setup.
- `trust proxy` is enabled automatically when `NODE_ENV=production`, which is required for rate limiting and `req.ip` to see the real client IP behind Hostinger's reverse proxy.
