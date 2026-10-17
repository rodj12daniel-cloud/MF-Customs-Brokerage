import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { VoxelVideoStreakCard } from './voxel-video-streak-card';
import truckImage from '../../../assets/mf truck.png';
import rubberImage from '../../../assets/rubber.jpg';
import steelImage from '../../../assets/steel.jpg';
import './about-cinematic.css';

const aboutCardImages = [
  { src: truckImage, alt: 'MF Customs Brokerage truck' },
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
    const isAboutNavigation = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return false;

      const link = event.target.closest<HTMLAnchorElement>('a[href]');
      if (!link) return false;

      const target = new URL(link.href, window.location.href);
      return target.origin === window.location.origin
        && target.pathname === window.location.pathname
        && target.hash === '#about-story';
    };

    if (reducedMotion) {
      const scrollToAboutSection = () => {
        if (window.location.hash === '#about-story') {
          section.scrollIntoView({ block: 'start', behavior: 'instant' });
        }
      };
      const handleAboutNavigation = (event: MouseEvent) => {
        if (!isAboutNavigation(event)) return;

        event.preventDefault();
        if (window.location.hash !== '#about-story') {
          window.history.pushState(null, '', '#about-story');
        }
        window.requestAnimationFrame(scrollToAboutSection);
      };

      document.addEventListener('click', handleAboutNavigation);
      window.addEventListener('hashchange', scrollToAboutSection);
      window.addEventListener('popstate', scrollToAboutSection);
      if (window.location.hash === '#about-story') {
        window.requestAnimationFrame(scrollToAboutSection);
      }

      return () => {
        document.removeEventListener('click', handleAboutNavigation);
        window.removeEventListener('hashchange', scrollToAboutSection);
        window.removeEventListener('popstate', scrollToAboutSection);
      };
    }

    let removeAboutHashChange = () => {};

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

      const scrollToAboutStory = () => {
        if (window.location.hash !== '#about-story' || !timeline.scrollTrigger) return;

        ScrollTrigger.refresh();
        const trigger = timeline.scrollTrigger;
        const targetScroll = trigger.start + (trigger.end - trigger.start) * 0.4;
        const root = document.documentElement;
        const previousScrollBehavior = root.style.scrollBehavior;
        root.style.scrollBehavior = 'auto';
        window.scrollTo(0, targetScroll);
        root.style.scrollBehavior = previousScrollBehavior;
      };

      const handleAboutHashChange = () => {
        window.requestAnimationFrame(scrollToAboutStory);
      };

      const handleAboutStoryNavigation = (event: MouseEvent) => {
        if (!isAboutNavigation(event)) return;

        event.preventDefault();
        if (window.location.hash !== '#about-story') {
          window.history.pushState(null, '', '#about-story');
        }
        window.requestAnimationFrame(scrollToAboutStory);
      };

      window.addEventListener('hashchange', handleAboutHashChange);
      window.addEventListener('popstate', handleAboutHashChange);
      document.addEventListener('click', handleAboutStoryNavigation);
      removeAboutHashChange = () => {
        window.removeEventListener('hashchange', handleAboutHashChange);
        window.removeEventListener('popstate', handleAboutHashChange);
        document.removeEventListener('click', handleAboutStoryNavigation);
      };

      if (window.location.hash === '#about-story') {
        const jumpAfterLayout = () => {
          window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
              ScrollTrigger.refresh();
              scrollToAboutStory();
            });
          });
        };

        if (document.readyState === 'complete') jumpAfterLayout();
        else window.addEventListener('load', jumpAfterLayout, { once: true });
      }
    }, section);

    return () => {
      removeAboutHashChange();
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
              <div className="about-cinematic__story">
                <p className="about-cinematic__eyebrow">About</p>
                <p>MF Customs Brokerage is a duly registered company with the Department of Trade and Industry (DTI) and accredited by the Bureau of Customs (BOC). Founded by two young professionals who share a common vision and passion for the customs brokerage industry, the company is committed to delivering reliable, efficient, and professional trade solutions.</p>
                <p>We provide comprehensive services in customs brokerage, tariff consultancy, freight forwarding, warehousing, logistics, and trade consultancy. Through innovative approaches, modern solutions, and the expertise of our knowledgeable and experienced team, we strive to simplify trade processes and meet the diverse needs of our clients.</p>
                <p>As a trusted intermediary, we represent and assist clients in navigating domestic and international trade requirements, coordinating with the Bureau of Customs and other relevant government agencies to facilitate smooth and compliant transactions.</p>
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
