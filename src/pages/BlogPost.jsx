import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import posts from '../data/posts';

function BlogPost() {
  const { slug } = useParams();
  const postIndex = posts.findIndex((item) => item.slug === slug);
  const post = posts[postIndex];

  const prevPost = postIndex > 0 ? posts[postIndex - 1] : null;
  const nextPost = postIndex < posts.length - 1 ? posts[postIndex + 1] : null;

  if (!post) {
    return (
      <section className="section section-narrow">
        <p className="eyebrow">Post not found</p>
        <h1 className="section-heading">Missing Post</h1>
        <Link to="/blog" className="site-resume-btn">
          Back to Blog
        </Link>
      </section>
    );
  }

  const handleShare = async () => {
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || post.title,
          url: shareUrl,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert('Post link copied to clipboard.');
    }
  };

  return (
    <section className="section section-narrow">
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/blog" className="eyebrow" style={{ textDecoration: 'none' }}>
          ← Back to Blog
        </Link>
      </div>

      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          color: 'var(--color-text-muted)',
          marginBottom: '0.75rem',
        }}
      >
        {post.date} • {post.readingTime} min read
      </p>

      <h1
        style={{
          fontSize: 'clamp(2rem, 5vw, 3.2rem)',
          marginBottom: '0.75rem',
        }}
      >
        {post.title}
      </h1>

      {post.excerpt && (
        <p
          style={{
            fontSize: '1.05rem',
            maxWidth: '760px',
            marginBottom: '1.2rem',
          }}
        >
          {post.excerpt}
        </p>
      )}

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '1.5rem',
        }}
      >
        {post.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--color-accent)',
              padding: '0.3rem 0.55rem',
              border: '1px solid rgba(100,255,218,0.2)',
              borderRadius: '999px',
              background: 'rgba(100,255,218,0.06)',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={handleShare}
          className="site-resume-btn"
          style={{ background: 'transparent' }}
        >
          Share Post
        </button>
      </div>

      <article
        style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '2rem',
        }}
      >
        <div className="blog-markdown">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              code({ inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const codeText = String(children).replace(/\n$/, '');

                if (!inline && match) {
                  return (
                    <SyntaxHighlighter language={match[1]} PreTag="div">
                      {codeText}
                    </SyntaxHighlighter>
                  );
                }

                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '1rem',
          marginTop: '3rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div>
          {prevPost && (
            <>
              <p className="eyebrow" style={{ marginBottom: '0.35rem' }}>
                Previous
              </p>
              <Link to={`/blog/${prevPost.slug}`} style={{ color: 'var(--color-heading)' }}>
                ← {prevPost.title}
              </Link>
            </>
          )}
        </div>

        <div style={{ textAlign: 'right' }}>
          {nextPost && (
            <>
              <p className="eyebrow" style={{ marginBottom: '0.35rem' }}>
                Next
              </p>
              <Link to={`/blog/${nextPost.slug}`} style={{ color: 'var(--color-heading)' }}>
                {nextPost.title} →
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default BlogPost;