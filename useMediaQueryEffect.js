import { useLayoutEffect } from "react";
export function useMediaQueryEffect(query, onMatch, onNotMatch) {
  useLayoutEffect(() => {
    function handleMediaQuery() {
      if (window.matchMedia(`(max-width: ${query}px)`).matches) {
        onMatch?.();
      } else {
        onNotMatch?.();
      }
    }
    handleMediaQuery();
    window.addEventListener("resize", handleMediaQuery);
    return () => window.removeEventListener("resize", handleMediaQuery);
  }, [query, onMatch, onNotMatch]);
}
