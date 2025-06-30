# 🎬 The Watch List 📝

A movie tracking application built with React Native and Expo. Keep track of your movies, discover new ones, and never forget what you want to watch!

## ✨ Features

- 🔍 **Movie Search**: Search for movies using The Movie Database (TMDB) API
- 📱 **Cross-platform**: Works on Android, iOS, and Web
- 🎯 **Watch Status**: Mark movies as watched or pending
- 🎲 **Random Suggestions**: Get random movie suggestions from your pending list
- 🎨 **Modern UI**: Clean and responsive design with styled-components
- 🌍 **Multi-language**: Support for English and Spanish
- 🔥 **Firebase Integration**: Real-time data synchronization
- 📊 **Smart Filters**: Filter by genre, year, rating, and watch status
- 🎭 **Detailed Info**: View movie details, ratings, and streaming providers
- 💾 **Offline Support**: Local storage with AsyncStorage

## 🚀 Tech Stack

- **Framework**: React Native with Expo
- **Database**: Firebase Firestore
- **Styling**: Styled Components
- **State Management**: React Hooks
- **Navigation**: React Navigation (if applicable)
- **API**: The Movie Database (TMDB)
- **Internationalization**: react-i18next
- **Storage**: AsyncStorage + Firebase

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ArielParra/TheWatchList.git
   cd TheWatchList
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   EXPO_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
   EXPO_PUBLIC_WATCH_PROVIDERS_COUNTRY=MX
   EXPO_PUBLIC_OTHER_URL=your_other_url
   ```

4. **Start the development server**
   ```bash
   npx expo start --clear
   ```

## 🔧 Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run on web browser
- `npm run build` - Build for web production
- `npm run deploy` - Deploy to Cloudflare Pages

## 📱 Building for Production


### Android APK

```bash
eas build --platform android --profile production
```

### Web Build
```bash
npm run build
```

### Deploy to Cloudflare Pages
```bash
npm run deploy
```

## 🌍 Internationalization

Currently supports:
- English (en)
- Spanish (es)

## 🔮 Roadmap

- [ ] Edit movie names
- [ ] Dark/Light theme toggle
- [ ] Optimize API requests
- [ ] Movie carousel component
- [ ] Credentials without compilation
- [ ] Custom search engines
- [ ] Random movie roulette with color-coded borders
- [ ] User authentication
- [ ] Movie recommendations
- [ ] Social features (sharing lists)
- [ ] Offline mode improvements

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for the movie data
- [Expo](https://expo.dev/) for the amazing development platform
- [Firebase](https://firebase.google.com/) for backend services
- [React Native](https://reactnative.dev/) for the cross-platform framework

## 💝 Made with Love

Made with ❤️ by Ariel for his ❤️ Anahi
