import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import HomeServicesSection from '@/components/ui/home-services';
import './home-services.css';

const mount = document.getElementById('home-services-root');

if (!mount) throw new Error('Homepage services root was not found.');

createRoot(mount).render(
  <StrictMode>
    <HomeServicesSection />
  </StrictMode>,
);
