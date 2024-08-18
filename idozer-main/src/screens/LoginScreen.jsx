import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { RadioButton, Provider as PaperProvider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  BoldText,
  BoldTextLink,
  LightText,
  MediumText,
  RegularText,
} from "../components/Text";

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
    navigation.navigate("LoginOrRegister");
  };

  async function loginUser() {
    setError(""); // Limpiar el error anterior, si lo hay

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      navigation.navigate("Home");
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <PaperProvider>
      <View style={{ flex: 1, backgroundColor: "#E8F5E9" }}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={navigateToLoginOrRegister}
        >
          <Image
            //source={require("../../IDOZER/assets/back_arrow.png")}
            style={styles.backImage}
          />
        </TouchableOpacity>
        <View style={styles.container}>
          <Text style={styles.titleText}>idozer</Text>

          <View style={styles.form}>
            <View style={{ marginTop: 20, marginBottom: 20 }}>
              <Text style={styles.subtitleText}>Iniciar Sesión</Text>
            </View>

            <View style={styles.formElement}>
              <Text style={styles.labelText}>Correo Electrónico</Text>
              <TextInput
                style={styles.input}
                value={email}
                placeholder="Tu correo"
                onChangeText={(text) => setEmail(text)}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formElement}>
              <Text style={styles.labelText}>Contraseña</Text>
              <TextInput
                style={styles.input}
                value={password}
                placeholder="************"
                secureTextEntry
                onChangeText={(text) => setPassword(text)}
              />
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
    paddingTop: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
  backImage: {
    width: 30,
    height: 30,
  },
  form: {
    width: 340,
    padding: 30,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  formElement: {
    marginBottom: 20,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    width: "100%",
    height: 50,
    borderRadius: 10,
    backgroundColor: "#F9F9F9",
    fontSize: 16,
    color: "#333",
  },
  buttonRegister: {
    marginTop: 30,
    width: "100%",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#05B494",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  error: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
    fontSize: 14,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: -10,
  },
  radioText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
  forgotPasswordText: {
    color: "#05B494",
    fontWeight: "bold",
  },
  titleText: {
    fontSize: 40,
    fontWeight: "700",
    color: "#05B494",
    marginBottom: 20,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  subtitleText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#05B494",
    marginVertical: 20,
    textAlign: "center",
  },
  labelText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    marginBottom: 8,
  },
  linkText: {
    color: "#05B494",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
});

export default LoginScreen;
