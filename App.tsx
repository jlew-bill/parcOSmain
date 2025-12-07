import React, { useState, useEffect } from 'react';
import { Landing } from './pages/Landing';
import { Pricing } from './pages/Pricing';
import { OS } from './pages/OS';

function App() {
  const [route, setRoute] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '#/');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToOS = () => {
    window.location.hash = 'app';
  };

  switch (route) {
    case '#pricing':
      return <Pricing />;
    case '#app':
      return <OS />;
    case '#/':
    default:
      return <Landing onLaunch={navigateToOS} />;
  }
}

export default App;
