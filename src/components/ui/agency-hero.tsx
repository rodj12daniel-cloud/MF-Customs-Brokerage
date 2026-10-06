import { motion, useReducedMotion, type Variants } from 'motion/react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ui/theme-toggle';
import cityTruckImage from '../../../assets/hero-marquee-city-truck.jpg';
import containerShipImage from '../../../assets/hero-marquee-container-ship.jpg';
import heavyLiftImage from '../../../assets/hero-marquee-heavy-lift.jpg';
import portAerialImage from '../../../assets/hero-marquee-port-aerial.jpg';
import warehouseForkliftImage from '../../../assets/hero-marquee-warehouse-forklift.jpg';
import distributionWarehouseImage from '../../../assets/interior-large-distribution-warehouse-with-shelves-stacked-with-palettes-goods-ready-market.jpg';
import industrialPortImage from '../../../assets/industrial-port-container-yard.jpg';
import heroImage from '../../../assets/hero.jpg';

const marqueeImages = [
  containerShipImage,
  cityTruckImage,
  warehouseForkliftImage,
  portAerialImage,
  heavyLiftImage,
  industrialPortImage,
  heroImage,
  distributionWarehouseImage,
];

const entrance: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.68, ease: 'easeOut' },
  },
};

const sequence: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.12, staggerChildren: 0.13 } },
};

const noMotion: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0, transition: { duration: 0 } },
};

export default function AgencyHeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const itemVariants = prefersReducedMotion ? noMotion : entrance;
  const sequenceVariants = prefersReducedMotion
    ? { hidden: {}, visible: { transition: { duration: 0 } } }
    : sequence;

  return (
    <motion.section
      id="home"
      aria-labelledby="hero-title"
      className="home-hero"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={sequenceVariants}
    >
      <motion.main id="main" className="home-hero__content" variants={sequenceVariants}>
        <motion.p className="home-hero__eyebrow" variants={itemVariants}>
          <span aria-hidden="true" />
          <span className="home-hero__eyebrow-copy">Customs brokerage / Philippines</span>
          <ThemeToggle />
        </motion.p>
        <motion.h1 id="hero-title" className="home-hero__title" variants={itemVariants}>
          <span>Efficiency meets</span>
          <em>reliability.</em>
        </motion.h1>
        <motion.p className="home-hero__copy" variants={itemVariants}>
          Expert customs brokerage and logistics, built around your cargo, your timeline, and your business.
        </motion.p>
        <motion.div className="home-hero__actions" variants={itemVariants}>
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
        </motion.div>
      </motion.main>
      <div className="home-hero__marquee" aria-hidden="true">
        <motion.div
          className="home-hero__marquee-track"
          animate={prefersReducedMotion ? undefined : { x: ['0%', '-50%'] }}
          transition={{ ease: 'linear', duration: 120, repeat: Infinity }}
        >
          {Array.from({ length: 4 }, (_, groupIndex) => (
            <div className="home-hero__marquee-group" key={groupIndex}>
              {marqueeImages.map((src, index) => (
                <div className="home-hero__marquee-card" key={`${src}-${index}`}>
                  <img src={src} alt="" loading="eager" />
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}