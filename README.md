# TheWatchList

Una aplicación móvil para llevar el seguimiento de películas y series que quieres ver.

## 🌟 Características

- ✨ Interfaz moderna con **styled-components**
- 🌍 Soporte multiidioma (Español/Inglés) con **react-i18next**
- 🔥 Integración con **Firebase** (Auth, Firestore, Storage)
- 🔒 Variables de entorno seguras para configuración
- 📱 Optimizada para **React Native** y **Expo**

## 🚀 Instalación

1. Clona el repositorio:
```bash
git clone <your-repo-url>
cd TheWatchList
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura Firebase:
   - Copia `.env.example` a `.env`
   - Ve a [Firebase Console](https://console.firebase.google.com/)
   - Crea un nuevo proyecto o selecciona uno existente
   - Añade una aplicación web
   - Copia los valores de configuración a tu archivo `.env`

4. Inicia la aplicación:
```bash
npm start
```

## 🔧 Configuración de Firebase

Crea un archivo `.env` en la raíz del proyecto con la siguiente estructura:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=tu_api_key_aquí
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_project_id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_project_id.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

## 🎨 Estilos

Hemos elegido **styled-components** para el manejo de estilos porque:

- ✅ Excelente integración con React Native
- ✅ Props dinámicas para componentes
- ✅ Temas y variables CSS-in-JS
- ✅ TypeScript support
- ✅ No conflictos con otros sistemas de estilos

### Alternativas de estilos recomendadas:

1. **styled-components** (implementado) - CSS-in-JS con props dinámicas
2. **React Native Elements** - Biblioteca de componentes UI
3. **UI Kitten** - Tema Eva Design System
4. **NativeBase** - Componentes móviles modulares
5. **Shoutem UI** - Conjunto de componentes customizables

## 🌍 Internacionalización

La app soporta cambio dinámico entre inglés y español. Los archivos de traducción están en:
- `src/locales/en.json` - Inglés
- `src/locales/es.json` - Español

Para añadir un nuevo idioma:
1. Crea un nuevo archivo JSON en `src/locales/`
2. Añádelo a `src/i18n/index.ts`

## 📁 Estructura del proyecto

```
src/
├── components/
│   └── styled/
│       └── CommonStyles.ts    # Componentes styled-components
├── config/
│   └── firebase.ts           # Configuración de Firebase
├── i18n/
│   └── index.ts             # Configuración de i18next
└── locales/
    ├── en.json              # Traducciones en inglés
    └── es.json              # Traducciones en español
```

## 🔒 Seguridad

- El archivo `.env` está en `.gitignore` para mantener las credenciales seguras
- Usa `.env.example` como plantilla para otros desarrolladores
- Las variables de entorno usan el prefijo `EXPO_PUBLIC_` para ser accesibles en el cliente

## 📱 Scripts disponibles

```bash
npm start          # Inicia Expo DevTools
npm run android    # Ejecuta en Android
npm run ios        # Ejecuta en iOS
npm run web        # Ejecuta en web
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es open source. Ver el archivo `LICENSE` para más detalles.
