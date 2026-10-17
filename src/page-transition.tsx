import { createRoot } from 'react-dom/client';
import Loader from '@/components/ui/carousel-loader';

const transitionRoot = document.getElementById('page-transition-root');
const isHomePath = window.location.pathname === '/' || window.location.pathname.endsWith('/index.html');

if (isHomePath && !window.location.hash) {
  window.history.scrollRestoration = 'manual';
  window.scrollTo({ top: 0, behavior: 'instant' });
}

if (transitionRoot) {
  const shouldShowPreloader = isHomePath
    && document.documentElement.classList.contains('page-transition-pending');

  let loaderRoot: ReturnType<typeof createRoot> | null = null;

  const markInternalNavigation = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!(event.target instanceof Element)) return;

    const link = event.target.closest<HTMLAnchorElement>('a[href]');
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;

    const target = new URL(link.href, window.location.href);
    const isHomeDestination = target.pathname === '/' || target.pathname.endsWith('/index.html');
    const isHomeSection = !target.hash || target.hash === '#home' || target.hash === '#about-story';
    if (
      target.origin !== window.location.origin
      || target.pathname === window.location.pathname
      || !isHomeDestination
      || !isHomeSection
    ) return;

    window.sessionStorage.setItem('mf-internal-transition', String(Date.now()));
    document.documentElement.classList.add('page-transition-internal-pending');
  };

  document.addEventListener('click', markInternalNavigation, true);

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

  if (shouldShowPreloader) {
    window.addEventListener(
      'mf-loader-complete',
      hideTransition,
      { once: true },
    );
    showTransition();
  } else {
    document.documentElement.classList.remove('page-transition-pending');
  }

  if (!shouldShowPreloader && document.documentElement.classList.contains('page-transition-internal-pending')) {
    const startedAt = Number(document.documentElement.dataset.internalTransitionStarted);
    const remainingDuration = Math.max(0, 2320 - (Date.now() - startedAt));
    const hideInternalTransition = () => {
      window.setTimeout(() => {
        document.documentElement.classList.remove('page-transition-internal-pending');
      }, remainingDuration);
    };

    if (document.readyState === 'complete') hideInternalTransition();
    else window.addEventListener('load', hideInternalTransition, { once: true });
  }

}
