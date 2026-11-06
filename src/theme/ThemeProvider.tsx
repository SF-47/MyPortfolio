import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { THEME_KEY, ThemeContext, readInitialTheme, type Theme } from "./context";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "light" ? "#eef1f6" : "#0a0a0a");
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* storage unavailable: theme still works for this visit */
    }
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);
  const value = useMemo(() => ({ theme, toggle }), [theme, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
