import { Link } from 'react-router-dom';
import posts from '../data/posts';

function Blog() {
  return (
    <section className="section section-narrow">
      <p className="eyebrow">04. Blog</p>
      <h1 className="section-heading">Writing</h1>

      <p style={{ maxWidth: '720px', marginBottom: '2rem' }}>
        Notes on statistics, machine learning, econometrics, research, and
        quantitative thinking. Longer-form writing lives here as Markdown-based
        posts with mathematical notation support.
      </p>

      <div style={{ display: 'grid', gap: '1.25rem' }}>
        {posts.map((post) => (
          <article
            key={post.slug}
            className="hover-lift"
            style={{
              border: '1px solid var(--color-border-soft)',
              borderRadius: '16px',
              padding: '1.4rem',
              background: 'var(--color-surface)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--color-text-muted)',
                marginBottom: '0.55rem',
              }}
            >
              {post.date} • {post.readingTime} min read
            </p>

            <h2
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1.35rem',
                marginBottom: '0.7rem',
              }}
            >
              <Link
                to={`/blog/${post.slug}`}
                style={{
                  color: 'var(--color-heading)',
                  textDecoration: 'none',
                }}
              >
                {post.title}
              </Link>
            </h2>

            <p style={{ marginBottom: '1rem' }}>{post.excerpt}</p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                marginBottom: '1rem',
              }}
            >
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--color-identity)',
                    padding: '0.3rem 0.55rem',
                    border: '1px solid var(--color-identity-border)',
                    borderRadius: '999px',
                    background: 'var(--color-identity-muted)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <Link
              to={`/blog/${post.slug}`}
              className="site-resume-btn"
              style={{ display: 'inline-block' }}
            >
              Read Post →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Blog;
