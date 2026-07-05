"use client";



import {

  createContext,

  useCallback,

  useContext,

  useLayoutEffect,

  useState,

  type ReactNode,

} from "react";



export type Theme = "dark" | "light";



const STORAGE_KEY = "interview-eval-theme";



interface ThemeContextValue {

  theme: Theme;

  toggleTheme: () => void;

  setTheme: (t: Theme) => void;

}



const ThemeContext = createContext<ThemeContextValue | null>(null);



function applyTheme(theme: Theme) {

  document.documentElement.setAttribute("data-theme", theme);

  document.documentElement.style.colorScheme = theme;

}



function readTheme(): Theme {

  const attr = document.documentElement.getAttribute("data-theme");

  if (attr === "light" || attr === "dark") return attr;

  try {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved === "light" || saved === "dark") return saved;

  } catch {

    /* ignore */

  }

  return "dark";

}



export function ThemeProvider({ children }: { children: ReactNode }) {

  const [theme, setThemeState] = useState<Theme>("dark");



  useLayoutEffect(() => {

    const initial = readTheme();

    setThemeState(initial);

    applyTheme(initial);

  }, []);



  const setTheme = useCallback((t: Theme) => {

    setThemeState(t);

    localStorage.setItem(STORAGE_KEY, t);

    applyTheme(t);

  }, []);



  const toggleTheme = useCallback(() => {

    setThemeState((prev) => {

      const next: Theme = prev === "dark" ? "light" : "dark";

      localStorage.setItem(STORAGE_KEY, next);

      applyTheme(next);

      return next;

    });

  }, []);



  return (

    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>

      {children}

    </ThemeContext.Provider>

  );

}



export function useTheme() {

  const ctx = useContext(ThemeContext);

  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");

  return ctx;

}

