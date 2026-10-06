import { useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FADE_UP_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', duration: 0.8 } },
};

const STAGGER_CONTAINER_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

interface Feature {
  id: string;
  title: string;
  imageUrl: string;
  imageAlt: string;
  href: string;
  items: string[];
}

interface HomeServicesProps {
  title: ReactNode;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  features: Feature[];
}

const SERVICE_FEATURES: Feature[] = [
  {
    id: 'customs-clearance',
    title: 'Import and Export Customs Clearance',
    imageUrl: '/assets/hero.jpg',
    imageAlt: 'Cargo truck and shipping containers at a port',
    href: 'services.html',
    items: ['FCL and LCL', 'Formal and Informal', 'Bulk and Break Bulk Cargo', 'Warehousing'],
  },
  {
    id: 'freight-forwarding',
    title: 'Freight Forwarding',
    imageUrl: '/assets/industrial-port-container-yard.jpg',
    imageAlt: 'Container stacks at an international port',
    href: 'services.html',
    items: ['Air and Sea Freight Forwarding', 'Domestic and International'],
  },
  {
    id: 'consultancy-and-support',
    title: 'Consultancy and Related Support Services',
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Trade documents being reviewed at a desk',
    href: 'services.html',
    items: [
      'Tariff Classification',
      'Computation of Duties and Taxes',
      'Incoterms Inquiry',
      'Customs and Tariff Laws',
      'Rules of Origin',
      'Trucking Services',
      'Import License Accreditation',
      'Lifting of Abandonment',
      'Filing of Tentative Release and Customs Protest',
    ],
  },
];

function HomeServices({
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  features,
}: HomeServicesProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selectedFeature, setSelectedFeature] = useState<Feature>(features[0]);
  const prefersReducedMotion = useReducedMotion();
  const fadeUpVariants = prefersReducedMotion
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : FADE_UP_VARIANTS;
  const containerVariants = prefersReducedMotion
    ? { hidden: {}, show: {} }
    : STAGGER_CONTAINER_VARIANTS;

  const openFeature = (feature: Feature) => {
    setSelectedFeature(feature);
    dialogRef.current?.showModal();
  };

  return (
    <motion.section
      aria-labelledby="home-services-title"
      className="home-services"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.12 }}
      variants={containerVariants}
    >
      <div className="home-services__content">
        <motion.div className="home-services__intro" variants={fadeUpVariants}>
          <motion.h2 id="home-services-title" variants={fadeUpVariants}>
            {title}
          </motion.h2>
          <motion.p variants={fadeUpVariants}>{subtitle}</motion.p>
          <motion.div className="home-services__cta" variants={fadeUpVariants}>
            <Button asChild className="home-services__button">
              <a href={ctaHref}>{ctaLabel}</a>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div className="home-services__grid" variants={containerVariants}>
          {features.map((feature) => (
            <motion.a
              key={feature.id}
              href={feature.href}
              aria-label={`View ${feature.title} details`}
              variants={fadeUpVariants}
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="home-services__card"
              onClick={(event) => {
                event.preventDefault();
                openFeature(feature);
              }}
            >
              <span className="home-services__card-shell">
                <span className="home-services__image-wrap">
                  <img src={feature.imageUrl} alt={feature.imageAlt} loading="lazy" />
                </span>
                <span className="home-services__card-content">
                  <span className="home-services__card-title">{feature.title}</span>
                  <span className="home-services__arrow" aria-hidden="true">
                    <ArrowRight />
                  </span>
                </span>
              </span>
            </motion.a>
          ))}
        </motion.div>

        <motion.div className="home-services__more" variants={fadeUpVariants}>
          <Button asChild variant="outline" className="home-services__more-button">
            <a href="services.html">Explore More Services</a>
          </Button>
        </motion.div>
      </div>

      <dialog
        ref={dialogRef}
        className="service-gallery__dialog"
        aria-labelledby="home-service-dialog-title"
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current.close();
        }}
      >
        <button
          className="service-gallery__close"
          type="button"
          aria-label="Close service details"
          onClick={() => dialogRef.current?.close()}
        >
          &times;
        </button>
        <div className="service-gallery__details">
          <p className="eyebrow">Service Details</p>
          <h2 id="home-service-dialog-title">{selectedFeature.title}</h2>
          <p>Our services include:</p>
          <ul>
            {selectedFeature.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <a className="button button--light" href="contact.html">
            Request a Quote
          </a>
        </div>
      </dialog>
    </motion.section>
  );
}

export default function HomeServicesSection() {
  return (
    <HomeServices
      title="Services that keep trade moving."
      subtitle="From customs clearance and freight forwarding to tariff consultancy and related support services."
      ctaLabel="Request a Quote"
      ctaHref="contact.html"
      features={SERVICE_FEATURES}
    />
  );
}
