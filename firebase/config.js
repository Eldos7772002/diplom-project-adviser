import AsyncStorage from "@react-native-async-storage/async-storage"; // Импортируем AsyncStorage из пакета @react-native-async-storage/async-storage для работы с асинхронным хранилищем данных.

import {
  initializeAuth,
  getReactNativePersistence
} from "firebase/auth/react-native"; // Импортируем функции initializeAuth и getReactNativePersistence из модуля "firebase/auth/react-native" для инициализации аутентификации и получения настроек сохранения данных для React Native.

import {
  initializeApp
} from "firebase/app"; // Импортируем функцию initializeApp из модуля "firebase/app" для инициализации приложения Firebase.

import {
  getStorage
} from 'firebase/storage'; // Импортируем функцию getStorage из модуля 'firebase/storage' для получения ссылки на хранилище Firebase.

import {
  getFirestore,
  initializeFirestore
} from "firebase/firestore"; // Импортируем функцию initializeFirestore из модуля "firebase/firestore" для инициализации Firestore.

const firebaseConfig = {
  apiKey: "AIzaSyC2Y6V4uhAHMK9_pDJTGnNN9XBrjQFwgfk",
  authDomain: "chat12312.firebaseapp.com",
  databaseURL: "https://chat12312-default-rtdb.firebaseio.com",
  projectId: "chat12312",
  storageBucket: "chat12312.appspot.com",
  messagingSenderId: "707987901991",
  appId: "1:707987901991:web:15e56ad7090bee55ce4802",
  measurementId: "G-MWDTTYK3SF"
};

// Инициализация приложения Firebase
const app = initializeApp(firebaseConfig);

// Экспорт объекта Firestore, инициализированного для данного приложения
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true, // Опция для использования длинного опроса (long polling) в случае проблем с WebSockets
});

// Инициализация аутентификации Firebase
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage), // Настройка сохранения данных аутентификации с использованием AsyncStorage для React Native
});

// Получение ссылки на хранилище Firebase для данного приложения
export const storage = getStorage(app);
export const database = getFirestore(app);

// Экспорт объекта приложения Firebase
export default app;
