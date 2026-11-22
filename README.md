# Jonathan Ma's Personal Website

My [personal website](https://jonathanma03.github.io/) built with React and Vite and deployed through GitHub Pages. Credit to [Brittany Chiang](https://brittanychiang.com/) for the original design inspiration.

## Adding Content

### Blog Posts

create `src/content/blog/your-post-name.md` and populate

```
---
title: "Your Post Title"
date: "YYYY-MM-DD"
excerpt: "Short summary of the post."
tags: [Tag1, Tag2, Tag3]
---
```

Supports latex with $ and code with backticks

### Projects 

Edit `src/data/projects.js` with

```js
{
  name: "Project Title",
  description: "Short description of the project.",
  tech: ["Python", "React", "R"],
  link: "https://github.com/your-repo",
  category: "Category / Domain"
}
```

### Experiences

Edit `src/data/experience.js` with

```js
{
  role: "Job Title",
  organization: "Company / University",
  period: "Start — End",
  tags: ["Research", "Academic", "Leadership"],
  bullets: [
    "Key contribution or impact",
    "Another contribution",
    "Optional third bullet"
  ]
}
```

## Deploying

### Normal website and content updates

1. Test the website locally. This also regenerates the chatbot knowledge base as content changes:

   ```bash
   npm run dev
   ```

2. Publish the website. The deployment runs a fresh production build and regenerates the knowledge base automatically:

   ```bash
   npm run deploy
   ```

Changes to `src/data/`, `src/content/blog/`, and `src/content/extras/` do not require a Worker redeployment.

### Chatbot Worker updates

Run the following only after changing files in `worker/` or the Worker configuration:

```bash
npm run worker:deploy
```

When both the website and Worker changed, use this order:

```bash
npm run dev
npm run worker:deploy
npm run deploy
```

The Worker URL is configured through `VITE_CHAT_API_URL` in `.env.local`. The URL is public and safe to expose; the OpenAI API key remains an encrypted Cloudflare Worker secret and must never be added to this repository.

See [docs/chatbot-setup.md](docs/chatbot-setup.md) for initial setup and troubleshooting.

### Version control

Commit source changes separately from deployment:

```bash
git add .
git commit -m "your message"
git push
```
