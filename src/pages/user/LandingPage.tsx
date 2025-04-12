import { useState } from 'react';
import { Users, Calculator, Receipt, MessageSquare, PieChart, Shield, Clock } from 'lucide-react';
import Navbar from '@/layout/Nav';
import { useTranslation } from 'react-i18next';
import {Link} from 'react-router-dom'



const LandingPage = () => {
  const { t, i18n } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'es' : 'en');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-200`}>
      {/* Use the Navbar component */}
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onToggleLanguage={toggleLanguage}
        logoText="ExpenX"
      />

      {/* Hero Section */}
      <section id="hero" className={`${darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50'} transition-colors duration-200`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className={`text-4xl md:text-6xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
              {t('hero.title')}
            </h1>
            <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-8 max-w-2xl mx-auto`}>
              {t('hero.subtitle')}
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to='/login'>
                <a className={`px-6 py-3 rounded-lg transition-colors ${darkMode ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-emerald-600 hover:bg-emerald-700'} text-white text-lg font-medium`}>
                  Get Started as User
                </a>
              </Link>

            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`py-20 px-4 sm:px-6 lg:px-8 ${darkMode ? 'bg-gray-900' : 'bg-white'} transition-colors duration-200`}>
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t('features.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className={`text-center p-6 rounded-xl ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:shadow-lg'} transition-all`}>
              <Users className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('features.groupExpenses')}
              </h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                {t('features.groupExpensesDesc')}
              </p>
            </div>
            <div className={`text-center p-6 rounded-xl ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:shadow-lg'} transition-all`}>
              <Calculator className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('features.smartCalc')}
              </h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                {t('features.smartCalcDesc')}
              </p>
            </div>
            <div className={`text-center p-6 rounded-xl ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:shadow-lg'} transition-all`}>
              <Receipt className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('features.billScan')}
              </h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                {t('features.billScanDesc')}
              </p>
            </div>
            <div className={`text-center p-6 rounded-xl ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:shadow-lg'} transition-all`}>
              <MessageSquare className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('features.groupChat')}
              </h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                {t('features.groupChatDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of the sections remain the same */}
      {/* Chat Preview Section */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} transition-colors duration-200`}>
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t('chat.title')}
          </h2>
          <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-xl shadow-xl p-6 max-w-2xl mx-auto`}>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-emerald-100 rounded-full p-2">
                  <Users className="h-6 w-6 text-emerald-600" />
                </div>
                <div className={`flex-1 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg p-3`}>
                  <p className={darkMode ? 'text-white' : 'text-gray-800'}>
                    {t('chat.advisor')}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 justify-end">
                <div className="flex-1 bg-emerald-600 rounded-lg p-3">
                  <p className="text-white">{t('chat.user')}</p>
                </div>
                <div className="bg-emerald-100 rounded-full p-2">
                  <Users className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id='whyExpenX' className={`py-20 px-4 sm:px-6 lg:px-8 ${darkMode ? 'bg-gray-900' : 'bg-white'} transition-colors duration-200`}>
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t('benefits.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <Shield className="h-12 w-12 text-emerald-600 mb-4" />
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('benefits.secure')}
              </h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                {t('benefits.secureDes')}
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Clock className="h-12 w-12 text-emerald-600 mb-4" />
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('benefits.save')}
              </h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                {t('benefits.saveDes')}
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <PieChart className="h-12 w-12 text-emerald-600 mb-4" />
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('benefits.overview')}
              </h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                {t('benefits.overviewDes')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id='about' className={`${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-900 text-gray-300'} py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200`}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Features</a></li>
              <li><a href="#" className="hover:text-white">Pricing</a></li>
              <li><a href="#" className="hover:text-white">Security</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">About</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
              <li><a href="#" className="hover:text-white">Terms</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Privacy</a></li>
              <li><a href="#" className="hover:text-white">Terms</a></li>
              <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center">
          <p>© 2025 ExpenX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;