import { Button } from '@/components/ui/button';
import cargoShipImage from '../../../assets/hero-cargo-ship.jpg';

export default function AgencyHeroSection() {
  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="home-hero"
    >
      <div className="home-hero__backdrop" aria-hidden="true">
        <img
          src={cargoShipImage}
          alt=""
          className="is-active"
          fetchPriority="high"
        />
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