'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieConsentProps {
  locale: string;
}

export default function CookieConsent({ locale }: CookieConsentProps) {
  const t = useTranslations('cookies');
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'categories' | 'services'>('categories');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Verificar si ya hay consentimiento guardado
    const savedConsent = localStorage.getItem('cookie-consent');
    if (!savedConsent) {
      // Si no hay consentimiento, mostrar el banner después de 1 segundo
      setTimeout(() => setIsOpen(true), 1000);
    } else {
      // Cargar preferencias guardadas
      try {
        const saved = JSON.parse(savedConsent);
        setPreferences(saved);
      } catch (e) {
        console.error('Error parsing cookie consent:', e);
      }
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify(prefs));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setPreferences(prefs);
    setIsOpen(false);
  };

  const acceptAll = () => {
    savePreferences({
      essential: true,
      analytics: true,
      marketing: true,
    });
  };

  const rejectAll = () => {
    savePreferences({
      essential: true,
      analytics: false,
      marketing: false,
    });
  };

  const saveCustom = () => {
    savePreferences(preferences);
  };

  const toggleCategory = (category: 'analytics' | 'marketing') => {
    setPreferences(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-fadeIn"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-consent-title"
        className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden pointer-events-auto animate-fadeInUp"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#d50058] to-[#b30048] p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 id="cookie-consent-title" className="text-2xl font-bold mb-2">
                  {t('title')}
                </h1>
                <p className="text-sm text-white/90">
                  {t('subtitle')}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="ml-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label={t('close')}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col h-[calc(90vh-240px)] max-h-[500px]">
            {/* Description */}
            <div className="p-6 border-b border-gray-200">
              <p className="text-gray-700 text-sm leading-relaxed">
                {t('description')}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 px-6">
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-6 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                  activeTab === 'categories'
                    ? 'text-[#d50058] border-[#d50058]'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
                role="tab"
                aria-selected={activeTab === 'categories'}
              >
                {t('tabs.categories')}
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`px-6 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                  activeTab === 'services'
                    ? 'text-[#d50058] border-[#d50058]'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
                role="tab"
                aria-selected={activeTab === 'services'}
              >
                {t('tabs.services')}
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'categories' && (
                <div className="space-y-4">
                  {/* Essential Cookies */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedCategory(expandedCategory === 'essential' ? null : 'essential')}
                      className="w-full p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                          {t('categories.essential.title')}
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            {t('alwaysActive')}
                          </span>
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {t('categories.essential.description')}
                        </p>
                      </div>
                      <div className="ml-4 flex items-center gap-3">
                        {/* Toggle always on */}
                        <div className="w-11 h-6 bg-green-500 rounded-full relative flex items-center">
                          <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 shadow-md" />
                        </div>
                        <svg
                          className={`w-5 h-5 text-gray-400 transition-transform ${
                            expandedCategory === 'essential' ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    {expandedCategory === 'essential' && (
                      <div className="p-4 bg-white border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          {t('categories.essential.details')}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Analytics Cookies */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedCategory(expandedCategory === 'analytics' ? null : 'analytics')}
                      className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-gray-900">
                          {t('categories.analytics.title')}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {t('categories.analytics.description')}
                        </p>
                      </div>
                      <div className="ml-4 flex items-center gap-3">
                        {/* Toggle */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCategory('analytics');
                          }}
                          role="switch"
                          aria-checked={preferences.analytics}
                          className={`w-11 h-6 rounded-full relative transition-colors ${
                            preferences.analytics ? 'bg-[#d50058]' : 'bg-gray-300'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-md transition-transform ${
                              preferences.analytics ? 'right-0.5' : 'left-0.5'
                            }`}
                          />
                        </button>
                        <svg
                          className={`w-5 h-5 text-gray-400 transition-transform ${
                            expandedCategory === 'analytics' ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    {expandedCategory === 'analytics' && (
                      <div className="p-4 bg-white border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          {t('categories.analytics.details')}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Marketing Cookies */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedCategory(expandedCategory === 'marketing' ? null : 'marketing')}
                      className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-gray-900">
                          {t('categories.marketing.title')}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {t('categories.marketing.description')}
                        </p>
                      </div>
                      <div className="ml-4 flex items-center gap-3">
                        {/* Toggle */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCategory('marketing');
                          }}
                          role="switch"
                          aria-checked={preferences.marketing}
                          className={`w-11 h-6 rounded-full relative transition-colors ${
                            preferences.marketing ? 'bg-[#d50058]' : 'bg-gray-300'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-md transition-transform ${
                              preferences.marketing ? 'right-0.5' : 'left-0.5'
                            }`}
                          />
                        </button>
                        <svg
                          className={`w-5 h-5 text-gray-400 transition-transform ${
                            expandedCategory === 'marketing' ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    {expandedCategory === 'marketing' && (
                      <div className="p-4 bg-white border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          {t('categories.marketing.details')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'services' && (
                <div className="text-center py-8 text-gray-500">
                  <p>{t('servicesInfo')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={acceptAll}
                className="flex-1 px-6 py-3 bg-[#d50058] hover:bg-[#b30048] text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                {t('buttons.acceptAll')}
              </button>
              <button
                onClick={rejectAll}
                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
              >
                {t('buttons.rejectAll')}
              </button>
              <button
                onClick={saveCustom}
                className="flex-1 px-6 py-3 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-lg transition-colors border-2 border-gray-300"
              >
                {t('buttons.savePreferences')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
