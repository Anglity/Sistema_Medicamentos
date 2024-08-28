import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { Text, Button, Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get("window");

const HappyScreen = () => {
  const navigation = useNavigation();
  const confettiAnimation = useRef(null);
  const punchAnimation = useRef(null);

  useEffect(() => {
    confettiAnimation.current?.play();
    punchAnimation.current?.play();
  }, []);

  const handleContinue = () => {
    navigation.navigate('Login');
  };

  return (
    <Surface style={styles.container}>
      <View style={styles.animationContainer}>
        <LottieView
          ref={confettiAnimation}
          source={require('../../assets/happy.json')}
          autoPlay={false}
          loop={true}
          style={styles.confettiAnimation}
        />
        <LottieView
          ref={punchAnimation}
          source={require('../../assets/happy2.json')}
          autoPlay={false}
          loop={true}
          style={styles.punchAnimation}
        />
      </View>
      <Text style={styles.titleText}>¡Bienvenido!</Text>
      <Text style={styles.subtitleText}>Te has registrado correctamente</Text>
      <Text style={styles.descriptionText}>
        Estamos encantados de tenerte con nosotros
      </Text>
      <Button
        mode="contained"
        onPress={handleContinue}
        style={styles.continueButton}
        labelStyle={styles.buttonText}
        icon="arrow-right"
      >
        CONTINUAR
      </Button>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 30,
    elevation: 4,
  },
  animationContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.9,
    height: height * 0.4,
    marginBottom: 30,
  },
  confettiAnimation: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  punchAnimation: {
    width: '80%',
    height: '80%',
  },
  titleText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#03A9F4', // Color azul del RegisterScreen
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 24,
    color: '#333333',
    marginBottom: 10,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 18,
    color: '#777777',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 30,
  },
  continueButton: {
    backgroundColor: '#03A9F4', // Color azul del RegisterScreen
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 25,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HappyScreen;
