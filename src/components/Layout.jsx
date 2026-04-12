import { Outlet } from 'react-router-dom';
import Navbar from './layout/Navbar';
import SocialRail from './layout/SocialRail';
import EmailRail from './layout/EmailRail';

function Layout() {
  return (
    <div className="site-shell">
      <Navbar />
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