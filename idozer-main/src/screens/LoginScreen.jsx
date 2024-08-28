import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Dimensions } from "react-native";
import { TextInput, RadioButton, Provider as PaperProvider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FontAwesome5, MaterialIcons, Feather } from '@expo/vector-icons';
import { Text } from 'react-native';

const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState("");

  const navigation = useNavigation();

  const navigateToRegister = () => {
    navigation.navigate("Register");
  };

  const navigateToLoginOrRegister = () => {
    navigation.navigate("LoginOrRegisterScreen");
  };

  async function loginUser() {
    setError("");

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      navigation.navigate("Home");
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={navigateToLoginOrRegister}
        >
          <Feather name="arrow-left" size={24} color="#05B494" />
        </TouchableOpacity>
        <View style={styles.innerContainer}>

          {/* Título agregado */}
          <Text style={styles.pageTitleText}>Registrase</Text> 
          
          <Text style={styles.titleText}>idozer</Text>

          <View style={styles.form}>
            <View style={styles.formElement}>
              <Text style={styles.labelText}>Correo Electrónico</Text>
              <View style={styles.inputContainer}>
                <FontAwesome5 name="envelope" size={20} color="#05B494" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  value={email}
                  placeholder="Tu correo"
                  onChangeText={(text) => setEmail(text)}
                  autoCapitalize="none"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.formElement}>
              <Text style={styles.labelText}>Contraseña</Text>
              <View style={styles.inputContainer}>
                <Feather name="lock" size={20} color="#05B494" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  value={password}
                  placeholder="************"
                  secureTextEntry
                  onChangeText={(text) => setPassword(text)}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.radioContainer}>
              <View style={styles.radioGroup}>
                <RadioButton
                  value="Apple"
                  status={terms ? "checked" : "unchecked"}
                  onPress={() => setTerms(!terms)}
                  color="#05B494"
                />
                <Text style={[styles.radioText, styles.rememberMeText]}>
                  Recordarme
                </Text>
              </View>
              <TouchableOpacity onPress={() => console.log("Forgot Password")}>
                <Text style={styles.forgotPasswordText}>
                  ¿Olvidaste tu contraseña?
                </Text>
              </TouchableOpacity>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity style={styles.buttonRegister} onPress={loginUser}>
              <MaterialIcons name="login" size={24} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Iniciar</Text>
            </TouchableOpacity>

            <View style={styles.row}>
              <Text style={styles.radioText}>¿No tienes una cuenta? </Text>
              <TouchableOpacity onPress={navigateToRegister}>
                <Text style={styles.linkText}>Regístrate ahora</Text>
              </TouchableOpacity>
            </View>
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
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: height * 0.05,
  },
  backButton: {
    position: "absolute",
    top: height * 0.05,
    left: width * 0.05,
    zIndex: 1,
  },
  form: {
    width: width * 0.85,
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
  icon: {
    marginRight: width * 0.03,
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
    marginLeft: 5,
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
