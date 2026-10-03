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
  const phoneViewport = window.matchMedia('(max-width: 680px)');
  const track = mobileLogoIntro.parentElement;
  let parallaxFrame = 0;
  let trackDocumentTop = 0;
  let trackDocumentBottom = 0;
  let scrollDistance = 1;

  const updateLogoParallax = () => {
    parallaxFrame = 0;
    if (!logo || !track || !phoneViewport.matches) {
      document.body.classList.remove('is-logo-intro-visible');
      return;
    }

    document.body.classList.toggle(
      'is-logo-intro-visible',
      trackDocumentBottom > window.scrollY && trackDocumentTop < window.scrollY + window.innerHeight,
    );

    const progress = Math.max(0, Math.min(1, (window.scrollY - trackDocumentTop) / scrollDistance));
    mobileLogoIntro.style.setProperty('--logo-scroll-offset', `${progress * 48}px`);
    mobileLogoIntro.style.setProperty('--logo-scroll-opacity', String(1 - progress));
  };

  const scheduleLogoParallax = () => {
    if (!parallaxFrame) parallaxFrame = window.requestAnimationFrame(updateLogoParallax);
  };

  const measureLogoTrack = () => {
    if (!track) return;
    trackDocumentTop = track.getBoundingClientRect().top + window.scrollY;
    const trackHeight = track.offsetHeight;
    trackDocumentBottom = trackDocumentTop + trackHeight;
    scrollDistance = Math.max(trackHeight - mobileLogoIntro.offsetHeight, 1);
    scheduleLogoParallax();
  };

  window.addEventListener('load', measureLogoTrack, { once: true });
  measureLogoTrack();
  window.addEventListener('scroll', scheduleLogoParallax, { passive: true });
  window.addEventListener('resize', measureLogoTrack);
  phoneViewport.addEventListener('change', measureLogoTrack);
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

const profileDialogControls = new Map();

document.querySelectorAll('[data-profile-open]').forEach((button) => {
  const dialog = document.getElementById(button.dataset.profileOpen);
  if (!dialog) return;
  let controls = profileDialogControls.get(dialog);

  if (!controls) {
    controls = createAnimatedDialogControls(dialog);
    profileDialogControls.set(dialog, controls);
    dialog.querySelector('[data-profile-close]')?.addEventListener('click', controls.close);
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) controls.close();
    });
  }
  button.addEventListener('click', controls.open);
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

const storySlides = [...document.querySelectorAll('[data-story-slide]')];

if (storySlides.length > 1) {
  let activeStorySlide = 0;

  window.setInterval(() => {
    storySlides[activeStorySlide].classList.remove('is-active');
    storySlides[activeStorySlide].setAttribute('aria-hidden', 'true');
    activeStorySlide = (activeStorySlide + 1) % storySlides.length;
    storySlides[activeStorySlide].classList.add('is-active');
    storySlides[activeStorySlide].removeAttribute('aria-hidden');
  }, 4000);
}

const purposeDialog = document.querySelector('#purpose-dialog');

if (purposeDialog instanceof HTMLDialogElement) {
  const purposeTitle = purposeDialog.querySelector('[data-purpose-title]');
  const purposeItems = purposeDialog.querySelector('[data-purpose-items]');
  const controls = createAnimatedDialogControls(purposeDialog);

  document.querySelectorAll('[data-purpose-open]').forEach((button) => {
    button.addEventListener('click', () => {
      const cardIndex = Number(button.dataset.purposeOpen);
      const card = Number.isInteger(cardIndex) ? document.querySelectorAll('.purpose-card')[cardIndex] : null;
      const title = card?.querySelector('h3')?.textContent;
      const paragraphs = [...(card?.querySelectorAll('.purpose-card__copy > p') ?? [])];
      if (!title || !paragraphs.length) return;

      purposeTitle.textContent = title;
      purposeItems.replaceChildren(...paragraphs.map((paragraph) => {
        const listItem = document.createElement('li');
        listItem.textContent = paragraph.textContent;
        return listItem;
      }));
      controls.open();
    });
  });

  purposeDialog.querySelector('[data-gallery-close]')?.addEventListener('click', controls.close);
  purposeDialog.addEventListener('click', (event) => {
    if (event.target === purposeDialog) controls.close();
  });
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