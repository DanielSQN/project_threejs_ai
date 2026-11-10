import { useEffect, useLayoutEffect } from 'react';
import { subscribe, useSnapshot } from 'valtio';

import state, { fromPath, navIntent } from '../store';

// Reflect the app's "screen" (section page / collection / editor / cart) into
// the browser history — with a real URL per screen — so:
//  - the hardware/browser Back button navigates inside the app (closing the
//    cart, exiting the editor, returning from a section page) instead of
//    leaving the site (important on Android),
//  - every screen is deep-linkable/shareable: /disenos, /disenos?c=colombia,
//    /colecciones, /personalizar, /carrito, and
//  - going BACK returns you to where you were: each screen remembers its
//    scroll position, restored when you come back to it (new screens start at
//    the top).

const navSig = () => ({ page: state.page, intro: state.intro, cartOpen: state.cartOpen, collection: state.collection || null });
const same = (a, b) => a.page === b.page && a.intro === b.intro && a.cartOpen === b.cartOpen && a.collection === b.collection;
// how "deep" a screen is, so we push going deeper and replace coming back
const depth = (n) => (n.cartOpen ? 4 : 0) + (n.intro ? 0 : 2) + (n.page !== 'home' ? 1 : 0);
// the scrollable page underneath (cart/editor are overlays on top of it)
const pageKey = (n) => (n.page === 'home' ? '/' : `/${n.page}${n.page === 'disenos' && n.collection ? `?c=${n.collection}` : ''}`);
const isPage = (n) => n.intro && !n.cartOpen;

const pathFor = (n) => {
  if (n.cartOpen) return '/carrito';
  if (!n.intro) return '/personalizar';
  return pageKey(n);
};

const titleFor = (n) => {
  if (n.cartOpen) return 'Carrito — SAU';
  if (!n.intro) return 'Personalizar — SAU';
  if (n.page === 'disenos') return 'Diseños — SAU';
  if (n.page === 'colecciones') return 'Colecciones — SAU';
  return 'SAU — Camisetas personalizadas';
};

// ---- scroll memory -------------------------------------------------------
const scrollPos = {}; // pageKey -> last scrollY
let current = navSig();
let pendingScroll = null; // scrollY to apply once the new screen has rendered
let idx = 0; // position in our own history stack
const stack = []; // mirror of the screens in the browser history (this visit)

// true when there is an in-app screen to go back to
export const canGoBack = () => idx > 0;

export default function useHistorySync() {
  const snap = useSnapshot(state);

  useEffect(() => {
    let applying = false;
    current = navSig();
    idx = (window.history.state && window.history.state.idx) || 0;
    stack[idx] = current;
    window.history.replaceState({ nav: current, idx }, '', pathFor(current));
    document.title = titleFor(current);
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';

    // remember how far each page is scrolled (only while it is really on screen)
    const onScroll = () => { if (isPage(current)) scrollPos[pageKey(current)] = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });

    // decide where the incoming screen should be scrolled to
    const plan = (prev, cur, back) => {
      if (!isPage(cur)) { pendingScroll = null; return; } // overlays don't scroll the page
      const samePage = pageKey(prev) === pageKey(cur);
      if (samePage && isPage(prev)) { pendingScroll = null; return; }
      // closing the cart leaves the page as it was; everything else that comes
      // BACK to a page restores its position, and a NEW page starts at the top
      if (samePage && prev.intro) { pendingScroll = null; return; }
      pendingScroll = back ? (scrollPos[pageKey(cur)] || 0) : 0;
    };

    const unsub = subscribe(state, () => {
      if (applying) return;
      const cur = navSig();
      if (same(cur, current)) return; // non-navigation change (colour, drag, cart items…)
      const back = navIntent.back || !current.intro; // explicit "volver" or leaving the editor
      navIntent.back = false;
      plan(current, cur, back);
      // going deeper or sideways adds an entry; coming back (or just switching
      // the collection filter) replaces, so Back never lands on a closed screen
      const filterOnly = isPage(cur) && isPage(current) && cur.page === 'disenos' && current.page === 'disenos';
      if (depth(cur) >= depth(current) && !filterOnly) {
        idx += 1;
        stack.length = idx;
        stack[idx] = cur;
        window.history.pushState({ nav: cur, idx }, '', pathFor(cur));
      } else if (idx > 0 && stack[idx - 1] && same(stack[idx - 1], cur)) {
        // the screen we return to is the previous history entry: really go
        // back, so the browser history never holds the same screen twice
        window.history.back();
      } else {
        stack[idx] = cur;
        window.history.replaceState({ nav: cur, idx }, '', pathFor(cur));
      }
      document.title = titleFor(cur);
      current = cur;
    });

    const onPop = (e) => {
      const nav = (e.state && e.state.nav) || fromPath(window.location.pathname, window.location.search);
      const next = { page: nav.page, intro: nav.intro, cartOpen: nav.cartOpen, collection: nav.collection || null };
      idx = (e.state && e.state.idx) || 0;
      stack[idx] = next;
      if (same(next, current)) return; // our own history.back(): already there
      plan(current, next, true);
      applying = true;
      state.cartOpen = next.cartOpen;
      state.intro = next.intro;
      state.page = next.page;
      state.collection = next.collection;
      document.title = titleFor(next);
      current = next;
      Promise.resolve().then(() => { applying = false; });
    };
    window.addEventListener('popstate', onPop);
    return () => {
      unsub();
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // once the new screen is in the DOM, put it where it should be
  useLayoutEffect(() => {
    if (pendingScroll === null) return;
    const top = pendingScroll;
    pendingScroll = null;
    window.scrollTo({ top, behavior: 'auto' });
  }, [snap.page, snap.intro, snap.cartOpen, snap.collection]);
}
