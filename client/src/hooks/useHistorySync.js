import { useEffect } from 'react';
import { subscribe } from 'valtio';

import state, { fromPath } from '../store';

// Reflect the app's "screen" (section page / editor / cart) into the browser
// history — with a real URL per screen — so:
//  - the hardware/browser Back button navigates inside the app (closing the
//    cart, exiting the editor, returning from a section page) instead of
//    leaving the site (important on Android), and
//  - every screen is deep-linkable/shareable: /disenos, /colecciones,
//    /personalizar, /carrito.

const navSig = () => ({ page: state.page, intro: state.intro, cartOpen: state.cartOpen });
const same = (a, b) => a.page === b.page && a.intro === b.intro && a.cartOpen === b.cartOpen;
// how "deep" a screen is, so we push going deeper and replace coming back
const depth = (n) => (n.cartOpen ? 4 : 0) + (n.intro ? 0 : 2) + (n.page !== 'home' ? 1 : 0);

const pathFor = (n) => {
  if (n.cartOpen) return '/carrito';
  if (!n.intro) return '/personalizar';
  return n.page === 'home' ? '/' : `/${n.page}`;
};

const titleFor = (n) => {
  if (n.cartOpen) return 'Carrito — Viste Tu Fe';
  if (!n.intro) return 'Personalizar — Viste Tu Fe';
  if (n.page === 'disenos') return 'Diseños — Viste Tu Fe';
  if (n.page === 'colecciones') return 'Colecciones — Viste Tu Fe';
  return 'Viste Tu Fe — Personaliza tu camiseta en 3D';
};

export default function useHistorySync() {
  useEffect(() => {
    let applying = false;
    let prev = navSig();
    window.history.replaceState({ nav: prev }, '', pathFor(prev));
    document.title = titleFor(prev);

    const unsub = subscribe(state, () => {
      if (applying) return;
      const cur = navSig();
      if (same(cur, prev)) return; // non-navigation change (colour, drag, cart items…)
      // going deeper or sideways adds an entry; coming back replaces so Back
      // never lands on a screen you just closed
      if (depth(cur) >= depth(prev)) window.history.pushState({ nav: cur }, '', pathFor(cur));
      else window.history.replaceState({ nav: cur }, '', pathFor(cur));
      document.title = titleFor(cur);
      prev = cur;
    });

    const onPop = (e) => {
      const nav = (e.state && e.state.nav) || fromPath(window.location.pathname);
      applying = true;
      state.cartOpen = nav.cartOpen;
      state.intro = nav.intro;
      state.page = nav.page;
      document.title = titleFor(nav);
      prev = navSig();
      Promise.resolve().then(() => { applying = false; });
    };
    window.addEventListener('popstate', onPop);
    return () => { unsub(); window.removeEventListener('popstate', onPop); };
  }, []);
}
