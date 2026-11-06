import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { THEME_KEY, ThemeContext, readInitialTheme, type Theme } from "./context";

function applyToDocument(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "light" ? "#eef1f6" : "#0a0a0a");
}

/**
 * Switching theme recolours hundreds of elements. Letting each run its own colour transition
 * stutters on phones, so instead:
 *  - per-element transitions are switched off for the switch ([data-theme-switching]);
 *  - where supported, the View Transitions API cross-fades the whole page in one GPU layer.
 */
function switchTheme(update: () => void) {
  const root = document.documentElement;
  root.setAttribute("data-theme-switching", "");
  const done = () => requestAnimationFrame(() => requestAnimationFrame(() => root.removeAttribute("data-theme-switching")));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const doc = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } };
  if (doc.startViewTransition && !reduced) {
    doc.startViewTransition(() => flushSync(update)).finished.finally(done);
  } else {
    flushSync(update);
    done();
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readInitialTheme);

  useEffect(() => {
    applyToDocument(theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* storage unavailable: theme still works for this visit */
    }
  }, [theme]);

  const toggle = useCallback(() => {
    switchTheme(() => {
      const next: Theme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
      applyToDocument(next); // synchronously, so the view transition captures the new state
      setTheme(next);
    });
  }, []);
  const value = useMemo(() => ({ theme, toggle }), [theme, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
