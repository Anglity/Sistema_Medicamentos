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

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: '85%',
    padding: height * 0.04,  // Basado en la altura de la pantalla para mantener proporción
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
    fontSize: height * 0.05,  // Escala de fuente basada en la altura
    fontWeight: "700",
    color: "#1c92d2",
    marginBottom: height * 0.02,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 6,
  },
  imageContainer: {
    width: "100%",
    marginBottom: height * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBorder: {
    width: height * 0.25,  // Proporcional al alto de la pantalla
    aspectRatio: 1,
    borderRadius: height * 0.125,  // Radio proporcional
    borderWidth: 5,
    borderColor: '#1c92d2',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
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
    width: "100%",
    alignItems: "center",
    marginBottom: height * 0.03,
  },
  welcomeText: {
    fontSize: height * 0.04,  // Escala de fuente basada en la altura
    fontWeight: "700",
    color: "#1c92d2",
    marginBottom: height * 0.02,
    textAlign: "center",
    letterSpacing: 3,
  },
  descriptionText: {
    fontSize: height * 0.025,  // Escala de fuente basada en la altura
    fontWeight: "400",
    color: "#34495e",
    textAlign: "center",
    lineHeight: height * 0.035,  // Espaciado entre líneas
    paddingHorizontal: width * 0.05,
  },
});

export default WelcomeScreen;
