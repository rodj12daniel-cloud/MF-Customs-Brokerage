import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { VoxelVideoStreakCard } from './voxel-video-streak-card';
import brandLogo from '../../../assets/mflogo-display.png';
import rubberImage from '../../../assets/rubber.jpg';
import steelImage from '../../../assets/steel.jpg';
import './about-cinematic.css';

const aboutCardImages = [
  {
    src: 'https://www.sinotruk-howo.com/wp-content/uploads/2025/07/sinotruk-howo-NX-6x4-cargo-truck-1.webp',
    alt: 'SINOTRUK HOWO NX 6x4 cargo truck',
  },
  { src: rubberImage, alt: 'Rubber cargo' },
  { src: steelImage, alt: 'Steel cargo' },
];

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutCinematic() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const context = gsap.context(() => {
      gsap.set('.about-cinematic__headline-first', {
        autoAlpha: 0,
        y: 60,
        scale: 0.85,
        filter: 'blur(20px)',
        rotationX: -20,
      });
      gsap.set('.about-cinematic__headline-second', {
        clipPath: 'inset(0 100% 0 0)',
      });
      gsap.set('.about-cinematic__card', {
        y: window.innerHeight + 200,
        autoAlpha: 1,
      });
      gsap.set([
        '.about-cinematic__story',
        '.about-cinematic__brand',
        '.about-cinematic__voxel-wrap',
      ], { autoAlpha: 0 });

      gsap.timeline({ delay: 0.3 })
        .to('.about-cinematic__headline-first', {
          duration: 1.8,
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          rotationX: 0,
          ease: 'expo.out',
        })
        .to('.about-cinematic__headline-second', {
          duration: 1.4,
          clipPath: 'inset(0 0% 0 0)',
          ease: 'power4.inOut',
        }, '-=1');

      const mobile = window.innerWidth < 768;
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=4000',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      timeline
        .to('.about-cinematic__headlines', {
          scale: 1.15,
          filter: 'blur(20px)',
          opacity: 0.2,
          ease: 'power2.inOut',
          duration: 2,
        }, 0)
        .to('.about-cinematic__card', {
          y: 0,
          ease: 'power3.inOut',
          duration: 2,
        }, 0)
        .to('.about-cinematic__card', {
          width: '100%',
          height: '100%',
          borderRadius: '0px',
          ease: 'power3.inOut',
          duration: 1.5,
        })
        .fromTo('.about-cinematic__story',
          { x: -50, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, ease: 'power4.out', duration: 1.5 },
          '-=1.5',
        )
        .fromTo('.about-cinematic__brand',
          { x: 50, autoAlpha: 0, scale: 0.8 },
          { x: 0, autoAlpha: 1, scale: 1, ease: 'expo.out', duration: 1.5 },
          '<',
        )
        .fromTo('.about-cinematic__voxel-wrap',
          { x: 50, autoAlpha: 0, scale: 0.96 },
          { x: 0, autoAlpha: 1, scale: 1, ease: 'expo.out', duration: 1.5 },
          '<',
        )
        .to({}, { duration: 2 })
        .to('.about-cinematic__headlines', { autoAlpha: 0, duration: 0.1 })
        .to({}, { duration: 1 })
        .to([
          '.about-cinematic__story',
          '.about-cinematic__brand',
          '.about-cinematic__voxel-wrap',
        ], {
          scale: 0.9,
          y: -40,
          z: -200,
          autoAlpha: 0,
          ease: 'power3.in',
          duration: 1.2,
          stagger: 0.05,
        })
        .to('.about-cinematic__card', {
          width: mobile ? '92vw' : '85vw',
          height: mobile ? '92vh' : '85vh',
          borderRadius: mobile ? '32px' : '40px',
          ease: 'expo.inOut',
          duration: 1.8,
        }, 'pullback')
        .to('.about-cinematic__card', {
          y: -window.innerHeight - 300,
          ease: 'power3.in',
          duration: 1.5,
        });
    }, section);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="about-cinematic"
      aria-label="About MF Customs Brokerage"
      style={{ perspective: '1500px' }}
    >
      <div className="about-cinematic__headlines">
        <h2 className="about-cinematic__headline-first">Customs, made clearer.</h2>
        <p className="about-cinematic__headline-second">Trade, made possible.</p>
      </div>

      <div className="about-cinematic__card-layer">
        <article className="about-cinematic__card">
          <div className="about-cinematic__sheen" aria-hidden="true" />
          <div className="about-cinematic__card-layout">
            <div className="about-cinematic__left">
              <div className="about-cinematic__brand" aria-hidden="true">
                <img src={brandLogo} alt="" />
              </div>

              <div className="about-cinematic__story">
                <p className="about-cinematic__eyebrow">Our story</p>
                <h3>Your cargo, in capable hands.</h3>
                <p>Two licensed customs brokers brought their experience together to make customs and logistics clearer for every client.</p>
                <a href="contact.html">Talk to our team <ArrowUpRight aria-hidden="true" size={16} strokeWidth={2} /></a>
              </div>
            </div>

            <div className="about-cinematic__voxel-wrap">
              <VoxelVideoStreakCard
                className="about-cinematic__voxel"
                headingPrimary="Your trade, moving"
                headingHighlight="with confidence."
                subtitle="Customs clearance, freight forwarding, and consultancy coordinated around your shipment."
                videoBadgeText="Freight in motion"
                images={aboutCardImages}
                showStats={false}
              />
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
