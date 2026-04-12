import { NavLink, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import navLinks from '../../data/navLinks';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? 'site-header-scrolled' : ''}`}>
      <nav className="site-nav">
        <Link to="/" className="site-logo" aria-label="Home">
          <span className="site-logo-inner">J</span>
        </Link>

        <div className="site-nav-links">
          {navLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `site-nav-link link-underline ${isActive ? 'active' : ''}`
              }
            >
              <span className="site-nav-number">{item.number}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}

          <NavLink
            to="/resume"
            className={({ isActive }) =>
              `site-resume-btn ${isActive ? 'active' : ''}`
            }
          >
            Resume
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;