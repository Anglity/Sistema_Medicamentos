// Importar las funciones necesarias desde los módulos de Firebase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';  // Asegúrate de importar getDatabase

// Configuración para conectar tu aplicación con tu proyecto Firebase específico
const firebaseConfig = {
  apiKey: 'AIzaSyAcxnAK-YnqP4EuKbmTbWKqqZ60da4P-FA',
  authDomain: 'my-first-project-react-f7dbd.firebaseapp.com',
  databaseURL: 'https://my-first-project-react-f7dbd-default-rtdb.firebaseio.com/',  // Aquí está la URL de la base de datos
  projectId: 'my-first-project-react-f7dbd',
  storageBucket: 'gs://my-first-project-react-f7dbd.appspot.com',
  messagingSenderId: '667591019491',
  appId: '1:667591019491:android:71bd576065e7ee2b292ed6'
};

// Inicializa la aplicación Firebase con las configuraciones definidas arriba
const app = initializeApp(firebaseConfig);

// Exporta las instancias de autenticación y base de datos
export const auth = getAuth(app);
export const db = getDatabase(app);  // Asegúrate de que getDatabase se llame con la instancia app
