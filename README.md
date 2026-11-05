# Plate DM Agent

Instagram DM sales assistant for custom number-plate orders. It uses Google Gemini for conversation, Razorpay UPI QR codes for payment, Neon/Postgres for durable conversations and customer memory, and Resend for owner notifications.

## What changed in 1.2.0

- Payment confirmation now retrieves the payment directly from Razorpay and checks `captured`, INR currency, exact amount, and the QR code associated with the pending order.
- The paid-order insert and conversation status update run in one Postgres transaction, with a unique payment ID to prevent duplicate orders from webhook retries/polling races.
- Added a durable Postgres-backed message queue with retry/backoff so webhook messages can be recovered if a serverless background invocation is interrupted. `/health` now reports queue job counts.
- Added persistent `customer_profiles` memory keyed by Instagram sender ID. The agent can save useful non-sensitive facts and a short summary, and receives that memory plus up to five previous paid orders in later conversations.
- Added a password-protected Instagram inbox in the dashboard with conversation history, manual replies, pause/resume controls, webhook deduplication, Unified Login username lookup, and a server-side 24-hour messaging-window guard.
- Added a dashboard customer panel showing saved facts, summary, and previous paid orders.
- Added phone/PIN validation, timing-safe webhook signature checks, stronger dashboard password validation, a health/configuration endpoint, and Vercel configuration.
- The agent uses Google's Gemini API with configurable model selection.
- Dashboard revenue, paid-order, conversation, and pending-payment totals are calculated with database aggregates, so lifetime figures are not capped by the inbox's 200-thread display limit.
- The inbox returns only the fields it needs; full customer profile and paid-order details load only for the selected conversation.
- The dashboard displays saved customer facts, summary, and recent paid-order history.
- Database startup includes additive migrations for existing tables and a unique message-ID index.
- Instagram webhook signature verification and payload normalization are isolated in tested utilities; generic subscription-test payloads are not mistaken for customer DMs.

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
4. Set `CRON_SECRET` to a long random value in Vercel. Add GitHub repository Actions secrets `APP_URL` (your deployed origin, e.g. `https://your-project.vercel.app`) and `CRON_SECRET` (the same value). The included GitHub Actions workflow drains/retries pending messages every five minutes; it can also be run manually.
5. Deploy. The app creates/updates its tables and indexes automatically on first startup.
6. Check `/health`, verify all expected integrations show `true`, and confirm the queue section is present.
7. Configure the webhook URLs below, then test with a Meta app-role account and Razorpay test mode before enabling real sales.

## Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` / `POSTGRES_URL` | Postgres connection |
| `DASHBOARD_PASSWORD` | Dashboard password, minimum 16 chars; use 32+ random chars |
| `SHOP_NAME` | Optional shop name used in the assistant's system prompt |
| `GEMINI_API_KEY` | Google Gemini API key |
| `GEMINI_MODEL` | Gemini model ID (default: `gemini-3.8-flash`) |
| `META_APP_ID`, `META_APP_SECRET` | Meta app credentials for Unified Login and webhook signatures |
| `META_LOGIN_CONFIG_ID` | Instagram Login Compatible Unified Login configuration ID |
| `META_API_VERSION` | Graph API version (default `v26.0`) |
| `META_REDIRECT_URI` | Exact OAuth callback URL registered in Meta |
| `META_TOKEN_ENCRYPTION_KEY` | 32-byte hex/base64 key used to encrypt the connected token in Postgres |
| `APP_URL` | Public app origin used to build the OAuth callback URL |
| `IG_VERIFY_TOKEN` | Random webhook verification token |
| `IG_USER_ID`, `IG_ACCESS_TOKEN` | Optional direct Unified Login System User Token fallback; set the Instagram professional account ID and a freshly rotated token |
| `IG_API_VERSION` | Optional Graph API version for the direct-token fallback when `META_API_VERSION` is not set |
| `IG_APP_SECRET` | Legacy alias for `META_APP_SECRET` used for Instagram webhook signature validation; both should be the same Meta app secret if both are set |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | Razorpay API credentials |
| `RAZORPAY_WEBHOOK_SECRET` | Secret configured on the Razorpay webhook |
| `RESEND_API_KEY`, `MAIL_FROM`, `OWNER_EMAIL` | Order and owner notification email |
| `PRICE_CAR`, `PRICE_BIKE` | Whole-rupee prices (defaults ₹1,200 and ₹700) |
| `DELAY_SCALE` | Human-like delays; set `0` for testing |
| `CRON_SECRET` | Bearer token required by the scheduled durable-queue recovery endpoint |

## Instagram Unified Login OAuth

This repository uses Instagram API with Unified Login (Facebook Login for Business configuration), not the standalone `graph.instagram.com` Instagram Login flow.

- OAuth start: `https://YOUR_DOMAIN/auth/instagram`
- OAuth callback / registered redirect URI: `https://YOUR_DOMAIN/auth/instagram/callback`
- Instagram webhook callback: `https://YOUR_DOMAIN/webhook/instagram` (not the OAuth redirect URI)
- Webhook verify token: the exact value of `IG_VERIFY_TOKEN`.

In Meta App Dashboard, select the Instagram API setup with Unified Login configuration labelled Instagram Login Compatible. Register the OAuth callback URL above as the redirect URI. Copy the Meta App ID, Meta App Secret and Configuration ID into Vercel. The configuration must include `instagram_basic` and `instagram_manage_messages`; permissions are selected in the Meta configuration, so the OAuth URL intentionally does not send a separate `scope` parameter.

If you prefer a direct System User Token instead of OAuth, set `IG_USER_ID` to the Instagram professional account ID and `IG_ACCESS_TOKEN` to a freshly generated Unified Login System User Token in Vercel. The server then uses `graph.facebook.com` with that account ID. Never use a token copied from a screenshot or an exposed Graph API Explorer `paging.next` URL; revoke it and generate a new one first. Keep `META_APP_SECRET` set for webhook signature validation (or use `IG_APP_SECRET` for the same app secret).

After deployment, open `/auth/instagram` and authorize the CustomPlate90 professional account. The callback exchanges the code, discovers the business portfolio and assigned Instagram account, subscribes it to the `messages` webhook field, and stores the token encrypted in Postgres. This implementation accepts exactly one assigned Instagram account to prevent connecting the wrong inbox. The account must be Business or Creator and shared from the selected business portfolio.

Generate `META_TOKEN_ENCRYPTION_KEY` with `openssl rand -hex 32`. Keep it in Vercel Environment Variables only; never commit it. If you rotate this key, reconnect Instagram after migrating the stored token.

The Meta webhook callback remains separate: set it to `https://YOUR_DOMAIN/webhook/instagram`, verify with `IG_VERIFY_TOKEN`, and subscribe to `messages`. Incoming webhook requests are verified with `META_APP_SECRET` (or the legacy `IG_APP_SECRET`) using `X-Hub-Signature-256`; message IDs are deduplicated before processing. The dashboard inbox is available on `/` after login. Manual replies use the connected Unified Login token and are blocked after the standard 24-hour customer messaging window expires. Meta App Review / Advanced Access may be required for people outside app roles. Instagram's messaging window and policy restrictions still apply.

## Durable message processing

Incoming Instagram messages are saved to `msgs` and enqueued in `message_jobs` before the webhook returns success. A best-effort `waitUntil` worker handles them immediately. If that serverless task is interrupted, the GitHub Actions workflow calls `/internal/process-queue` every five minutes to retry pending or expired-lease jobs with exponential backoff. Add the `APP_URL` and `CRON_SECRET` repository Actions secrets and set the same `CRON_SECRET` in Vercel. Jobs that fail eight times are marked `failed` for manual investigation; they are not silently discarded.

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

- Use a current Meta Graph API version and confirm the Unified Login configuration includes `instagram_basic` and `instagram_manage_messages`. `META_API_VERSION` is configurable because Meta versions change.
- Confirm the configured Gemini model ID is available to your Google AI Studio API key.
- Verify the exact Razorpay QR webhook payload and test captured/failed/duplicate event scenarios in test mode.
- Configure log monitoring and database backups/retention. Customer chat history includes personal contact and delivery details; restrict database and dashboard access.
- Test delivery address, phone validation, paused chats, duplicate webhook events, refunds/complaints, and Meta's 24-hour messaging window before launch.

## Commands

- `npm start` — start the server
- `npm test` — JavaScript syntax checks, dashboard/privacy consistency checks, and webhook utility unit tests
