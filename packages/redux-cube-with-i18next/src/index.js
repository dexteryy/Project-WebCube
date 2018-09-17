/* eslint-disable filenames/match-exported */
import { merge } from 'lodash';
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';
// import XHR from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// https://reacttraining.com/react-router/core/guides/redux-integration/deep-integration
export default function withI18next({
  // optional
  i18nextConfig = {},
  ...config
}) {
  /* eslint-disable import/no-named-as-default-member */
  const initClientI18n = () => {
    i18n
      // .use(XHR)
      .use(LanguageDetector)
      /* eslint-enable import/no-named-as-default-member */
      .init(
        merge(
          {
            fallbackLng: 'en',
            load: 'languageOnly',
            defaultNS: 'common',
            debug: process.env.NODE_ENV !== 'production',
            interpolation: {
              escapeValue: false, // not needed for react!!
            },
            // https://github.com/i18next/i18next-browser-languageDetector
            detection: {
              caches: ['cookie', 'localStorage'],
              order: [
                'querystring',
                'cookie',
                'localStorage',
                'navigator',
                'htmlTag',
                'path',
                'subdomain',
              ],
              cookieMinutes: 60 * 24 * 365,
            },
            // https://github.com/i18next/i18next-xhr-backend
            // backend: {},
          },
          i18nextConfig,
        ),
      );
    return i18n;
  };
  return {
    _enableI18next: true,
    _I18nextProvider: I18nextProvider,
    _initClientI18n: initClientI18n,
    ...config,
  };
}
/* eslint-enable filenames/match-exported */
