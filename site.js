const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav-dock');

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
  navigation.classList.toggle('is-open', !isOpen);
});

navigation?.addEventListener('click', (event) => {
  if (event.target.closest('a') && menuButton) {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation menu');
    navigation.classList.remove('is-open');
  }
});

const mobileDock = document.querySelector('.mobile-dock');

if (mobileDock) {
  const updateMobileDock = () => {
    const links = [...mobileDock.querySelectorAll('a')];
    const activeLink = links.find((link) => {
      const linkUrl = new URL(link.href);
      return linkUrl.pathname === window.location.pathname && linkUrl.hash === window.location.hash;
    }) || links.find((link) => {
      const linkUrl = new URL(link.href);
      return linkUrl.pathname === window.location.pathname && !linkUrl.hash;
    });

    links.forEach((link) => {
      if (link === activeLink) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  };

  updateMobileDock();
  window.addEventListener('hashchange', updateMobileDock);
  window.addEventListener('popstate', updateMobileDock);
}

const mobileLogoIntro = document.querySelector('.mobile-logo-intro');

if (mobileLogoIntro) {
  const logo = mobileLogoIntro.querySelector('img');
  const phoneViewport = window.matchMedia('(max-width: 600px)');
  let parallaxFrame = 0;

  const updateLogoParallax = () => {
    parallaxFrame = 0;
    if (!logo || !phoneViewport.matches) {
      document.body.classList.remove('is-logo-intro-visible');
      return;
    }

    const track = mobileLogoIntro.parentElement;
    if (!track) return;

    const introBounds = mobileLogoIntro.getBoundingClientRect();
    document.body.classList.toggle(
      'is-logo-intro-visible',
      introBounds.bottom > 0 && introBounds.top < window.innerHeight,
    );

    const trackTop = track.getBoundingClientRect().top;
    const scrollDistance = Math.max(track.offsetHeight - mobileLogoIntro.offsetHeight, 1);
    const progress = Math.max(0, Math.min(1, -trackTop / scrollDistance));
    mobileLogoIntro.style.setProperty('--logo-scroll-offset', `${progress * 96}px`);
    mobileLogoIntro.style.setProperty('--logo-scroll-scale', String(1 + progress * 0.06));
    mobileLogoIntro.style.setProperty('--logo-scroll-opacity', String(1 - progress));
  };

  const scheduleLogoParallax = () => {
    if (!parallaxFrame) parallaxFrame = window.requestAnimationFrame(updateLogoParallax);
  };

  updateLogoParallax();
  window.addEventListener('scroll', scheduleLogoParallax, { passive: true });
  window.addEventListener('resize', scheduleLogoParallax);
  phoneViewport.addEventListener('change', scheduleLogoParallax);
}

document.querySelectorAll('.about-preview__side, .service-gallery__rail').forEach((rail) => {
  let pointerStartX = 0;
  let scrollStart = 0;
  let isDragging = false;
  let didDrag = false;
  let suppressClick = false;

  rail.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'touch' || event.button !== 0 || rail.scrollWidth <= rail.clientWidth + 1) return;

    pointerStartX = event.clientX;
    scrollStart = rail.scrollLeft;
    isDragging = true;
    didDrag = false;
  });

  rail.addEventListener('pointermove', (event) => {
    if (!isDragging) return;

    const distance = event.clientX - pointerStartX;
    if (Math.abs(distance) > 6 && !didDrag) {
      didDrag = true;
      rail.classList.add('is-dragging');
      rail.setPointerCapture(event.pointerId);
    }
    if (!didDrag) return;

    rail.scrollLeft = scrollStart - distance;
    event.preventDefault();
  });

  rail.addEventListener('pointerup', (event) => {
    if (!isDragging) return;

    isDragging = false;
    rail.classList.remove('is-dragging');
    if (didDrag) {
      suppressClick = true;
      window.setTimeout(() => { suppressClick = false; }, 0);
    }
    if (rail.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId);
  });

  rail.addEventListener('pointercancel', () => {
    isDragging = false;
    rail.classList.remove('is-dragging');
  });

  rail.addEventListener('click', (event) => {
    if (!suppressClick) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClick = false;
  }, true);
});

const createAnimatedDialogControls = (dialog) => {
  let closeTimer;
  let finishClose;

  const close = () => {
    if (!dialog.open || dialog.classList.contains('is-closing')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      dialog.close();
      return;
    }

    dialog.classList.add('is-closing');
    finishClose = (event) => {
      if (event && (event.target !== dialog || event.animationName !== 'modern-dialog-out')) return;
      dialog.removeEventListener('animationend', finishClose);
      window.clearTimeout(closeTimer);
      if (dialog.open) dialog.close();
    };
    dialog.addEventListener('animationend', finishClose);
    closeTimer = window.setTimeout(() => finishClose(), 350);
  };

  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    close();
  });
  dialog.addEventListener('close', () => {
    window.clearTimeout(closeTimer);
    dialog.classList.remove('is-closing');
  });

  return {
    open: () => {
      dialog.classList.remove('is-closing');
      dialog.showModal();
    },
    close,
  };
};

document.querySelectorAll('[data-profile-open]').forEach((button) => {
  const dialog = document.getElementById(button.dataset.profileOpen);
  if (!dialog) return;
  const controls = createAnimatedDialogControls(dialog);

  button.addEventListener('click', controls.open);
  dialog.querySelector('[data-profile-close]')?.addEventListener('click', controls.close);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) controls.close();
  });
});

const contactForm = document.querySelector('[data-contact-form]');

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const selectedServices = formData.getAll('services');
  const message = [
    `Name: ${formData.get('name')}`,
    `Email: ${formData.get('email')}`,
    `Phone: ${formData.get('phone')}`,
    `Services: ${selectedServices.length ? selectedServices.join(', ') : 'Not specified'}`,
    '',
    'Message:',
    formData.get('message'),
  ].join('\n');
  const subject = 'Website inquiry - MF Customs Brokerage';
  window.location.href = `mailto:${contactForm.dataset.recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
});

const contactSlides = [...document.querySelectorAll('[data-contact-slide]')];

if (contactSlides.length > 1 && window.matchMedia('(min-width: 1021px)').matches) {
  let activeContactSlide = 0;

  window.setInterval(() => {
    contactSlides[activeContactSlide].classList.remove('is-active');
    contactSlides[activeContactSlide].setAttribute('aria-hidden', 'true');
    activeContactSlide = (activeContactSlide + 1) % contactSlides.length;
    contactSlides[activeContactSlide].classList.add('is-active');
    contactSlides[activeContactSlide].removeAttribute('aria-hidden');
  }, 5000);
}

const aboutParallax = document.querySelector('[data-about-parallax]');

if (aboutParallax) {
  const stage = aboutParallax.querySelector('.about-cinematic__stage');
  const card = aboutParallax.querySelector('[data-about-card]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (stage && card) {
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, scrollTriggerModule]) => {
      const { gsap } = gsapModule;
      const { ScrollTrigger } = scrollTriggerModule;
      gsap.registerPlugin(ScrollTrigger);

      const copy = card.querySelector('.about-cinematic__copy');
      const phone = card.querySelector('.about-cinematic__phone-wrap');
      const phoneSteps = card.querySelectorAll('.about-cinematic__steps li');
      const brand = card.querySelector('.about-cinematic__brand');
      const badges = card.querySelectorAll('.about-cinematic__badge');
      const sceneItems = [copy, phone, brand, ...badges].filter(Boolean);

      const context = gsap.context(() => {
        if (reduceMotion.matches) {
          gsap.set([card, ...sceneItems], { clearProps: 'all' });
          return;
        }

        gsap.set(card, { y: 42, scale: 0.94, autoAlpha: 1 });
        gsap.set(phone, { y: 70, z: -200, rotationX: 25, rotationY: -12, scale: 0.82, autoAlpha: 1 });
        gsap.set(phoneSteps, { y: 28, autoAlpha: 0 });
        gsap.set(copy, { x: -18, autoAlpha: 1 });
        gsap.set(brand, { x: 56, scale: 0.82, autoAlpha: 0 });
        gsap.set(badges, { y: 90, scale: 0.72, rotationZ: -8, autoAlpha: 0 });

        const scrollTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: '+=7000',
            pin: stage,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        scrollTimeline
          .to(card, { y: 0, scale: 1, ease: 'power3.inOut', duration: 2 }, 0)
          .to(phone, { y: 0, z: 0, rotationX: 0, rotationY: 0, autoAlpha: 1, scale: 1, ease: 'expo.out', duration: 2.5 }, '-=0.8')
          .to(phoneSteps, { y: 0, autoAlpha: 1, stagger: 0.15, ease: 'back.out(1.2)', duration: 1.5 }, '-=1.5')
          .to(copy, { x: 0, autoAlpha: 1, ease: 'power4.out', duration: 1.5 }, '-=1.5')
          .to(brand, { x: 0, autoAlpha: 1, scale: 1, ease: 'expo.out', duration: 1.5 }, '<')
          .to(
            badges,
            { y: 0, autoAlpha: 1, scale: 1, rotationZ: 0, ease: 'back.out(1.5)', duration: 1.5, stagger: 0.2 },
            '-=1.2',
          )
          .to({}, { duration: 1.2 });
      }, aboutParallax);

      window.addEventListener('pagehide', () => context.revert(), { once: true });
    });
  }
}

document.querySelectorAll('.service-gallery').forEach((gallery) => {
  const galleryButtons = [...gallery.querySelectorAll('[data-gallery-open]')];
  const galleryDialog = gallery.querySelector('.service-gallery__dialog');
  if (!galleryButtons.length || !(galleryDialog instanceof HTMLDialogElement)) return;

  const galleryTitle = galleryDialog.querySelector('[data-gallery-title]');
  const galleryItems = galleryDialog.querySelector('[data-gallery-items]');
  const galleryPhoto = galleryDialog.querySelector('[data-gallery-photo]');
  const galleryPhotoTitle = galleryDialog.querySelector('[data-gallery-photo-title]');
  const gallerySummary = galleryDialog.querySelector('[data-gallery-summary]');
  const galleryTabs = [...galleryDialog.querySelectorAll('[data-gallery-tab]')];
  const galleryPanels = [...galleryDialog.querySelectorAll('[data-gallery-panel]')];
  const controls = createAnimatedDialogControls(galleryDialog);
  const mobileTabs = window.matchMedia('(max-width: 1020px)');
  let activeGalleryPanel = 'overview';

  const updateGalleryPanels = () => {
    galleryTabs.forEach((tab) => {
      tab.setAttribute('aria-selected', String(tab.dataset.galleryTab === activeGalleryPanel));
    });
    galleryPanels.forEach((panel) => {
      panel.hidden = mobileTabs.matches && panel.dataset.galleryPanel !== activeGalleryPanel;
    });
  };

  galleryButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const title = button.dataset.serviceTitle;
      const image = button.querySelector('img');
      galleryTitle.textContent = title;
      if (galleryPhoto && image) {
        galleryPhoto.src = image.currentSrc || image.src;
        galleryPhoto.alt = image.alt;
        galleryPhotoTitle.textContent = title;
        gallerySummary.textContent = button.dataset.serviceOverview
          || `MF Customs Brokerage provides ${title.toLowerCase()} tailored to your cargo and business requirements.`;
      }
      galleryItems.replaceChildren(...button.dataset.serviceItems.split('|').map((item) => {
        const listItem = document.createElement('li');
        listItem.textContent = item;
        return listItem;
      }));
      activeGalleryPanel = 'overview';
      updateGalleryPanels();
      controls.open();
    });
  });

  galleryTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      activeGalleryPanel = tab.dataset.galleryTab;
      updateGalleryPanels();
    });
  });

  mobileTabs.addEventListener('change', updateGalleryPanels);

  galleryDialog.querySelector('[data-gallery-close]')?.addEventListener('click', controls.close);
  galleryDialog.addEventListener('click', (event) => {
    if (event.target === galleryDialog) controls.close();
  });
});

const serviceMapElement = document.querySelector('#service-location-map');

if (serviceMapElement && window.L) {
  const officeCoordinates = [14.5985383, 120.959999];
  const serviceMap = L.map(serviceMapElement, { scrollWheelZoom: false }).setView(officeCoordinates, 16);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(serviceMap);

  L.marker(officeCoordinates)
    .addTo(serviceMap)
    .bindPopup('<strong>MF Customs Brokerage Services</strong><br>Gate 12, Parola, 420 Area B, Tondo, Manila')
    .openPopup();

  requestAnimationFrame(() => serviceMap.invalidateSize());
}

const revealItems = document.querySelectorAll('.reveal');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((element) => element.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

  revealItems.forEach((element) => revealObserver.observe(element));
}