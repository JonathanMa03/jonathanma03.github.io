import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './layout/Navbar';
import SocialRail from './layout/SocialRail';
import EmailRail from './layout/EmailRail';

function Layout() {
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || 'light'
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('site-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => currentTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="site-shell">
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <SocialRail />
      <EmailRail />

      <main className="site-main">
        <div className="site-content fade-up">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;
