import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, Text, Provider as PaperProvider } from 'react-native-paper';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import LottieView from 'lottie-react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons'; // Usando iconos modernos de Ionicons y AntDesign

// Evita que la pantalla de splash se oculte automáticamente
SplashScreen.preventAutoHideAsync();

const LoginOrRegisterScreen = () => {
  const navigation = useNavigation();

  // Carga de fuentes
  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  // Oculta la pantalla de splash cuando las fuentes estén cargadas
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const navigateToLogin = () => {
    navigation.navigate("Login");
  };

  const navigateToRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.logoText}>idozer</Text>
        <LottieView
          source={require("../../assets/loginor.json")} // Asegúrate de que la animación esté en la ruta correcta
          autoPlay
          loop
          style={styles.lottie}
        />
        <View style={styles.textDiv}>
          <Text style={styles.welcomeText}>Entrar o Registrarse</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={navigateToLogin}
            style={styles.buttonSignUp}
            labelStyle={styles.buttonTextSignUp}
            icon={() => <Ionicons name="log-in-outline" size={24} color="#03A9F4" />} // Icono moderno para Iniciar Sesión
          >
            INICIAR SESIÓN
          </Button>

          <Button
            mode="contained"
            onPress={navigateToRegister}
            style={styles.buttonRegister}
            labelStyle={styles.buttonTextRegister}
            icon={() => <AntDesign name="adduser" size={24} color="#FFFFFF" />} // Icono moderno para Registrarse
          >
            REGISTRARSE
          </Button>
        </View>
      </View>
    </PaperProvider>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: height * 0.05,
    backgroundColor: '#e0eafc', // Fondo multicolor claro
    background: 'linear-gradient(315deg, #e0eafc 0%, #cfdef3 74%, #80deea 100%)', // Degradado multicolor suave
  },
  logoText: {
    fontSize: width * 0.12, // Tamaño de fuente dinámico
    fontWeight: "700",
    color: "#03A9F4", // Color azul vibrante para el logo
    marginBottom: height * 0.02, // Margen inferior dinámico
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 6, // Mayor espaciado entre letras
  },
  lottie: {
    width: width * 0.6, // Ancho dinámico para la animación
    height: width * 0.6, // Mantener proporción cuadrada
    marginBottom: height * 0.03, // Margen inferior dinámico
    backgroundColor: '#f2fcfe', // Fondo claro para la animación
    borderRadius: 20, // Bordes redondeados
    overflow: 'hidden',
    elevation: 10, // Sombra para dar profundidad
  },
  textDiv: {
    width: "85%", // Ajuste de ancho
    marginTop: height * 0.03, // Margen superior dinámico
    alignItems: "center",
  },
  welcomeText: {
    fontSize: width * 0.08, // Fuente dinámica basada en el ancho
    fontWeight: "700",
    color: "#34495e", // Color gris oscuro para buen contraste
    textAlign: "center",
    marginBottom: height * 0.02, // Margen inferior dinámico
  },
  buttonContainer: {
    alignItems: "center",
    width: "85%", // Ancho responsivo
    marginTop: height * 0.04, // Margen superior dinámico
  },
  buttonSignUp: {
    width: "100%",
    paddingVertical: height * 0.02, // Padding vertical dinámico
    borderRadius: 50,
    borderColor: "#03A9F4", // Borde azul vibrante para contraste
    borderWidth: 2,
    marginBottom: height * 0.02, // Margen inferior dinámico
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0f7fa", // Fondo suave y claro
    elevation: 5, // Añadir sombra al botón
  },
  buttonTextSignUp: {
    color: "#03A9F4", // Texto azul vibrante para contraste
    fontSize: width * 0.045, // Fuente un poco más pequeña para mejorar la legibilidad
    fontWeight: "700",
    letterSpacing: 1.5, // Espaciado entre letras para un efecto más moderno
    textTransform: "uppercase", // Texto en mayúsculas para un mayor impacto visual
    textShadowColor: 'rgba(0, 0, 0, 0.25)', // Sombra suave para texto
    textShadowOffset: { width: 1, height: 1 }, // Offset para sombra
    textShadowRadius: 1,
    marginLeft: 30, // Espacio entre icono y texto
  },
  buttonRegister: {
    width: "100%",
    paddingVertical: height * 0.02, // Padding vertical dinámico
    borderRadius: 50,
    backgroundColor: "#03A9F4", // Botón de registro en azul vibrante
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Añadir sombra al botón
  },
  buttonTextRegister: {
    color: "#FFFFFF", // Texto blanco para contraste
    fontSize: width * 0.045, // Fuente un poco más pequeña para mejorar la legibilidad
    fontWeight: "700",
    letterSpacing: 1.5, // Espaciado entre letras para un efecto más moderno
    textTransform: "uppercase", // Texto en mayúsculas para un mayor impacto visual
    textShadowColor: 'rgba(0, 0, 0, 0.25)', // Sombra suave para texto
    textShadowOffset: { width: 1, height: 1 }, // Offset para sombra
    textShadowRadius: 1,
    marginLeft: 30, // Espacio entre icono y texto
  },
});

export default LoginOrRegisterScreen;
