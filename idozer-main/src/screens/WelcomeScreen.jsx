import React, { useEffect } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import * as SplashScreen from 'expo-splash-screen';

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
    <LinearGradient colors={['#e0f7fa', '#80deea']} style={styles.container}>
      <View style={styles.card}>
        <Text style={[styles.logoText, { fontFamily: 'Roboto_700Bold' }]}>idozer</Text>
        <View style={styles.imageContainer}>
          <Image source={require("../../assets/kit2.png")} style={styles.image} resizeMode="contain"/>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: '90%',
    padding: 30, // Aumentar padding
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    alignItems: "center",
  },
  logoText: {
    fontSize: 40, // Aumentar tamaño de fuente
    fontWeight: "700",
    color: "#03A9F4",
    marginBottom: 20,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  imageContainer: {
    width: "80%", // Aumentar tamaño
    aspectRatio: 1,
    marginBottom: 30,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textDiv: {
    width: "90%",
    alignItems: "center",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 32, // Aumentar tamaño de fuente
    fontWeight: "700",
    color: "#03A9F4",
    marginBottom: 20,
    textAlign: "center",
  },
  descriptionText: {
    fontSize: 18, // Aumentar tamaño de fuente
    fontWeight: "400",
    color: "#757575",
    textAlign: "center",
    lineHeight: 28, // Aumentar line-height
    paddingHorizontal: 20,
  },
});

export default WelcomeScreen;
