import React, { useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, Text, Provider as PaperProvider } from 'react-native-paper';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';

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
        <Image
          style={styles.image}
          source={require("../../assets/medicos.png")}
          resizeMode="contain"
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
          >
            INICIAR SESIÓN
          </Button>

          <Button
            mode="contained"
            onPress={navigateToRegister}
            style={styles.buttonRegister}
            labelStyle={styles.buttonTextRegister}
          >
            REGISTRARSE
          </Button>
        </View>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
    backgroundColor: '#F0F4F8', // Color de fondo más claro y moderno
  },
  logoText: {
    fontSize: 44, // Tamaño de fuente más grande
    fontWeight: "700",
    color: "#03A9F4", // Color más vibrante
    marginBottom: 30, // Mayor margen inferior
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 3, // Mayor espaciado de letras
  },
  image: {
    width: "80%",
    height: "35%", // Ajuste del tamaño de la imagen
    marginTop: 30,
    borderRadius: 20, // Bordes más suaves
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 }, // Mayor desplazamiento de la sombra
    shadowOpacity: 0.15,
    shadowRadius: 15, // Mayor radio de sombra
    elevation: 12,
  },
  textDiv: {
    width: "85%", // Más ancho
    marginTop: 30,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 40, // Tamaño de fuente grande
    fontWeight: "700",
    color: "#03A9F4", // Color más vibrante
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    alignItems: "center",
    width: "85%", // Más ancho
    marginTop: 40,
  },
  buttonSignUp: {
    width: "100%",
    paddingVertical: 15, // Mayor padding vertical
    borderRadius: 50,
    borderColor: "#03A9F4", // Color más vibrante
    borderWidth: 2,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E0F7FA", // Color de fondo suave
  },
  buttonTextSignUp: {
    color: "#03A9F4", // Color más vibrante
    fontSize: 20, // Tamaño de fuente más grande
    fontWeight: "700",
  },
  buttonRegister: {
    width: "100%",
    paddingVertical: 15, // Mayor padding vertical
    borderRadius: 50,
    backgroundColor: "#03A9F4", // Color más vibrante
    justifyContent: "center",
    alignItems: "center",
  },
  buttonTextRegister: {
    color: "#FFFFFF",
    fontSize: 20, // Tamaño de fuente más grande
    fontWeight: "700",
  },
});




export default LoginOrRegisterScreen;
