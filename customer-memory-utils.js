const sensitiveKey = /(?:phone|mobile|address|email|name|password|payment|card|upi|dob|birth|religion|health|medical|caste|ethnic|race|politic|sexual|orientation|criminal|passport|aadhaar|aadhar|pan|account|bank|location|pincode|postal|pin_code)/i;
const sensitiveText = /(?:\b\d{8,}\b|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|\b(?:phone|mobile|address|email|name|password|payment|card number|upi|date of birth|birthday|religion|caste|health|medical|diagnosis|medication|ethnicity|race|political|sexual|criminal|passport|aadhaar|aadhar|pan|bank account|account number|location|pincode|pin code)\b)/i;

/**
 * Persist only short, non-sensitive customer preferences. This is a filter,
 * not a substitute for limiting access to the underlying order/message data.
 */
export function sanitizeCustomerMemory(facts, summary) {
  const source = facts && typeof facts === 'object' && !Array.isArray(facts) ? facts : {};
  const safeFacts = Object.fromEntries(
    Object.entries(source)
      .filter(([key, value]) =>
        /^[a-z0-9_]{2,40}$/i.test(key) &&
        !sensitiveKey.test(key) &&
        typeof value === 'string' &&
        value.trim().length > 0 &&
        value.length <= 240 &&
        !sensitiveText.test(value)
      )
      .slice(0, 20)
      .map(([key, value]) => [key, value.trim()])
  );
  const rawSummary = typeof summary === 'string' ? summary.trim().slice(0, 500) : '';
  const safeSummary = rawSummary && !sensitiveText.test(rawSummary) && !sensitiveKey.test(rawSummary)
    ? rawSummary
    : '';
  return { facts: safeFacts, summary: safeSummary };
}
