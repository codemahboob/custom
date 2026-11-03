/**
 * Convert the agent's small internal message format to Gemini GenerateContent
 * parts while preserving Gemini 3 thought signatures and function-call IDs.
 */
export function toGeminiContents(messages) {
  return messages.map((message) => {
    const role = message.role === 'assistant' ? 'model' : 'user';
    const blocks = Array.isArray(message.content)
      ? message.content
      : [{ type: 'text', text: String(message.content ?? '') }];
    const parts = blocks.flatMap((block) => {
      if (block.type === 'text') {
        if (!block.text && !block.thoughtSignature) return [];
        return [{
          ...(block.text ? { text: block.text } : {}),
          ...(block.thoughtSignature ? { thoughtSignature: block.thoughtSignature } : {}),
        }];
      }
      if (block.type === 'tool_use') {
        if (!block.name) return [];
        return [{
          functionCall: {
            name: block.name,
            args: block.input || {},
            ...(block.id ? { id: block.id } : {}),
          },
          ...(block.thoughtSignature ? { thoughtSignature: block.thoughtSignature } : {}),
        }];
      }
      if (block.type === 'tool_result') {
        const name = block.name;
        if (!name) return [];
        return [{
          functionResponse: {
            name,
            response: { output: String(block.content ?? '') },
            ...(block.tool_use_id ? { id: block.tool_use_id } : {}),
          },
        }];
      }
      return [];
    });
    return parts.length ? { role, parts } : null;
  }).filter(Boolean);
}

/** Keep the complete function-call metadata required for the next REST turn. */
export function fromGeminiParts(parts) {
  return (Array.isArray(parts) ? parts : []).flatMap((part) => {
    if (typeof part?.text === 'string' && part.text) {
      return [{
        type: 'text',
        text: part.text,
        ...(part.thoughtSignature ? { thoughtSignature: part.thoughtSignature } : {}),
      }];
    }
    if (part?.functionCall?.name) {
      return [{
        type: 'tool_use',
        id: part.functionCall.id || null,
        name: part.functionCall.name,
        input: part.functionCall.args || {},
        ...(part.thoughtSignature ? { thoughtSignature: part.thoughtSignature } : {}),
      }];
    }
    return [];
  });
}
