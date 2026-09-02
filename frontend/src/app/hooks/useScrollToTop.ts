import { useEffect } from "react";
import { useLocation } from "react-router";

// react-router's data router (createBrowserRouter) doesn't reset scroll
// position on navigation by itself — without this, clicking a footer link
// (or any in-app link) while scrolled down on the current page leaves the
// new page's content wherever the viewport already was, instead of starting
// from the top. Keyed on pathname only, not search/hash, so paginated
// filters (?category=...) don't fight in-page anchor scrolling.
export function useScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
}
