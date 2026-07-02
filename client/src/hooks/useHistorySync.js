import { useEffect } from 'react';
import { subscribe } from 'valtio';

import state from '../store';

// Reflect the app's "screen" (section page / editor / cart) into the browser
// history so the hardware/browser Back button navigates inside the app —
// closing the cart, exiting the editor, or returning from a section page to the
// home — instead of leaving the site. This matters a lot on Android.

const navSig = () => ({ page: state.page, intro: state.intro, cartOpen: state.cartOpen });
const same = (a, b) => a.page === b.page && a.intro === b.intro && a.cartOpen === b.cartOpen;
// how "deep" a screen is, so we push going deeper and replace coming back
const depth = (n) => (n.cartOpen ? 4 : 0) + (n.intro ? 0 : 2) + (n.page !== 'home' ? 1 : 0);

export default function useHistorySync() {
  useEffect(() => {
    let applying = false;
    let prev = navSig();
    window.history.replaceState({ nav: prev }, '');

    const unsub = subscribe(state, () => {
      if (applying) return;
      const cur = navSig();
      if (same(cur, prev)) return; // non-navigation change (colour, drag, cart items…)
      // going deeper or sideways adds an entry; coming back replaces so Back
      // never lands on a screen you just closed
      if (depth(cur) >= depth(prev)) window.history.pushState({ nav: cur }, '');
      else window.history.replaceState({ nav: cur }, '');
      prev = cur;
    });

    const onPop = (e) => {
      const nav = (e.state && e.state.nav) || { page: 'home', intro: true, cartOpen: false };
      applying = true;
      state.cartOpen = nav.cartOpen;
      state.intro = nav.intro;
      state.page = nav.page;
      prev = navSig();
      Promise.resolve().then(() => { applying = false; });
    };
    window.addEventListener('popstate', onPop);
    return () => { unsub(); window.removeEventListener('popstate', onPop); };
  }, []);
}
