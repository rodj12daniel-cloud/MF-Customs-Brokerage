import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const mount = document.getElementById('home-hero-root');

if (!mount) throw new Error('Homepage hero root was not found.');

createRoot(mount).render(
  <StrictMode>
    <App />
  </StrictMode>,
);