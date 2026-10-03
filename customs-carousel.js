import * as THREE from 'three';
import heroPhoto from './assets/hero.jpg?url';
import portPhoto from './assets/industrial-port-container-yard.jpg?url';
import cargoPhoto from './assets/4180878.png?url';

const stage = document.querySelector('[data-customs-carousel]');
const canvas = stage?.querySelector('canvas');
const carouselViewport = window.matchMedia('(max-width: 1020px)');
const isMobileViewport = carouselViewport.matches;

carouselViewport.addEventListener('change', () => window.location.reload());

function initializeMobileServiceDeck() {
  const deck = document.querySelector('[data-service-deck]');
  const slides = [...(deck?.querySelectorAll('[data-service-slide]') ?? [])];
  const buttons = [...document.querySelectorAll('[data-service-target]')];
  if (!deck || slides.length < 2) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeIndex = 0;
  let intervalId;
  let pointerStart;

  const render = () => {
    slides.forEach((slide, index) => {
      const offset = (index - activeIndex + slides.length) % slides.length;
      const position = offset === 0 ? 'active' : offset === 1 ? 'next' : offset === slides.length - 1 ? 'previous' : 'hidden';
      slide.dataset.position = position;
      slide.setAttribute('aria-hidden', String(offset !== 0));
    });
    buttons.forEach((button, index) => button.setAttribute('aria-pressed', String(index === activeIndex)));
  };

  const stopRotation = () => window.clearInterval(intervalId);
  const startRotation = () => {
    stopRotation();
    if (!reducedMotion.matches && !document.hidden) {
      intervalId = window.setInterval(() => {
        activeIndex = (activeIndex + 1) % slides.length;
        render();
      }, 5000);
    }
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      activeIndex = Number(button.dataset.serviceTarget) % slides.length;
      render();
      startRotation();
    });
  });
  deck.addEventListener('pointerdown', (event) => {
    if (!event.isPrimary) return;
    pointerStart = { x: event.clientX, y: event.clientY };
  });
  window.addEventListener('pointerup', (event) => {
    if (!pointerStart || !event.isPrimary) return;
    const deltaX = event.clientX - pointerStart.x;
    const deltaY = event.clientY - pointerStart.y;
    pointerStart = undefined;
    if (Math.abs(deltaX) < 45 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
    activeIndex = (activeIndex + (deltaX < 0 ? 1 : -1) + slides.length) % slides.length;
    render();
    startRotation();
  });
  window.addEventListener('pointercancel', () => { pointerStart = undefined; });
  document.addEventListener('visibilitychange', startRotation);
  render();
  startRotation();
}

if (stage && canvas && isMobileViewport) {
  stage.classList.remove('is-loading');
  stage.classList.add('is-static');
  initializeMobileServiceDeck();
}

if (stage && canvas && !isMobileViewport) {
  const fallbackPhoto = heroPhoto;
  const photoSources = [
    fallbackPhoto,
    portPhoto,
    cargoPhoto,
    'https://wallpaperaccess.com/full/4180942.jpg',
    'https://media.istockphoto.com/id/2157040201/photo/truck-carrying-forty-foot-container-leaving-port-terminal-with-ship-and-quay-crane-on-the.jpg?s=612x612&w=0&k=20&c=D4UJJ09jrr-lkrP_6FvIAj6-2PosXIzg-iQ_HcxD0iQ=',
    'https://media.istockphoto.com/id/868192214/photo/large-container-ship-at-sea-top-down-aerial-image.jpg?s=612x612&w=0&k=20&c=cNvYsT8ZSuUtpkhqUthDy0oma_6s7vmEJQqyuNSH_xs=',
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80',
  ];
  const loader = new THREE.TextureLoader().setCrossOrigin('anonymous');
  const scene = new THREE.Scene();
  const panelAspect = 3 / 5;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    stage.classList.remove('is-loading');
    stage.classList.add('is-static');
  }

  if (renderer) {
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0xffffff, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
    camera.position.set(0, 0, 0);
    camera.lookAt(0, 0, -1);

    function fitTextureToPanel(texture) {
      const imageAspect = texture.image.width / texture.image.height;
      const repeatX = imageAspect > panelAspect ? panelAspect / imageAspect : 1;
      const repeatY = imageAspect < panelAspect ? imageAspect / panelAspect : 1;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.repeat.set(repeatX, repeatY);
      texture.offset.set((1 - repeatX) / 2, (1 - repeatY) / 2);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      texture.needsUpdate = true;
      return texture;
    }

    function loadSource(source) {
      return new Promise((resolve, reject) => {
        loader.load(source, (loadedTexture) => {
          resolve(fitTextureToPanel(loadedTexture));
        }, undefined, reject);
      });
    }

    async function loadPortrait(source) {
      try {
        return await loadSource(source);
      } catch {
        if (source === fallbackPhoto) return null;
        try {
          return await loadSource(fallbackPhoto);
        } catch {
          return null;
        }
      }
    }

    async function startCarousel() {
      const firstTexture = await loadPortrait(fallbackPhoto);
      if (!firstTexture || !stage.isConnected) {
        stage.classList.remove('is-loading');
        stage.classList.add('is-static');
        return;
      }
      const textures = Array(photoSources.length).fill(firstTexture);

      const carousel = new THREE.Group();
      const panelCount = 16;
      const panelStep = (Math.PI * 2) / panelCount;
      const radius = 8.4;
      const panelAngle = panelStep * 0.93;
      const panelWidth = radius * panelAngle;
      const panelHeight = panelWidth / panelAspect;
      const panels = [];

      for (let panelIndex = 0; panelIndex < panelCount; panelIndex += 1) {
        const panelCenterAngle = Math.PI + panelIndex * panelStep;
        const startAngle = panelCenterAngle - panelAngle / 2;
        const geometry = new THREE.CylinderGeometry(radius, radius, panelHeight, 32, 1, true, startAngle, panelAngle);
        const material = new THREE.MeshBasicMaterial({ map: textures[panelIndex % textures.length], side: THREE.BackSide });
        const panel = new THREE.Mesh(geometry, material);
        carousel.add(panel);
        panels.push(panel);
      }

      scene.add(carousel);
      stage.classList.add('is-ready');
      stage.classList.remove('is-loading');

      const resizeRenderer = () => {
        const bounds = stage.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setSize(bounds.width, bounds.height, false);
        camera.aspect = bounds.width / bounds.height;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
      };

      const resizeObserver = new ResizeObserver(resizeRenderer);
      resizeObserver.observe(stage);
      resizeRenderer();

      photoSources.forEach((source, textureIndex) => {
        if (textureIndex === 0) return;
        const textureLoad = source.startsWith('http')
          ? loadSource(source).catch(() => null)
          : loadPortrait(source);

        void textureLoad.then((texture) => {
          if (!texture || !stage.isConnected) return;
          textures[textureIndex] = texture;

          for (let panelIndex = textureIndex; panelIndex < panels.length; panelIndex += textures.length) {
            const material = panels[panelIndex].material;
            if (!(material instanceof THREE.MeshBasicMaterial)) continue;
            material.map = texture;
          }

          renderer.render(scene, camera);
        });
      });

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      const clock = new THREE.Clock();
      let isVisible = true;
      let isDragging = false;
      let previousPointerX = 0;
      let animationFrame = 0;

      const animate = () => {
        animationFrame = 0;
        if (!isVisible) return;
        const delta = Math.min(clock.getDelta(), 0.05);
        if (!isDragging && !reducedMotion.matches) carousel.rotation.y += delta * 0.1;
        if (Math.abs(carousel.rotation.y) > Math.PI * 2) carousel.rotation.y %= Math.PI * 2;
        renderer.render(scene, camera);
        animationFrame = window.requestAnimationFrame(animate);
      };

      const visibilityObserver = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animationFrame) animationFrame = window.requestAnimationFrame(animate);
      }, { threshold: 0.02 });
      visibilityObserver.observe(stage);
      animationFrame = window.requestAnimationFrame(animate);

      stage.addEventListener('pointerdown', (event) => {
        if (!event.isPrimary) return;
        isDragging = true;
        previousPointerX = event.clientX;
        stage.setPointerCapture(event.pointerId);
      });
      stage.addEventListener('pointermove', (event) => {
        if (!isDragging) return;
        carousel.rotation.y -= (event.clientX - previousPointerX) * 0.003;
        previousPointerX = event.clientX;
        renderer.render(scene, camera);
      });
      const stopDragging = () => { isDragging = false; };
      stage.addEventListener('pointerup', stopDragging);
      stage.addEventListener('pointercancel', stopDragging);
    }

    startCarousel();
  }
}
