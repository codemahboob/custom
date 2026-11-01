# plate-dm-agent

Instagram DM agent for number plate orders. Replies in Hinglish with human-like delays, collects order details, sends a Razorpay UPI QR, confirms payment from Razorpay, emails you the order via Resend, and shows everything on a dashboard.

## Deploy on Vercel
1. The project files are at the repository root.
2. Vercel project -> Storage -> add **Neon Postgres** (Marketplace) and connect it to the project. This adds `DATABASE_URL`. Tables are created automatically on first request.
3. Project Settings -> Environment Variables: add everything from `.env.example` (except `PORT`), then redeploy.
4. Fluid Compute should be on (default for new projects). Replies run as background tasks and can take 30-60 seconds because of the human-like delays; the limit is 300 seconds.
5. After every env var change, redeploy. Then open `/health` on your site: it should say `ok: database connected`; if not, it says what is wrong.
6. Dashboard: open your project URL (`/`). It asks for `DASHBOARD_PASSWORD` once per browser session.

Running locally instead: `cp .env.example .env`, fill it in, `npm install`, `npm start` (Node 22+). Set `DELAY_SCALE=0` to test without delays.

## Instagram
1. Instagram account must be Professional (Business or Creator).
2. developers.facebook.com -> create app -> add Instagram product -> "API setup with Instagram login".
3. Add your account, generate the access token -> `IG_ACCESS_TOKEN`. App secret -> `IG_APP_SECRET`.
4. Webhooks: callback `https://YOUR_URL/webhook/instagram`, verify token = `IG_VERIFY_TOKEN`, subscribe to `messages`.
5. Until Meta approves `instagram_business_manage_messages` (App Review), only accounts with a role on the app can chat with the bot.
6. Instagram only lets you reply within 24 hours of the customer's last message.
7. Access tokens last about 60 days; refresh before expiry.

## Razorpay
1. Dashboard -> Settings -> API Keys -> `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`.
2. UPI QR Codes must be enabled on your account (ask Razorpay support if you don't see QR Codes).
3. Webhooks: URL `https://YOUR_URL/webhook/razorpay`, secret -> `RAZORPAY_WEBHOOK_SECRET`, event `qr_code.credited`.

## Resend
Verify your domain, set `MAIL_FROM` (on that domain) and `OWNER_EMAIL`.

## How payment is confirmed
The agent never confirms payment itself. An order is marked paid only when Razorpay reports a captured payment of the full amount on that customer's QR, either via the webhook or when the customer sends a screenshot (which triggers an immediate check, then re-checks for ~3 minutes). A faked screenshot confirms nothing.

## Controls
- Pause / resume the bot per chat from the dashboard (then reply yourself on Instagram).
- The agent can call you (email + pause) for complaints, refunds or anything it can't handle.
- Prices are set in env vars and enforced in code, not by the AI.
- Errors show up in Vercel -> your project -> Logs.
