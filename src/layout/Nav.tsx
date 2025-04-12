import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Wallet, ChevronRight, Globe, Sun, Moon, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import {NavbarProps} from './types'


const Navbar: React.FC<NavbarProps> = ({
  darkMode = false,
  onToggleDarkMode,
  onToggleLanguage,
  logoText = 'ExpenX'
}) => {
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <header className={`${darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50'} sticky top-0 z-10`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            <Wallet className="h-8 w-8 text-emerald-600" />
            <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{logoText}</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
              {t('nav.features')}
            </a>
            <a href="#whyExpenX" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
              {t('nav.WhyExpenX')}
            </a>
            <a href="#about" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
              {t('nav.about')}
            </a>
          </div>

          {/* Right side items */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language toggle */}
            <button
              onClick={onToggleLanguage}
              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              aria-label="Toggle language"
            >
              <Globe className="h-5 w-5 text-emerald-600" />
              <span className="ml-1 text-sm">{i18n.language.toUpperCase()}</span>
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={onToggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-slate-700" />}
            </button>

            <div className="flex items-center gap-2">

            </div>

            <Link to="/advisor">
              <a className={`inline-flex items-center gap-2 ${darkMode ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-emerald-600 hover:bg-emerald-700'} text-white px-4 py-2 rounded-lg transition-colors font-medium`}>
                {t('nav.startAdvisor')}
                <ChevronRight className="h-5 w-5" />
              </a>
            </Link>

          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={onToggleLanguage}
              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              aria-label="Toggle language"
            >
              <Globe className="h-5 w-5 text-emerald-600" />
            </button>
            <button
              onClick={onToggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-slate-700" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              {mobileMenuOpen ?
                <X className={`h-6 w-6 ${darkMode ? 'text-white' : 'text-gray-900'}`} /> :
                <Menu className={`h-6 w-6 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
              }
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {mobileMenuOpen && (
        <div className={`md:hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} py-2 px-4`}>
          <div className="space-y-1">
            <a href="#features" className="block py-2 px-3 rounded-md text-base font-medium text-emerald-600">
              {t('nav.features')}
            </a>
            <a href="#whyExpenX" className="block py-2 px-3 rounded-md text-base font-medium text-emerald-600">
              {t('nav.WhyExpenX')}
            </a>
            <a href="#about" className="block py-2 px-3 rounded-md text-base font-medium text-emerald-600">
              {t('nav.about')}
            </a>
            <div className="pt-4 flex flex-col gap-2">

              <Link to="/advisor">
                <a className={`flex items-center justify-center gap-2 ${darkMode ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-emerald-600 hover:bg-emerald-700'} text-white px-4 py-2 rounded-lg transition-colors font-medium mt-2`}>
                  {t('nav.startAdvisor')}
                  <ChevronRight className="h-5 w-5" />
                </a>
              </Link>

            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;