const chatEndpoint = import.meta.env.VITE_CHAT_API_URL?.trim();

export function isChatConfigured() {
  return Boolean(chatEndpoint);
}

export async function sendChatMessage({ message, history, context, visitorId }) {
  if (!chatEndpoint) {
    throw new Error('The secure model endpoint has not been connected yet.');
  }

  const response = await fetch(chatEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history, context, visitorId }),
  });

  let payload;
  try {
    payload = await response.json();
  } catch {
    payload = {};
  }

  if (!response.ok) {
    throw new Error(payload.error || 'The assistant could not answer right now.');
  }

  return payload;
}
