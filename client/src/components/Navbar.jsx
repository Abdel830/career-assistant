import { Link, useLocation } from 'react-router-dom';
import { Sparkles, LayoutDashboard, FileSearch, Menu, X, Sun, Moon, Globe, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../theme.jsx';
import { useLanguage } from '../LanguageContext.jsx';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t, languages } = useLanguage();
  const location = useLocation();
  const langMenuRef = useRef(null);

  const links = [
    { to: '/', label: t('navHome'), icon: Sparkles },
    { to: '/analyze', label: t('navAnalyze'), icon: FileSearch },
    { to: '/dashboard', label: t('navDashboard'), icon: LayoutDashboard },
  ];

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    function handleClickOutside(event) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setLangMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:shadow-[var(--shadow-glow)] transition-shadow duration-300">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary-light to-secondary-light bg-clip-text text-transparent">
              CareerAI
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive(to)
                    ? 'text-primary-light bg-primary/10'
                    : 'text-text-muted hover:text-text hover:bg-surface-elevated'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>

          {/* Language Selector + Theme toggle + CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Dropdown */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-text-muted hover:text-text hover:bg-surface-elevated border border-transparent hover:border-border transition-all"
              >
                <Globe className="w-4 h-4 text-primary-light" />
                <span>{languages[language]?.flag} {languages[language]?.name}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-44 rounded-xl bg-surface-elevated border border-border shadow-xl py-1 z-50 animate-fade-in">
                  {Object.entries(languages).map(([code, lang]) => (
                    <button
                      key={code}
                      onClick={() => {
                        setLanguage(code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                        language === code
                          ? 'bg-primary/15 text-primary-light font-semibold'
                          : 'text-text-muted hover:text-text hover:bg-surface'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                      {language === code && <span className="text-xs text-primary font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2.5 rounded-xl text-text-muted hover:text-text hover:bg-surface-elevated border border-transparent hover:border-border transition-all"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link to="/analyze" className="btn-primary text-sm">
              <span>{t('startAnalysis')}</span>
            </Link>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Language Switcher Button */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="p-2 text-sm text-text-muted hover:text-text flex items-center gap-1"
              >
                <span>{languages[language]?.flag}</span>
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-36 rounded-xl bg-surface-elevated border border-border shadow-xl py-1 z-50">
                  {Object.entries(languages).map(([code, lang]) => (
                    <button
                      key={code}
                      onClick={() => {
                        setLanguage(code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left ${
                        language === code ? 'text-primary font-bold bg-primary/10' : 'text-text'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 text-text-muted hover:text-text transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>

            {/* Mobile menu button */}
            <button
              className="p-2 text-text-muted hover:text-text transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive(to)
                    ? 'text-primary-light bg-primary/10'
                    : 'text-text-muted hover:text-text hover:bg-surface-elevated'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
            <Link
              to="/analyze"
              onClick={() => setMobileOpen(false)}
              className="btn-primary block text-center mt-3 text-sm"
            >
              <span>{t('startAnalysis')}</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
