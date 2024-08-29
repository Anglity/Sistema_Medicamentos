// config/firebaseConfig.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Configuración para conectar tu aplicación con tu proyecto Firebase específico
const firebaseConfig = {
  apiKey: 'AIzaSyAcxnAK-YnqP4EuKbmTbWKqqZ60da4P-FA',
  authDomain: 'my-first-project-react-f7dbd.firebaseapp.com',
  databaseURL: 'https://my-first-project-react-f7dbd-default-rtdb.firebaseio.com/',
  projectId: 'my-first-project-react-f7dbd',
  storageBucket: 'my-first-project-react-f7dbd.appspot.com',
  messagingSenderId: '667591019491',
  appId: '1:667591019491:android:71bd576065e7ee2b292ed6'
};

// Inicializa la aplicación Firebase solo si aún no está inicializada
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Exporta las instancias de autenticación y base de datos
export const auth = getAuth(app);
export const db = getDatabase(app);
