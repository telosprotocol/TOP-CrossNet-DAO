import { LANG_STORAGE_KEY } from '@/utils/config'
import i18n from 'i18next'
import { useEffect } from 'react'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      'Welcome to React': 'Welcome to React and react-i18next',
    },
  },
  fr: {
    translation: {
      'Welcome to React': 'Bienvenue à React et react-i18next',
    },
  },
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

export default i18n

export function useInitLocalStorageLang() {
  useEffect(() => {
    const l = localStorage.getItem(LANG_STORAGE_KEY) || 'en'
    if (l !== 'en') {
      i18n.changeLanguage(l)
    }
  }, [])
}

export function changeLanguage(l: 'en' | 'fr') {
  localStorage.setItem(LANG_STORAGE_KEY, l)
  i18n.changeLanguage(l)
}
