import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Dimensions, Alert } from "react-native";
import { TextInput, Button, RadioButton, Text, useTheme, Provider as PaperProvider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { auth } from '../services/firebase';

const { width, height } = Dimensions.get("window");

const RegisterScreen = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState("");

  const navigation = useNavigation();
  const { colors } = useTheme();

  const navigateToLogin = () => {
    navigation.navigate("Login");
  };

  const goBack = () => {
    navigation.goBack();
  };

  async function registerUser() {
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Enviar correo de verificación
      await sendEmailVerification(user);

      // Mostrar mensaje de éxito
      Alert.alert(
        "Verificación de Correo",
        "Te hemos enviado un correo para verificar tu dirección de correo electrónico. Por favor, verifica tu correo antes de iniciar sesión.",
        [{ text: "OK", onPress: () => navigation.navigate('Login') }]
      );

    } catch (error) {
      setError(error.message);
    }
  }

  async function loginUser() {
    setError("");

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user.emailVerified) {
        navigation.navigate("Home");
      } else {
        Alert.alert(
          "Correo No Verificado",
          "Tu correo electrónico no ha sido verificado. Por favor, revisa tu bandeja de entrada y sigue las instrucciones para verificar tu correo.",
          [{ text: "OK" }]
        );
        auth.signOut();
      }
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <MaterialIcons name="arrow-back" size={24} color="#05B494" />
        </TouchableOpacity>

        <Text style={styles.headerText}>idozer</Text>

        <View style={styles.form}>
          <Text style={styles.titleText}>Crear Cuenta</Text>

          <View style={styles.inputContainer}>
            <FontAwesome5 name="user" size={20} color="#666" style={styles.icon} />
            <TextInput
              label="Nombre de usuario"
              value={username}
              mode="flat"
              onChangeText={(text) => setUsername(text)}
              style={styles.input}
              theme={{ colors: { primary: colors.accent, underlineColor: 'transparent' } }}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesome5 name="envelope" size={20} color="#666" style={styles.icon} />
            <TextInput
              label="Correo electrónico"
              value={email}
              mode="flat"
              onChangeText={(text) => setEmail(text)}
              style={styles.input}
              theme={{ colors: { primary: colors.accent, underlineColor: 'transparent' } }}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesome5 name="lock" size={20} color="#666" style={styles.icon} />
            <TextInput
              label="Contraseña"
              value={password}
              mode="flat"
              secureTextEntry
              onChangeText={(text) => setPassword(text)}
              style={styles.input}
              theme={{ colors: { primary: colors.accent, underlineColor: 'transparent' } }}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.radioContainer}>
            <RadioButton
              value="terms"
              status={terms ? "checked" : "unchecked"}
              onPress={() => setTerms(!terms)}
              color={colors.accent}
            />
            <Text style={styles.radioText}>Acepto los términos</Text>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button
            mode="contained"
            onPress={registerUser}
            style={styles.buttonRegister}
            contentStyle={{ height: 50 }}
            labelStyle={styles.buttonText}
            icon="account-plus"
          >
            Registrarse
          </Button>

          <View style={styles.row}>
            <Text style={styles.radioText}>¿Ya tienes una cuenta?</Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.linkText}> Iniciar sesión</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: "#F0F4F8",
    paddingHorizontal: width * 0.05,
  },
  backButton: {
    position: "absolute",
    top: height * 0.05,
    left: width * 0.05,
    zIndex: 1,
  },
  form: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: height * 0.04,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    marginBottom: height * 0.02,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: width * 0.03,
    elevation: 3,
  },
  input: {
    flex: 1,
    height: height * 0.07,
    backgroundColor: "transparent",
    fontSize: width * 0.045,
    color: "#333",
    paddingLeft: 10,
  },
  icon: {
    marginRight: width * 0.03,
  },
  buttonRegister: {
    marginTop: height * 0.03,
    borderRadius: 30,
    backgroundColor: "#05B494",
    justifyContent: "center",
    alignItems: "center",
    height: height * 0.07,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  headerText: {
    fontSize: width * 0.1,
    fontWeight: "bold",
    color: "#05B494",
    marginBottom: height * 0.04,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  titleText: {
    fontSize: width * 0.07,
    fontWeight: "700",
    color: "#343A40",
    marginBottom: height * 0.03,
    textAlign: "center",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: height * 0.02,
  },
  radioText: {
    fontSize: width * 0.045,
    color: "#6C757D",
    marginLeft: 5,
  },
  buttonText: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  error: {
    color: "red",
    marginBottom: height * 0.02,
    textAlign: "center",
    fontSize: width * 0.04,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: height * 0.03,
  },
  linkText: {
    color: "#05B494",
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default RegisterScreen;
