// Importar las funciones necesarias desde los módulos de Firebase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Configuración para conectar tu aplicación con tu proyecto Firebase específico
const firebaseConfig = {
  apiKey: 'AIzaSyAcxnAK-YnqP4EuKbmTbWKqqZ60da4P-FA', // Clave única de API para acceder a los servicios de Firebase
  authDomain: 'my-first-project-react-f7dbd.firebaseapp.com', // Dominio de autorización para manejo de autenticación
  databaseURL: 'https://my-first-project-react-f7dbd-default-rtdb.firebaseio.com/', // URL de la base de datos en tiempo real
  projectId: 'my-first-project-react-f7dbd', // ID del proyecto en Firebase
  storageBucket: 'gs://my-first-project-react-f7dbd.appspot.com', // Bucket de almacenamiento para guardar archivos como imágenes, videos, etc.
  messagingSenderId: '667591019491', // ID del remitente para el uso de Firebase Cloud Messaging
  appId: '1:667591019491:android:71bd576065e7ee2b292ed6' // ID de la aplicación, importante para la configuración del SDK
};

// Inicializa la aplicación Firebase con las configuraciones definidas arriba
const app = initializeApp(firebaseConfig);

// Exporta una instancia de autenticación asociada a la aplicación inicializada
export const auth = getAuth(app); // Se usa para manejar todo lo relacionado con la autenticación de usuarios
