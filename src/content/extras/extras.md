---
title: Extra Knowledge Template
category: Template
enabled: false
---

# Extra knowledge file template

Use this file as a model when adding public information that does not fit in the
website's structured data or blog posts. Copy the template below into a new
Markdown file in `src/content/extras/`, then replace the placeholder content.

```md
---
title: A clear, specific title
category: Projects, Research, Personal, FAQ, or another useful label
enabled: true
sourceUrl: /optional-relevant-page
---

# Topic name

## Summary

Write two or three sentences that answer the most likely question about this
topic. Use complete names and concrete language.

## Key facts

- Fact with a specific date, role, result, or scope.
- Fact that adds useful context not already available elsewhere.
- Fact that explains why the topic matters.

## Details

Add longer background, methods, responsibilities, outcomes, or frequently
asked questions here. Use descriptive headings when the topic has multiple
parts.

## Links

- [Descriptive link name](https://example.com)
```

## Writing guidelines

- Include only information that is safe to make public.
- Prefer one subject per file so retrieved passages remain focused.
- Use explicit names and dates instead of phrases such as “recently” or “last year.”
- Use descriptive Markdown links rather than pasting unexplained URLs.
- Avoid duplicating facts already maintained in `src/data/` or `src/content/blog/`.
- Set `enabled: false` while drafting and change it to `true` when the content is ready.
- Update the source file when a credential, role, publication, or project changes.

This template is intentionally disabled so its instructions will not be added
to the chatbot knowledge base.
