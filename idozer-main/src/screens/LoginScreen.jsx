import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Dimensions, Alert } from "react-native";
import { TextInput, RadioButton, Provider as PaperProvider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { FontAwesome5, Feather, MaterialIcons } from '@expo/vector-icons';
import { Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState("");

  const navigation = useNavigation();
  const auth = getAuth();

  // Manejar el cambio en los inputs
  const handleInputChange = (setter) => (value) => setter(value);

  // Manejar el login del usuario
  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      showAlert("Campos requeridos", "Por favor, completa todos los campos.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;

      if (user.emailVerified) {
        // Almacenar el tiempo de inicio de sesión en AsyncStorage
        const currentTime = new Date().getTime();
        await AsyncStorage.setItem('lastLoginTime', currentTime.toString());

        resetFields();
        navigation.navigate("Home"); // Redirigir a la pantalla principal
      } else {
        showAlert("Correo No Verificado", "Revisa tu correo para verificar tu cuenta.");
        auth.signOut(); // Cerrar sesión si el correo no está verificado
      }
    } catch (error) {
      handleAuthError(error);
    }
  };

  // Función para manejar el restablecimiento de contraseña
  const resetPassword = async () => {
    if (!email) {
      showAlert("Correo requerido", "Por favor, ingresa tu correo para restablecer la contraseña.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      showAlert("Correo enviado", "Revisa tu correo para restablecer la contraseña.");
    } catch (error) {
      handleAuthError(error);
    }
  };

  // Manejo de errores de autenticación
  const handleAuthError = (error) => {
    const errorMessages = {
      "auth/invalid-email": "El correo electrónico ingresado no es válido.",
      "auth/user-disabled": "Esta cuenta ha sido deshabilitada.",
      "auth/user-not-found": "No se encontró ninguna cuenta con este correo.",
      "auth/wrong-password": "La contraseña ingresada es incorrecta.",
      "auth/too-many-requests": "Demasiados intentos fallidos. Intenta más tarde.",
      "auth/network-request-failed": "Error de red. Verifica tu conexión.",
    };
    showAlert("Error de autenticación", errorMessages[error.code] || "Ha ocurrido un error. Inténtalo más tarde.");
  };

  // Mostrar alertas
  const showAlert = (title, message) => {
    Alert.alert(title, message, [{ text: "OK" }]);
  };

  // Limpiar campos después del login
  const resetFields = () => {
    setEmail("");
    setPassword("");
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#05B494" />
        </TouchableOpacity>

        <View style={styles.innerContainer}>
          <Text style={styles.pageTitleText}>Iniciar Sesión</Text>
          <Text style={styles.titleText}>idozer</Text>

          <View style={styles.form}>
            <FormElement
              label="Correo Electrónico"
              value={email}
              placeholder="Tu correo"
              icon={<FontAwesome5 name="envelope" size={20} color="#05B494" />}
              onChangeText={handleInputChange(setEmail)}
            />
            <FormElement
              label="Contraseña"
              value={password}
              placeholder="************"
              icon={<Feather name="lock" size={20} color="#05B494" />}
              secureTextEntry
              onChangeText={handleInputChange(setPassword)}
            />

            <View style={styles.radioContainer}>
              <View style={styles.radioGroup}>
                <RadioButton
                  value="Apple"
                  status={terms ? "checked" : "unchecked"}
                  onPress={() => setTerms(!terms)}
                  color="#05B494"
                />
                <Text style={[styles.radioText, styles.rememberMeText]}>Recordarme</Text>
              </View>
              <TouchableOpacity onPress={resetPassword}>
                <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity style={styles.buttonRegister} onPress={handleLogin}>
              <MaterialIcons name="login" size={24} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Iniciar</Text>
            </TouchableOpacity>

            <View style={styles.row}>
              <Text style={styles.radioText}>¿No tienes una cuenta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.linkText}>Regístrate ahora</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </PaperProvider>
  );
};

// Componente reutilizable para elementos de formulario
const FormElement = ({ label, value, placeholder, icon, secureTextEntry, onChangeText }) => (
  <View style={styles.formElement}>
    <Text style={styles.labelText}>{label}</Text>
    <View style={styles.inputContainer}>
      {icon}
      <TextInput
        style={styles.input}
        value={value}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        placeholderTextColor="#999"
        autoCapitalize="none"
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    width: "90%",
    alignItems: "center",
    paddingVertical: height * 0.03,
  },
  backButton: {
    position: "absolute",
    top: height * 0.05,
    left: width * 0.05,
    zIndex: 1,
  },
  form: {
    width: "100%",
    padding: height * 0.03,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 5,
  },
  formElement: {
    marginBottom: height * 0.02,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: height * 0.02,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: width * 0.03,
    elevation: 2,
  },
  input: {
    flex: 1,
    height: height * 0.07,
    backgroundColor: "transparent",
    fontSize: width * 0.045,
    color: "#333",
    paddingLeft: 10,
  },
  buttonRegister: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.03,
    width: "100%",
    height: height * 0.07,
    borderRadius: height * 0.035,
    justifyContent: "center",
    backgroundColor: "#03A9F4",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: width * 0.05,
    fontWeight: "700",
    marginLeft: 5,
  },
  buttonIcon: {
    marginRight: 10,
  },
  error: {
    color: "red",
    marginBottom: height * 0.015,
    textAlign: "center",
    fontSize: width * 0.04,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: height * 0.01,
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: -10,
  },
  radioText: {
    fontSize: width * 0.04,
    color: "#666",
    marginLeft: -3,
  },
  forgotPasswordText: {
    color: "#03A9F4",
    fontWeight: "bold",
  },
  titleText: {
    fontSize: width * 0.1,
    fontWeight: "700",
    color: "#03A9F4",
    marginBottom: height * 0.02,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  pageTitleText: {
    fontSize: width * 0.07,
    fontWeight: "600",
    color: "#03A9F4",
    marginBottom: height * 0.02,
    textAlign: "center",
  },
  labelText: {
    fontSize: width * 0.045,
    fontWeight: "500",
    color: "#666",
    marginBottom: height * 0.01,
  },
  linkText: {
    color: "#03A9F4",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: height * 0.03,
  },
});

export default LoginScreen;
