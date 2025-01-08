const API_BASE_URL = 'https://api.metisai.ir/api/v1';
const API_KEY = 'tpsg-Tj4KXRAF5tq1ZK4c4jIQPBQosprf6Zn';

export async function getBots() {
  const response = await fetch(`${API_BASE_URL}/bots/all`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}

export async function createSession(botId: string) {
  const response = await fetch(`${API_BASE_URL}/chat/session`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      botId,
      user: null,
      initialMessages: [],
    }),
  });
  return response.json();
}

export async function sendMessage(sessionId: string, content: string) {
  const response = await fetch(`${API_BASE_URL}/chat/session/${sessionId}/message`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: {
        content,
        type: 'USER',
      },
    }),
  });
  return response.json();
}

export async function getSessions() {
  const response = await fetch(`${API_BASE_URL}/chat/session`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}

export async function getSession(sessionId: string) {
  const response = await fetch(`${API_BASE_URL}/chat/session/${sessionId}`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}

export async function deleteSession(sessionId: string) {
  const response = await fetch(`${API_BASE_URL}/chat/session/${sessionId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  return response.ok;
}