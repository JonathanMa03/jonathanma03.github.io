import assert from 'node:assert/strict';
import test from 'node:test';
import worker from './index.js';

const origin = 'http://localhost:5173';
const baseEnv = {
  ALLOWED_ORIGINS: origin,
  OPENAI_API_KEY: 'test-key',
  OPENAI_MODEL: 'test-model',
  CHAT_RATE_LIMITER: { limit: async () => ({ success: true }) },
};

function request(path, options = {}) {
  return new Request(`https://assistant.example${path}`, options);
}

test('health endpoint does not disclose secrets', async () => {
  const response = await worker.fetch(request('/health'), {});
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok', modelConfigured: false });
});

test('returns a compact cached GitHub snapshot', async (context) => {
  const originalFetch = globalThis.fetch;
  context.after(() => { globalThis.fetch = originalFetch; });
  globalThis.fetch = async (url) => {
    if (url.endsWith('/users/JonathanMa03')) {
      return Response.json({ public_repos: 36, followers: 1, following: 7 });
    }

    return Response.json([{
      id: 123,
      name: 'example',
      html_url: 'https://github.com/JonathanMa03/example',
      description: 'Example project',
      language: 'Python',
      stargazers_count: 2,
      forks_count: 1,
      pushed_at: '2026-11-24T12:00:00Z',
      languages_url: 'https://api.github.com/unused',
    }]);
  };

  const response = await worker.fetch(request('/github', {
    headers: { Origin: origin },
  }), baseEnv);
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(payload.user, { public_repos: 36, followers: 1, following: 7 });
  assert.equal(payload.repositories[0].language, 'Python');
  assert.equal(payload.repositories[0].languages_url, undefined);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), origin);
  assert.match(response.headers.get('Cache-Control'), /max-age=300/);
});

test('rejects unknown origins', async () => {
  const response = await worker.fetch(request('/chat', {
    method: 'POST',
    headers: { Origin: 'https://attacker.example' },
  }), baseEnv);
  assert.equal(response.status, 403);
});

test('validates chat requests before calling the model', async () => {
  const response = await worker.fetch(request('/chat', {
    method: 'POST',
    headers: { Origin: origin, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: '', context: [] }),
  }), baseEnv);
  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /question/i);
});

test('returns grounded model output and source metadata', async (context) => {
  const originalFetch = globalThis.fetch;
  context.after(() => { globalThis.fetch = originalFetch; });
  globalThis.fetch = async (_url, options) => {
    const payload = JSON.parse(options.body);
    assert.equal(payload.store, false);
    assert.match(payload.input, /Retrieved website context/);
    return new Response(JSON.stringify({
      output: [{ content: [{ type: 'output_text', text: 'Jonathan studies forecasting. [1]' }] }],
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  };

  const response = await worker.fetch(request('/chat', {
    method: 'POST',
    headers: { Origin: origin, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'What does Jonathan study?',
      history: [],
      visitorId: 'visitor-test',
      context: [{
        id: 'source-1',
        title: 'Research',
        section: 'Interests',
        url: '/about',
        content: 'Jonathan studies probabilistic forecasting.',
      }],
    }),
  }), baseEnv);

  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.answer, 'Jonathan studies forecasting. [1]');
  assert.equal(payload.sources[0].id, 'source-1');
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), origin);
});
