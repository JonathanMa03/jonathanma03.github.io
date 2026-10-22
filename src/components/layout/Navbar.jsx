import { NavLink, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';
import navLinks from '../../data/navLinks';

function Navbar({ theme, onToggleTheme }) {
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
        <Link to="/" className="site-logo" aria-label="Home" data-tofu-tour="home">
          <span className="site-logo-inner">J</span>
        </Link>

        <div className="site-nav-links">
          {navLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              data-tofu-tour={item.label.toLowerCase()}
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
            data-tofu-tour="resume"
            className={({ isActive }) =>
              `site-resume-btn ${isActive ? 'active' : ''}`
            }
          >
            Resume/CV
          </NavLink>

          <button
            type="button"
            className="site-theme-toggle"
            data-tofu-tour="theme"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            aria-pressed={theme === 'dark'}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <FiMoon aria-hidden="true" /> : <FiSun aria-hidden="true" />}
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
