import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Dimensions, Alert, Keyboard } from "react-native";
import { TextInput, Button, RadioButton, Text, ProgressBar, useTheme, Provider as PaperProvider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { ref, set } from "firebase/database";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { auth, db } from '../services/firebase';

const { width, height } = Dimensions.get("window");

const RegisterScreen = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);  

  const navigation = useNavigation();
  const { colors } = useTheme();

  const navigateToLogin = () => {
    navigation.navigate("Login");
  };

  const goBack = () => {
    navigation.goBack();
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength / 4;
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    setPasswordStrength(calculatePasswordStrength(text));
  };

  const validateInputs = () => {
    if (!username || !email || !password || !confirmPassword) {
      setError("Todos los campos son obligatorios.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("El correo electrónico no es válido.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      setError("La contraseña debe contener al menos una letra mayúscula.");
      return false;
    }
    if (!terms) {
      setError("Debe aceptar los términos y condiciones.");
      return false;
    }
    return true;
  };

  const handleAuthError = (error) => {
    const errorMessages = {
      "auth/email-already-in-use": "Este correo ya está registrado.",
      "auth/invalid-email": "El correo electrónico no es válido.",
      "auth/operation-not-allowed": "Operación no permitida.",
      "auth/weak-password": "La contraseña es demasiado débil.",
      default: "Ha ocurrido un error. Inténtelo de nuevo.",
    };
    return errorMessages[error.code] || errorMessages.default;
  };

  async function registerUser() {
    setError("");

    if (!validateInputs()) {
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await set(ref(db, 'users/' + user.uid), {
        username: username,
        email: email,
        uid: user.uid
      });

      await sendEmailVerification(user);

      Alert.alert(
        "Verificación de Correo",
        "Te hemos enviado un correo para verificar tu dirección de correo electrónico. Por favor, verifica tu correo antes de iniciar sesión.",
        [{ text: "OK", onPress: () => {
          setUsername("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          navigation.navigate('Happy');
        }}]
      );

    } catch (error) {
      setError(handleAuthError(error));
    }
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <MaterialIcons name="arrow-back" size={24} color="#03A9F4" />
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
              onChangeText={handlePasswordChange}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => {
                setIsPasswordFocused(false);
                Keyboard.dismiss();
              }}
              style={styles.input}
              theme={{ colors: { primary: colors.accent, underlineColor: 'transparent' } }}
              placeholderTextColor="#999"
            />
          </View>

          {isPasswordFocused && password.length > 0 && (
            <View style={styles.passwordStrengthContainer}>
              <ProgressBar
                progress={passwordStrength}
                color={colors.accent}
                style={styles.progressBar}
              />
              <Text style={styles.passwordStrengthText}>
                {passwordStrength === 1 ? "Contraseña Fuerte" : passwordStrength >= 0.5 ? "Contraseña Media" : "Contraseña Débil"}
              </Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <FontAwesome5 name="lock" size={20} color="#666" style={styles.icon} />
            <TextInput
              label="Confirmar Contraseña"
              value={confirmPassword}
              mode="flat"
              secureTextEntry
              onChangeText={(text) => setConfirmPassword(text)}
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
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: "5%",
  },
  backButton: {
    position: "absolute",
    top: "5%",
    left: "5%",
    zIndex: 1,
  },
  form: {
    width: "100%",
    maxWidth: 400,
    paddingVertical: "5%",
    paddingHorizontal: "7%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 10,
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    marginBottom: "4%",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: "3%",
    elevation: 3,
    width: "100%",
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
  passwordStrengthContainer: {
    width: '100%',
    marginTop: height * 0.01,
    marginBottom: height * 0.015,
  },
  buttonRegister: {
    marginTop: "5%",
    borderRadius: 30,
    backgroundColor: "#03A9F4",
    justifyContent: "center",
    alignItems: "center",
    height: height * 0.07,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
    width: "100%",
  },
  headerText: {
    fontSize: width * 0.1,
    fontWeight: "bold",
    color: "#03A9F4",
    marginBottom: "5%",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  titleText: {
    fontSize: width * 0.07,
    fontWeight: "700",
    color: "#343A40",
    marginBottom: "7%",
    textAlign: "center",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: "5%",
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
    marginTop: "7%",
  },
  linkText: {
    color: "#03A9F4",
    fontWeight: "bold",
    marginLeft: 5,
  },
  passwordStrengthText: {
    textAlign: "center",
    fontSize: width * 0.04,
    color: "#666",
  },
  progressBar: {
    height: 5,
    borderRadius: 5,
  }
});

export default RegisterScreen;
