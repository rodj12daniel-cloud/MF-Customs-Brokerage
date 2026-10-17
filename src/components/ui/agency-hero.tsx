import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import cargoShipImage from '../../../assets/hero-cargo-ship.jpg';

const heroImages = [
  cargoShipImage,
  'https://images8.alphacoders.com/364/thumb-1920-364283.jpg',
];

export default function AgencyHeroSection() {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const interval = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % heroImages.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="home-hero"
    >
      <div className="home-hero__backdrop" aria-hidden="true">
        {heroImages.map((image, index) => (
          <img
            key={image}
            src={image}
            alt=""
            className={index === activeImage ? 'is-active' : ''}
            fetchPriority={index === 0 ? 'high' : 'auto'}
          />
        ))}
      </div>
      <main id="main" className="home-hero__content">
        <div className="home-hero__eyebrow">
          <span aria-hidden="true" />
          <span className="home-hero__eyebrow-copy">Customs brokerage / Philippines</span>
        </div>
        <h1 id="hero-title" className="home-hero__title">
          <span>Efficiency meets</span>
          <em>reliability.</em>
        </h1>
        <p className="home-hero__copy">
          Expert customs brokerage and logistics, built around your cargo, your timeline, and your business.
        </p>
        <div className="home-hero__actions">
          <Button asChild className="home-hero__button home-hero__button--primary">
            <a href="contact.html">
              Request a quote
            </a>
          </Button>
          <Button asChild variant="outline" className="home-hero__button home-hero__button--secondary">
            <a href="services.html">
              Explore services
            </a>
          </Button>
        </div>
      </main>
    </section>
  );
}