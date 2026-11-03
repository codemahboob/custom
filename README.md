# Plate DM Agent

Instagram DM sales assistant for custom number-plate orders. It uses Google Gemini for conversation, Razorpay UPI QR codes for payment, Neon/Postgres for durable conversations and customer memory, and Resend for owner notifications.

## What changed in 1.1.0

- Payment confirmation now retrieves the payment directly from Razorpay and checks `captured`, INR currency, exact amount, and the QR code associated with the pending order.
- The paid-order insert and conversation status update run in one Postgres transaction, with a unique payment ID to prevent duplicate orders from webhook retries/polling races.
- Added persistent `customer_profiles` memory keyed by Instagram sender ID. The agent can save useful non-sensitive facts and a short summary, and receives that memory plus up to five previous paid orders in later conversations.
- Added a dashboard customer panel showing saved facts, summary, and previous paid orders.
- Added phone/PIN validation, timing-safe webhook signature checks, stronger dashboard password validation, a health/configuration endpoint, and Vercel configuration.
- The agent now uses Google's Gemini API with configurable model selection.

## Requirements

- Node.js 22+
- Neon or another PostgreSQL database
- Instagram Professional (Business or Creator) account in a Meta business portfolio
- Meta app with an Instagram Login Compatible Unified Login configuration and Instagram messaging permissions
- Google Gemini API key
- Razorpay account with UPI QR Codes enabled
- Resend account with a verified sender domain
- Vercel account (or another Node.js host that supports long-running webhook work)

## Local setup

1. Copy `.env.example` to `.env`.
2. Fill in all credentials, including `GEMINI_API_KEY`. Optionally set `GEMINI_MODEL` (default: `gemini-3.8-flash`).
3. Set `DATABASE_URL` to a Postgres connection string. For Neon, use its pooled connection string and enable SSL as provided by Neon.
4. Set `DASHBOARD_PASSWORD` to a random secret of at least 32 characters.
5. Run `npm install`, then `npm start`.
6. Open `/health`. It reports database connectivity and whether each integration is configured (it never returns secret values).
7. Open `/` for the password-protected dashboard.

For local testing, set `DELAY_SCALE=0`. Do not use test Razorpay keys for live customer payments.

## Vercel deployment

1. Import this repository into Vercel.
2. Add all required variables from `.env.example` in Project Settings → Environment Variables. Do not commit `.env`. Set `META_APP_ID`, `META_APP_SECRET`, `META_LOGIN_CONFIG_ID`, `META_REDIRECT_URI`, and a 32-byte `META_TOKEN_ENCRYPTION_KEY`.
3. Add/connect Neon Postgres and set `DATABASE_URL` (or `POSTGRES_URL`).
4. Deploy. The app creates/updates its tables and indexes automatically on first startup.
5. Check `/health` and verify all expected integrations show `true`.
6. Configure the webhook URLs below, then test with a Meta app-role account and Razorpay test mode before enabling real sales.

## Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` / `POSTGRES_URL` | Postgres connection |
| `DASHBOARD_PASSWORD` | Dashboard password, minimum 16 chars; use 32+ random chars |
| `GEMINI_API_KEY` | Google Gemini API key |
| `GEMINI_MODEL` | Gemini model ID (default: `gemini-3.8-flash`) |
| `IG_ACCESS_TOKEN` | Instagram API access token |
| `IG_APP_SECRET` | Meta app secret for webhook signature validation |
| `IG_VERIFY_TOKEN` | Random webhook verification token |
| `IG_API_VERSION` | Current Graph API version supported by your Meta app (required; no stale default) |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | Razorpay API credentials |
| `RAZORPAY_WEBHOOK_SECRET` | Secret configured on the Razorpay webhook |
| `RESEND_API_KEY`, `MAIL_FROM`, `OWNER_EMAIL` | Order and owner notification email |
| `PRICE_CAR`, `PRICE_BIKE` | Whole-rupee prices (defaults ₹1,200 and ₹700) |
| `DELAY_SCALE` | Human-like delays; set `0` for testing |

## Instagram webhook

Callback URL: `https://YOUR_DOMAIN/webhook/instagram`

Verify token: the exact value of `IG_VERIFY_TOKEN`.

Subscribe to the `messages` webhook field. The Instagram account must be Professional. Meta app review/permissions may be required for customers outside app roles. Instagram's messaging window and policy restrictions still apply; the app does not bypass them.

## Razorpay webhook

URL: `https://YOUR_DOMAIN/webhook/razorpay`

Subscribe to `qr_code.credited`. Set the webhook secret in `RAZORPAY_WEBHOOK_SECRET`.

A screenshot or a customer's claim is never proof of payment. The app checks the Razorpay payment resource itself and only accepts a captured INR payment for the exact pending amount and matching QR code. Do a full test-mode payment before going live.

## Customer memory and history

- Full message history is stored in `msgs` and the agent uses the latest 30 messages in the current conversation.
- Durable cross-conversation customer facts and summary are stored in `customer_profiles`, keyed by the Instagram sender ID.
- The agent can call `remember_customer` to save useful, non-sensitive preferences/context. Do not store passwords, payment credentials, or sensitive personal information.
- The agent also receives the customer's five most recent paid orders. The dashboard displays saved facts and summary, and up to 50 previous paid orders.
- Memory is application data in your Postgres database, not model training. Existing Instagram DMs from before deployment are not automatically imported; import them only through an authorized Meta data export/API workflow and after checking customer privacy and consent requirements.

## Important production checks

- Use a current Meta Graph API version and confirm the Instagram Login messaging endpoint/token scopes match your app configuration. `IG_API_VERSION` is configurable because Meta versions change.
- Confirm the configured Gemini model ID is available to your Google AI Studio API key.
- Verify the exact Razorpay QR webhook payload and test captured/failed/duplicate event scenarios in test mode.
- Configure log monitoring and database backups/retention. Customer chat history includes personal contact and delivery details; restrict database and dashboard access.
- Test delivery address, phone validation, paused chats, duplicate webhook events, refunds/complaints, and Meta's 24-hour messaging window before launch.

## Commands

- `npm start` — start the server
- `npm test` — syntax checks for server and dashboard
