import React, { useEffect } from "react";
import { StyleSheet, View, Dimensions, Text } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import * as SplashScreen from 'expo-splash-screen';
import LottieView from 'lottie-react-native';

SplashScreen.preventAutoHideAsync();

const WelcomeScreen = () => {
  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <LinearGradient colors={['#1c92d2', '#f2fcfe']} style={styles.container}>
      <View style={styles.card}>
        <Text style={[styles.logoText, { fontFamily: 'Roboto_700Bold' }]}>idozer</Text>
        <View style={styles.imageContainer}>
          <View style={styles.imageBorder}>
            <LottieView
              source={require("../../assets/welcome.json")}
              autoPlay
              loop
              style={styles.lottie}
            />
          </View>
        </View>
        <View style={styles.textDiv}>
          <Text style={[styles.welcomeText, { fontFamily: 'Roboto_700Bold' }]}>¡Bienvenido!</Text>
          <Text style={[styles.descriptionText, { fontFamily: 'Roboto_400Regular' }]}>
            ¡Sea muy bienvenido a nuestra aplicación! Estamos aquí para ayudarlo a mantenerse organizado y garantizar que tome sus medicamentos correctamente.
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: '90%',
    padding: width * 0.08,
    borderRadius: 30,
    backgroundColor: '#ffffff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 15,
    alignItems: "center",
  },
  logoText: {
    fontSize: width * 0.1,
    fontWeight: "700",
    color: "#1c92d2",
    marginBottom: width * 0.05,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 6,
  },
  imageContainer: {
    width: "80%",
    marginBottom: width * 0.08,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBorder: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: width * 0.5,
    borderWidth: 5,
    borderColor: 'linear-gradient(135deg, #1c92d2, #f2fcfe)', // Degradado en el borde
    overflow: 'hidden',
    backgroundColor: '#ffffff', // Fondo blanco para un contraste limpio
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 18,
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
  textDiv: {
    width: "90%",
    alignItems: "center",
    marginBottom: width * 0.05,
  },
  welcomeText: {
    fontSize: width * 0.08,
    fontWeight: "700",
    color: "#1c92d2", // Color acorde al esquema del fondo
    marginBottom: width * 0.05,
    textAlign: "center",
    letterSpacing: 3,
  },
  descriptionText: {
    fontSize: width * 0.045,
    fontWeight: "400",
    color: "#34495e", // Un gris oscuro para legibilidad
    textAlign: "center",
    lineHeight: width * 0.07,
    paddingHorizontal: width * 0.05,
  },
});

export default WelcomeScreen;
