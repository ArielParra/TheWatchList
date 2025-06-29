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
  const deviceLanguage = Localization.locale.split('-')[0];
  // Si el dispositivo está en español, usar español, sino inglés
  return deviceLanguage === 'es' ? 'es' : 'en';
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
  const initialLanguage = await getStoredLanguage();
  
  i18n
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
};

// Inicializar i18n
initI18n();

export default i18n;