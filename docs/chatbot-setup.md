# Embedded chatbot setup

The website performs retrieval in the visitor's browser using the generated
`knowledge-base.json`. Only the question, recent conversation, and six relevant
passages are sent to a small Cloudflare Worker. The Worker keeps the OpenAI API
key private and calls the Responses API. No Supabase, Railway, vector database,
or separate chatbot frontend is required.

## Local interface and retrieval test

Run the website normally:

```bash
npm run dev
```

Open `/assistant`. Without a configured API endpoint, the page runs in
knowledge-search preview mode and shows which sources it retrieves.

## Configure the Worker locally

1. Copy the example secret file:

   ```bash
   cp worker/.dev.vars.example worker/.dev.vars
   ```

2. Replace the placeholder value in `worker/.dev.vars` with a restricted OpenAI
   project API key. The file is ignored by Git.

3. In one terminal, start the Worker:

   ```bash
   npm run worker:dev
   ```

4. Create `.env.local` in the repository root:

   ```dotenv
   VITE_CHAT_API_URL="http://localhost:8787/chat"
   ```

5. Start or restart `npm run dev` in a second terminal.

## Deploy the Worker

Authenticate and store the production key as an encrypted Worker secret:

```bash
npx wrangler login
npx wrangler secret put OPENAI_API_KEY --config worker/wrangler.jsonc
npm run worker:deploy
```

Wrangler prints the deployed `workers.dev` URL. Add `/chat` and set it as
`VITE_CHAT_API_URL` in `.env.local` before running the website deployment. Since
the existing deployment command builds locally, Vite will compile that endpoint
into the static site without exposing the OpenAI key.

## Updating knowledge

Edit files in `src/data/`, `src/content/blog/`, or `src/content/extras/`. Vite
regenerates the knowledge file during development and every production build.
No embedding job or database re-index is necessary.

## Cost and abuse controls

- The browser sends at most six retrieved passages rather than the full corpus.
- The interface permits ten messages per browser session.
- The Worker applies an approximate ten-request-per-minute visitor limit.
- Questions, history, context, and output lengths are capped.
- The model is configurable through `OPENAI_MODEL`; the default is `gpt-6-luna`.
- Configure OpenAI project budgets and alerts separately as the final billing safeguard.
