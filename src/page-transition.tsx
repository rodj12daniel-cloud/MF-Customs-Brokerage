import { createRoot } from 'react-dom/client';
import Loader from '@/components/ui/carousel-loader';

const transitionStorageKey = 'mf-page-transition';
const transitionRoot = document.getElementById('page-transition-root');
const isHomePath = window.location.pathname === '/' || window.location.pathname.endsWith('/index.html');
const skipInitialLoader = false;

if (isHomePath && !window.location.hash) {
  window.history.scrollRestoration = 'manual';
  window.scrollTo({ top: 0, behavior: 'instant' });
}

if (transitionRoot) {
  let isTransitioning = false;

  try {
    isTransitioning = sessionStorage.getItem(transitionStorageKey) === 'active';
    sessionStorage.removeItem(transitionStorageKey);
  } catch {
    document.documentElement.classList.remove('page-transition-pending');
  }
  const shouldShowOnPageLoad = true;

  let loaderRoot: ReturnType<typeof createRoot> | null = null;

  const showTransition = () => {
    if (!loaderRoot) {
      loaderRoot = createRoot(transitionRoot);
      loaderRoot.render(<Loader />);
    }
    transitionRoot.classList.add('is-visible');
    transitionRoot.setAttribute('aria-hidden', 'false');
  };

  const hideTransition = () => {
    transitionRoot.classList.remove('is-visible');
    transitionRoot.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('page-transition-pending');
    window.setTimeout(() => {
      if (transitionRoot.classList.contains('is-visible') || !loaderRoot) return;
      loaderRoot.unmount();
      loaderRoot = null;
    }, 350);
  };

  if (skipInitialLoader) {
    transitionRoot.classList.remove('is-visible');
    transitionRoot.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('page-transition-pending');
  } else if (isHomePath && (isTransitioning || shouldShowOnPageLoad)) {
    window.addEventListener(
      'mf-loader-complete',
      () => window.setTimeout(hideTransition, 2000),
      { once: true },
    );
    showTransition();
  } else {
    document.documentElement.classList.remove('page-transition-pending');
  }

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!(event.target instanceof Element)) return;

    const link = event.target.closest<HTMLAnchorElement>('a[href]');
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin) return;
    const isHomeDestination = destination.pathname === '/' || destination.pathname.endsWith('/index.html');
    const isCurrentHomeLink = link.matches('.nav a[aria-current="page"], .mobile-dock a[aria-current="page"]')
      && destination.pathname.endsWith('/index.html')
      && !destination.hash;

    if (destination.pathname === window.location.pathname && destination.search === window.location.search) {
      if (isCurrentHomeLink) {
        event.preventDefault();
        window.history.replaceState(window.history.state, '', destination.href);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (!isHomeDestination) return;

    event.preventDefault();
    try {
      sessionStorage.setItem(transitionStorageKey, 'active');
      document.documentElement.classList.add('page-transition-pending');
    } catch {
      // The current page overlay still covers navigation when session storage is unavailable.
    }
    showTransition();
    window.setTimeout(() => window.location.assign(destination.href), 220);
  }, true);
}
