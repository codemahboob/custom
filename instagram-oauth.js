import express from 'express';
import crypto from 'node:crypto';

const apiVersionSetting = String(process.env.META_API_VERSION || '').trim() || 'v26.0';
const API_VERSION = `v${apiVersionSetting.replace(/^v/i, '')}`;
if (!/^v\d+\.\d+$/.test(API_VERSION)) throw new Error('META_API_VERSION must look like v26.0.');
const graph = (path) => `https://graph.facebook.com/${API_VERSION}/${path}`;
const key = () => {
  const raw = String(process.env.META_TOKEN_ENCRYPTION_KEY || '').trim();
  let bytes;
  if (/^[a-f0-9]{64}$/i.test(raw)) bytes = Buffer.from(raw, 'hex');
  else bytes = Buffer.from(raw, 'base64');
  if (bytes.length !== 32) throw new Error('META_TOKEN_ENCRYPTION_KEY must be 32 random bytes encoded as 64 hex characters or base64.');
  return bytes;
};
const encrypt = (value) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key(), iv);
  const data = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  return [iv, cipher.getAuthTag(), data].map((part) => part.toString('base64url')).join('.');
};
const decrypt = (value) => {
  const [iv, tag, data] = String(value).split('.').map((part) => Buffer.from(part, 'base64url'));
  const decipher = crypto.createDecipheriv('aes-256-gcm', key(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
};
const readJson = async (response) => {
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.error) throw new Error(body.error?.message || body.error_description || `Meta request failed (${response.status})`);
  return body;
};
const required = (...names) => {
  const missing = names.filter((name) => !String(process.env[name] || '').trim());
  if (missing.length) throw new Error(`Missing environment variables: ${missing.join(', ')}`);
};

export async function storeInstagramIntegration(q, { accessToken, igUserId }) {
  required('META_TOKEN_ENCRYPTION_KEY');
  key();
  const existing = await q("SELECT business_id FROM meta_integrations WHERE provider='instagram' LIMIT 1");
  await q(`INSERT INTO meta_integrations(provider,token_ciphertext,ig_user_id,username,business_id,token_expires_at,connected_at)
    VALUES('instagram',$1,$2,NULL,$3,NULL,$4)
    ON CONFLICT(provider) DO UPDATE SET token_ciphertext=EXCLUDED.token_ciphertext,
    ig_user_id=EXCLUDED.ig_user_id,username=NULL,business_id=COALESCE(meta_integrations.business_id,EXCLUDED.business_id),
    token_expires_at=NULL,connected_at=EXCLUDED.connected_at`,
  [encrypt(accessToken), String(igUserId), existing.rows[0]?.business_id || null, Date.now()]);
}

export async function getInstagramIntegration(q) {
  const result = await q("SELECT * FROM meta_integrations WHERE provider='instagram' LIMIT 1");
  const row = result.rows[0];
  if (!row) return null;
  return {
    access_token: decrypt(row.token_ciphertext),
    ig_user_id: row.ig_user_id,
    username: row.username,
    business_id: row.business_id,
    token_expires_at: row.token_expires_at,
  };
}

export function createInstagramOAuthRouter({ q, ready }) {
  const router = express.Router();
  const redirectUri = () => String(process.env.META_REDIRECT_URI || '').trim() ||
    `${String(process.env.APP_URL || 'https://custom-vert-zeta.vercel.app').trim().replace(/\/+$/, '')}/auth/instagram/callback`;

  router.use(async (_req, _res, next) => {
    try {
      await ready;
      await q(`CREATE TABLE IF NOT EXISTS meta_oauth_states(
        state_hash TEXT PRIMARY KEY, expires_at BIGINT NOT NULL
      )`);
      await q(`CREATE TABLE IF NOT EXISTS meta_integrations(
        provider TEXT PRIMARY KEY, token_ciphertext TEXT NOT NULL, ig_user_id TEXT NOT NULL,
        username TEXT, business_id TEXT, token_expires_at BIGINT, connected_at BIGINT NOT NULL
      )`);
      next();
    } catch (error) { next(error); }
  });

  router.get('/', async (_req, res) => {
    try {
      required('META_APP_ID', 'META_APP_SECRET', 'META_LOGIN_CONFIG_ID', 'META_TOKEN_ENCRYPTION_KEY');
      key(); // validate encryption configuration before sending the user to Meta
      const state = crypto.randomBytes(32).toString('hex');
      await q('DELETE FROM meta_oauth_states WHERE expires_at < $1', [Date.now()]);
      await q('INSERT INTO meta_oauth_states(state_hash,expires_at) VALUES($1,$2)', [
        crypto.createHash('sha256').update(state).digest('hex'), Date.now() + 10 * 60 * 1000,
      ]);
      const url = new URL('https://www.facebook.com/dialog/oauth');
      url.searchParams.set('client_id', process.env.META_APP_ID);
      url.searchParams.set('config_id', process.env.META_LOGIN_CONFIG_ID);
      url.searchParams.set('redirect_uri', redirectUri());
      url.searchParams.set('response_type', 'code');
      url.searchParams.set('state', state);
      url.searchParams.set('prompt', 'login');
      res.redirect(302, url.toString());
    } catch (error) {
      res.status(500).type('text').send(`Instagram connection could not start: ${error.message}`);
    }
  });

  router.get('/callback', async (req, res) => {
    try {
      required('META_APP_ID', 'META_APP_SECRET', 'META_LOGIN_CONFIG_ID', 'META_TOKEN_ENCRYPTION_KEY');
      key();
      if (req.query.error) throw new Error(String(req.query.error_description || req.query.error).slice(0, 300));
      const code = String(req.query.code || '');
      const state = String(req.query.state || '');
      if (!code || code.length > 4096 || !state || state.length > 256) {
        throw new Error('Meta did not return a valid authorization code and state.');
      }
      const stateHash = crypto.createHash('sha256').update(state).digest('hex');
      const consumed = await q('DELETE FROM meta_oauth_states WHERE state_hash=$1 AND expires_at>$2 RETURNING state_hash', [stateHash, Date.now()]);
      if (!consumed.rowCount) throw new Error('Login state is invalid or expired. Start the connection again.');

      const tokenUrl = new URL(graph('oauth/access_token'));
      tokenUrl.searchParams.set('client_id', process.env.META_APP_ID);
      tokenUrl.searchParams.set('client_secret', process.env.META_APP_SECRET);
      tokenUrl.searchParams.set('redirect_uri', redirectUri());
      tokenUrl.searchParams.set('code', code);
      const token = await readJson(await fetch(tokenUrl));
      if (!token.access_token) throw new Error('Meta did not return an access token.');

      const profileUrl = new URL(graph('me'));
      profileUrl.searchParams.set('fields', 'client_business_id');
      const profile = await readJson(await fetch(profileUrl, {
        headers: { Authorization: `Bearer ${token.access_token}` },
      }));
      const businessId = profile.client_business_id;
      if (!businessId) throw new Error('No business portfolio was shared with this app. Retry login and select your business portfolio.');

      const accountsUrl = new URL(graph('me/assigned_instagram_accounts'));
      accountsUrl.searchParams.set('fields', 'id,username');
      const accounts = await readJson(await fetch(accountsUrl, {
        headers: { Authorization: `Bearer ${token.access_token}` },
      }));
      const list = accounts.data || [];
      if (list.length !== 1) {
        if (!list.length) throw new Error('No Instagram professional account was shared. Check that CustomPlate90 is a Business or Creator account in the selected business portfolio, then reconnect.');
        throw new Error(`This login shared ${list.length} Instagram accounts. This app is configured for one account; adjust the Meta configuration to share only CustomPlate90, then reconnect.`);
      }
      const account = list[0];
      if (!account.id) throw new Error('Meta returned an Instagram account without an ID.');

      const subscribeUrl = new URL(graph(`${encodeURIComponent(account.id)}/subscribed_apps`));
      subscribeUrl.searchParams.set('subscribed_fields', 'messages');
      await readJson(await fetch(subscribeUrl, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token.access_token}` },
      }));

      const expiresAt = token.expires_in ? Date.now() + Number(token.expires_in) * 1000 : null;
      await q(`INSERT INTO meta_integrations(provider,token_ciphertext,ig_user_id,username,business_id,token_expires_at,connected_at)
        VALUES('instagram',$1,$2,$3,$4,$5,$6)
        ON CONFLICT(provider) DO UPDATE SET token_ciphertext=EXCLUDED.token_ciphertext,
        ig_user_id=EXCLUDED.ig_user_id,username=EXCLUDED.username,business_id=EXCLUDED.business_id,
        token_expires_at=EXCLUDED.token_expires_at,connected_at=EXCLUDED.connected_at`,
      [encrypt(token.access_token), String(account.id), account.username || null, String(businessId), expiresAt, Date.now()]);
      res.status(200).type('html').send(`<!doctype html><meta name="viewport" content="width=device-width"><title>Instagram connected</title><main style="font:16px system-ui;max-width:520px;margin:12vh auto;padding:24px"><h1>Instagram connected</h1><p>@${String(account.username || 'CustomPlate90').replace(/[&<>"]/g, '')} is now connected to CustomPlate90.</p><p>You can close this page and return to your dashboard.</p></main>`);
    } catch (error) {
      console.error('Instagram OAuth callback failed:', error.message);
      res.status(400).type('text').send(`Instagram connection failed: ${error.message}. Return to the dashboard and try connecting again.`);
    }
  });

  return router;
}
