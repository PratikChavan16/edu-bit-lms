"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system";

export interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: "class" | "data-theme";
  defaultTheme?: Theme;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  storageKey?: string;
}

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

const DEFAULT_STORAGE_KEY = "bitflow-theme";

const getSystemTheme = () => (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

const disableTransitionsTemporarily = (shouldDisable: boolean) => {
  if (!shouldDisable) {
    return;
  }

  const style = document.createElement("style");
  style.appendChild(document.createTextNode("* { transition: none !important; }"));
  document.head.appendChild(style);

  queueMicrotask(() => {
    document.head.removeChild(style);
  });
};

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = false,
  storageKey = DEFAULT_STORAGE_KEY
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(() => defaultTheme);
  const [mounted, setMounted] = React.useState(false);

  const applyTheme = React.useCallback(
    (value: Theme) => {
      const root = document.documentElement;
      const resolved = value === "system" && enableSystem ? getSystemTheme() : value;

      disableTransitionsTemporarily(disableTransitionOnChange);

      if (attribute === "class") {
        root.classList.remove("light", "dark");
        root.classList.add(resolved);
      } else {
        root.setAttribute(attribute, resolved);
      }
    },
    [attribute, disableTransitionOnChange, enableSystem]
  );

  const setTheme = React.useCallback(
    (value: Theme) => {
      setThemeState(value);

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(storageKey, value);
        } catch (error) {
          console.warn("Unable to persist theme preference", error);
        }
      }
    },
    [storageKey]
  );

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedTheme = ((): Theme | null => {
      try {
        const entry = localStorage.getItem(storageKey);
        return entry === "light" || entry === "dark" || entry === "system" ? entry : null;
      } catch (error) {
        console.warn("Unable to read theme preference", error);
        return null;
      }
    })();

    const initialTheme = savedTheme ?? defaultTheme;
    setThemeState(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);

    if (!enableSystem) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      setThemeState((current) => {
        if (current !== "system") {
          return current;
        }

        applyTheme("system");
        return current;
      });
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [applyTheme, defaultTheme, enableSystem, storageKey]);

  React.useEffect(() => {
    if (!mounted) {
      return;
    }

    applyTheme(theme);
  }, [applyTheme, mounted, theme]);

  const resolvedTheme = React.useMemo<"light" | "dark">(() => {
    if (theme === "system" && typeof window !== "undefined" && enableSystem) {
      return getSystemTheme();
    }

    return theme === "dark" ? "dark" : "light";
  }, [enableSystem, theme]);

  const value = React.useMemo<ThemeContextValue>(() => ({ theme, resolvedTheme, setTheme }), [resolvedTheme, setTheme, theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
