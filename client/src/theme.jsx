import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  localStorage.setItem('career_theme', theme);

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', theme === 'dark' ? '#211033' : '#fbfbfe');
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    const stored = localStorage.getItem('career_theme');
    return stored === 'dark' || stored === 'light' ? stored : 'light';
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';

    const DURATION = 600; // must match --theme-mask transition

    // Crossfade: mask the current theme, swap, then reveal the new one
    const computeStyle = window.getComputedStyle(document.documentElement);
    const surface = computeStyle.getPropertyValue('--color-surface').trim() || 'oklch(0.985 0.005 270)';

    const mask = document.createElement('div');
    mask.className = 'theme-mask';
    mask.style.backgroundColor = surface;
    document.documentElement.appendChild(mask);

    requestAnimationFrame(() => {
      mask.classList.add('theme-mask--active');
    });

    setTimeout(() => {
      setTheme(next);
      applyTheme(next);

      requestAnimationFrame(() => {
        mask.classList.remove('theme-mask--active');
      });
    }, DURATION);

    setTimeout(() => mask.remove(), DURATION * 2);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

