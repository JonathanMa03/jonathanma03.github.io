import socialLinks from '../../data/socialLinks';

function SocialRail() {
  const railLinks = socialLinks
    .filter((item) => Number.isFinite(item.railOrder))
    .sort((a, b) => a.railOrder - b.railOrder);

  return (
    <div className="rails-left">
      <div className="rail-stack">
        {railLinks.map(({ name, url, icon: Icon }) => (
          <a
            key={name}
            href={url}
            target={url.startsWith('http') ? '_blank' : undefined}
            rel={url.startsWith('http') ? 'noopener noreferrer' : undefined}
            aria-label={name}
            className="rail-icon-link"
          >
            <Icon size={22} />
          </a>
        ))}

        <div className="rail-line" />
      </div>
    </div>
  );
}

export default SocialRail;
