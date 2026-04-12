const modules = import.meta.glob('../content/blog/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  });
  
  function estimateReadingTime(text) {
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  }
  
  function parseFrontmatter(raw, fallbackSlug) {
    const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  
    if (!match) {
      return {
        slug: fallbackSlug,
        title: fallbackSlug,
        date: '',
        excerpt: '',
        tags: [],
        content: raw,
      };
    }
  
    const frontmatterBlock = match[1];
    const content = raw.slice(match[0].length);
  
    const data = {
      slug: fallbackSlug,
      title: fallbackSlug,
      date: '',
      excerpt: '',
      tags: [],
    };
  
    frontmatterBlock.split('\n').forEach((line) => {
      const [key, ...rest] = line.split(':');
      if (!key || rest.length === 0) return;
  
      const value = rest.join(':').trim();
  
      if (key.trim() === 'title') {
        data.title = value.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
      }
  
      if (key.trim() === 'date') {
        data.date = value.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
      }
  
      if (key.trim() === 'excerpt') {
        data.excerpt = value.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
      }
  
      if (key.trim() === 'tags') {
        data.tags = value
          .replace(/^\[/, '')
          .replace(/\]$/, '')
          .split(',')
          .map((tag) => tag.trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1'))
          .filter(Boolean);
      }
    });
  
    return {
      ...data,
      content,
    };
  }
  
  const posts = Object.entries(modules)
    .map(([path, raw]) => {
      const slug = path.split('/').pop().replace('.md', '');
      const parsed = parseFrontmatter(raw, slug);
  
      return {
        ...parsed,
        slug,
        readingTime: estimateReadingTime(parsed.content),
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  
  export default posts;