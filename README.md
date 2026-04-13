# Jonathan Ma's Personal Website

My [personal website](https://jonathanma03.github.io/) as a static git page built using React and Vite. This is version 1, version 2 is forthcoming and uses Netlify for deployment.

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

- Test locally at `npm run dev`
- Run the following to test for deployment errors: `npm run build` and `npm run preview`
- commit changes (updates the branch, either v2 or main)
```bash
git add .
git commit -m "your message"
git push
```
- deploy at `npm run deploy`
- wait 60 sec and refresh the page