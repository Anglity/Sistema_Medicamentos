// config/firebaseConfig.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Usar getAuth en lugar de initializeAuth
import { getDatabase } from 'firebase/database';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyAcxnAK-YnqP4EuKbmTbWKqqZ60da4P-FA',
  authDomain: 'my-first-project-react-f7dbd.firebaseapp.com',
  databaseURL: 'https://my-first-project-react-f7dbd-default-rtdb.firebaseio.com/',
  projectId: 'my-first-project-react-f7dbd',
  storageBucket: 'my-first-project-react-f7dbd.appspot.com',
  messagingSenderId: '667591019491',
  appId: '1:667591019491:android:71bd576065e7ee2b292ed6',
};

// Inicializa Firebase solo si no está inicializado
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicializa Firebase Auth sin persistencia de AsyncStorage
export const auth = getAuth(app);

// Inicializa Firebase Database
export const db = getDatabase(app);
