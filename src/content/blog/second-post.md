---
title: "Testing Code Blocks and Markdown Rendering"
date: "2026-04-13"
excerpt: "A small test post to verify code formatting, markdown structure, and mathematical notation."
tags: [Testing, Code, Markdown]
---

This is a test post for checking blog rendering.

## Inline code

Here is some inline code: `posterior_mean = samples.mean()`.

## Python code block

```python
import numpy as np

samples = np.random.normal(loc=0, scale=1, size=1000)
posterior_mean = samples.mean()
posterior_sd = samples.std()

print("Posterior mean:", posterior_mean)
print("Posterior sd:", posterior_sd)
```