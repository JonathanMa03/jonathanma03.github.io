import { useCallback, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import BootLoader from './components/BootLoader';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Experience from './pages/Experience';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Resume from './pages/Resume';
import Contact from './pages/Contact';
import Vibes from './pages/Vibes';

function App() {
  const [isBooting, setIsBooting] = useState(true);
  const completeBoot = useCallback(() => setIsBooting(false), []);

  if (isBooting) {
    return <BootLoader onComplete={completeBoot} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="projects" element={<Projects />} />
        <Route path="experience" element={<Experience />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogPost />} />
        <Route path="resume" element={<Resume />} />
        <Route path="contact" element={<Contact />} />
        <Route path="vibes" element={<Vibes />} />
      </Route>
    </Routes>
  );
}

export default App;
