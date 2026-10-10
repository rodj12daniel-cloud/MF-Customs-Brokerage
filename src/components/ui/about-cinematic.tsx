import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Check, CircleDot } from 'lucide-react';
import brandLogo from '../../../assets/mflogo-display.png';
import './about-cinematic.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutCinematic() {
  const sectionRef = useRef<HTMLElement>(null);
  const deliveredCountRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      if (deliveredCountRef.current) deliveredCountRef.current.textContent = '365';
      return;
    }

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
        '.about-cinematic__phone-wrap',
        '.about-cinematic__badge',
        '.about-cinematic__phone-widget',
      ], { autoAlpha: 0 });
      gsap.set(deliveredCountRef.current, { innerText: 0 });

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
        .fromTo('.about-cinematic__phone-wrap',
          { y: 300, z: -500, autoAlpha: 0, scale: 0.6 },
          { y: 0, z: 0, autoAlpha: 1, scale: 1, ease: 'expo.out', duration: 2.5 },
          '-=0.8',
        )
        .fromTo('.about-cinematic__phone-widget',
          { y: 40, autoAlpha: 0, scale: 0.95 },
          { y: 0, autoAlpha: 1, scale: 1, stagger: 0.15, ease: 'back.out(1.2)', duration: 1.5 },
          '-=1.5',
        )
        .to('.about-cinematic__progress-ring', {
          strokeDashoffset: 60,
          duration: 2,
          ease: 'power3.inOut',
        }, '-=1.2')
        .to(deliveredCountRef.current, {
          innerText: 365,
          snap: { innerText: 1 },
          duration: 2,
          ease: 'expo.out',
        }, '<')
        .fromTo('.about-cinematic__badge',
          { y: 100, autoAlpha: 0, scale: 0.7, rotationZ: -10 },
          { y: 0, autoAlpha: 1, scale: 1, rotationZ: 0, ease: 'back.out(1.5)', duration: 1.5, stagger: 0.2 },
          '-=1.5',
        )
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
        .to({}, { duration: 2 })
        .to('.about-cinematic__headlines', { autoAlpha: 0, duration: 0.1 })
        .to({}, { duration: 1 })
        .to([
          '.about-cinematic__phone-wrap',
          '.about-cinematic__badge',
          '.about-cinematic__story',
          '.about-cinematic__brand',
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
            <div className="about-cinematic__story">
              <p className="about-cinematic__eyebrow">Our story</p>
              <h3>Built on a shared ambition.</h3>
              <p>Two licensed customs brokers brought their experience together to make customs and logistics clearer for every client.</p>
              <a href="contact.html">Talk to our team <ArrowUpRight aria-hidden="true" size={16} strokeWidth={2} /></a>
            </div>

            <div className="about-cinematic__phone-wrap" aria-label="Illustration of a shipment workflow">
              <div className="about-cinematic__phone">
                <div className="about-cinematic__phone-screen">
                  <div className="about-cinematic__island"><span /></div>
                  <div className="about-cinematic__phone-content">
                    <div className="about-cinematic__phone-widget about-cinematic__reference-header">
                      <span><small>Today</small><strong>Journey</strong></span>
                      <span className="about-cinematic__avatar">JS</span>
                    </div>

                    <div className="about-cinematic__phone-widget about-cinematic__delivery-metric">
                      <svg viewBox="0 0 176 176" aria-hidden="true">
                        <circle cx="88" cy="88" r="64" className="about-cinematic__progress-track" />
                        <circle cx="88" cy="88" r="64" className="about-cinematic__progress-ring" />
                      </svg>
                      <span ref={deliveredCountRef} className="about-cinematic__delivery-count">0</span>
                      <span className="about-cinematic__delivery-label">Packages Delivered</span>
                    </div>

                    <div className="about-cinematic__phone-widgets">
                      <div className="about-cinematic__phone-widget about-cinematic__summary-widget">
                        <span className="about-cinematic__summary-icon about-cinematic__summary-icon--blue"><CircleDot size={16} strokeWidth={2} /></span>
                        <span className="about-cinematic__summary-lines"><i /><i /></span>
                      </div>
                      <div className="about-cinematic__phone-widget about-cinematic__summary-widget">
                        <span className="about-cinematic__summary-icon about-cinematic__summary-icon--green"><Check size={16} strokeWidth={2} /></span>
                        <span className="about-cinematic__summary-lines"><i /><i /></span>
                      </div>
                    </div>
                    <div className="about-cinematic__phone-home" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>

            <div className="about-cinematic__brand" aria-hidden="true">
              <img src={brandLogo} alt="" />
            </div>
          </div>

          <div className="about-cinematic__badge about-cinematic__badge--top">
            <span className="about-cinematic__badge-icon" aria-hidden="true">✓</span>
            <span><strong>Licensed expertise</strong><small>Customs brokers you can trust</small></span>
          </div>
          <div className="about-cinematic__badge about-cinematic__badge--bottom">
            <span className="about-cinematic__badge-icon" aria-hidden="true"><ArrowUpRight size={18} strokeWidth={2} /></span>
            <span><strong>Clear coordination</strong><small>From arrival to release</small></span>
          </div>
        </article>
      </div>
    </section>
  );
}
