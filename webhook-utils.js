import crypto from 'node:crypto';

export function safeEqual(left, right) {
  const a = Buffer.from(String(left ?? ''), 'utf8');
  const b = Buffer.from(String(right ?? ''), 'utf8');
  return a.length > 0 && a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function verifyMetaWebhookSignature(rawBody, signatureHeader, appSecret) {
  if (!Buffer.isBuffer(rawBody) || !String(appSecret || '').trim()) return false;
  const supplied = String(signatureHeader || '');
  if (!/^sha256=[a-f0-9]{64}$/i.test(supplied)) return false;
  const expected = 'sha256=' + crypto.createHmac('sha256', String(appSecret).trim()).update(rawBody).digest('hex');
  return safeEqual(supplied.toLowerCase(), expected);
}

export function normalizeInstagramMessageEvents(body) {
  const entries = Array.isArray(body?.entry) ? body.entry : [];
  const messagingEvents = entries.flatMap((entry) =>
    Array.isArray(entry?.messaging) ? entry.messaging : []
  );
  const changeEvents = entries.flatMap((entry) =>
    (Array.isArray(entry?.changes) ? entry.changes : [])
      .filter((change) => change?.field === 'messages')
      .flatMap((change) => {
        const value = change?.value;
        if (!value || typeof value !== 'object') return [];
        if (Array.isArray(value.messaging)) return value.messaging;
        if (Array.isArray(value.messages)) {
          return value.messages.map((message) => ({
            ...value,
            ...message,
            sender: message?.sender || value.sender,
            timestamp: message?.timestamp || value.timestamp,
            message: message?.message || message,
          }));
        }
        if (value.message && value.sender?.id) return [value];
        if (value.sender?.id && (value.mid || value.message_id)) {
          return [{
            ...value,
            message: {
              mid: value.mid || value.message_id,
              text: value.text,
              attachments: value.attachments,
              is_echo: value.is_echo,
            },
          }];
        }
        return [];
      })
  );
  const allEvents = [...messagingEvents, ...changeEvents];
  const events = allEvents.filter((event) =>
    event?.message && !event.message.is_echo && event.sender?.id &&
    (event.message.mid || event.message.message_id)
  );
  const ignored = {
    noMessage: allEvents.filter((event) => !event?.message).length,
    echo: allEvents.filter((event) => Boolean(event?.message?.is_echo)).length,
    missingSender: allEvents.filter((event) => event?.message && !event.message.is_echo && !event.sender?.id).length,
    missingMessageId: allEvents.filter((event) =>
      event?.message && !event.message.is_echo && event.sender?.id &&
      !(event.message.mid || event.message.message_id)
    ).length,
  };
  return { entries, messagingEvents, changeEvents, allEvents, events, ignored };
}
