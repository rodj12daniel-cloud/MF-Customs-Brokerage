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

document.querySelectorAll('[data-profile-open]').forEach((button) => {
  const dialog = document.getElementById(button.dataset.profileOpen);
  if (!dialog) return;

  button.addEventListener('click', () => dialog.showModal());
  dialog.querySelector('[data-profile-close]')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
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

if (contactSlides.length > 1) {
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

document.querySelectorAll('.service-gallery').forEach((gallery) => {
  const galleryButtons = [...gallery.querySelectorAll('[data-gallery-open]')];
  const galleryDialog = gallery.querySelector('.service-gallery__dialog');
  if (!galleryButtons.length || !(galleryDialog instanceof HTMLDialogElement)) return;

  const galleryTitle = galleryDialog.querySelector('[data-gallery-title]');
  const galleryItems = galleryDialog.querySelector('[data-gallery-items]');

  galleryButtons.forEach((button) => {
    button.addEventListener('click', () => {
      galleryTitle.textContent = button.dataset.serviceTitle;
      galleryItems.replaceChildren(...button.dataset.serviceItems.split('|').map((item) => {
        const listItem = document.createElement('li');
        listItem.textContent = item;
        return listItem;
      }));
      galleryDialog.showModal();
    });
  });

  galleryDialog.querySelector('[data-gallery-close]')?.addEventListener('click', () => galleryDialog.close());
  galleryDialog.addEventListener('click', (event) => {
    if (event.target === galleryDialog) galleryDialog.close();
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