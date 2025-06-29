import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from '../locales/en.json';
import es from '../locales/es.json';

const LANGUAGE_KEY = 'user_language';

const resources = {
  en: {
    translation: en
  },
  es: {
    translation: es
  }
};

// Función para detectar el idioma
const getDeviceLanguage = () => {
  try {
    const locale = Localization.locale;
    if (!locale || typeof locale !== 'string') {
      console.warn('Device locale not available, defaulting to English');
      return 'en';
    }
    const deviceLanguage = locale.split('-')[0];
    // Si el dispositivo está en español, usar español, sino inglés
    return deviceLanguage === 'es' ? 'es' : 'en';
  } catch (error) {
    console.error('Error detecting device language:', error);
    return 'en';
  }
};

// Función para obtener el idioma guardado o detectar automáticamente
const getStoredLanguage = async () => {
  try {
    const storedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (storedLanguage && (storedLanguage === 'es' || storedLanguage === 'en')) {
      return storedLanguage;
    }
    // Si no hay idioma guardado, usar el del dispositivo
    return getDeviceLanguage();
  } catch (error) {
    console.error('Error getting stored language:', error);
    return getDeviceLanguage();
  }
};

// Función para guardar el idioma seleccionado
export const saveLanguage = async (language: string) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
  } catch (error) {
    console.error('Error saving language:', error);
  }
};

// Función para cambiar idioma manualmente
export const changeLanguage = async (language: string) => {
  await saveLanguage(language);
  i18n.changeLanguage(language);
};

const initI18n = async () => {
  try {
    const initialLanguage = await getStoredLanguage();
    
    await i18n
      .use(initReactI18next)
      .init({
        resources,
        lng: initialLanguage,
        fallbackLng: 'en',
        interpolation: {
          escapeValue: false
        },
        react: {
          useSuspense: false
        }
      });
    
    console.log('i18n initialized with language:', initialLanguage);
  } catch (error) {
    console.error('Error initializing i18n:', error);
    // Fallback initialization
    i18n
      .use(initReactI18next)
      .init({
        resources,
        lng: 'en',
        fallbackLng: 'en',
        interpolation: {
          escapeValue: false
        },
        react: {
          useSuspense: false
        }
      });
  }
};

// Inicializar i18n y exportar una promesa para asegurar inicialización
let i18nInitialized = false;
const initPromise = initI18n().then(() => {
  i18nInitialized = true;
}).catch((error) => {
  console.error('Failed to initialize i18n:', error);
  i18nInitialized = true; // Marcar como inicializado aunque haya fallado
});

// Función para asegurar que i18n esté inicializado
export const ensureI18nInitialized = async () => {
  if (!i18nInitialized) {
    await initPromise;
  }
  return i18n;
};

export default i18n;