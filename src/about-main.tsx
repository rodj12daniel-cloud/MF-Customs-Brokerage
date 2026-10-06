import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AboutCinematic from './components/ui/about-cinematic';
import './index.css';

const mount = document.getElementById('about-hero-root');

if (!mount) throw new Error('About section root was not found.');

createRoot(mount).render(
  <StrictMode>
    <AboutCinematic />
  </StrictMode>,
);
