import { createContext, useContext } from "react";

export type Theme = "dark" | "light";

export const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "dark",
  toggle: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const THEME_KEY = "sf-theme";

/** Same rule as the inline script in index.html, so the first paint and React agree. */
export function readInitialTheme(): Theme {
  const set = document.documentElement.dataset.theme;
  return set === "light" ? "light" : "dark";
}
