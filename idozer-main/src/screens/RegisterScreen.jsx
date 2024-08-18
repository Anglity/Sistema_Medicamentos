import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Image } from "react-native";
import { TextInput, Button, RadioButton, Text, useTheme, Provider as PaperProvider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../services/firebase';

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
    setError(""); // Limpiar el error anterior, si lo hay

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      navigation.navigate('Login');
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Image //source={require("../../IDOZER/assets/back_arrow.png")} 
          style={styles.backButtonImage} />
        </TouchableOpacity>
        <Text style={styles.headerText}>idozer</Text>

        <View style={styles.form}>
          <Text style={styles.titleText}>Crear Cuenta</Text>

          <TextInput
            label="Nombre de usuario"
            value={username}
            mode="outlined"
            onChangeText={(text) => setUsername(text)}
            style={styles.input}
            theme={{ colors: { primary: colors.accent } }}
          />

          <TextInput
            label="Correo electrónico"
            value={email}
            mode="outlined"
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
            theme={{ colors: { primary: colors.accent } }}
          />

          <TextInput
            label="Contraseña"
            value={password}
            mode="outlined"
            secureTextEntry
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
            theme={{ colors: { primary: colors.accent } }}
          />

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
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
  backButtonImage: {
    width: 30,
    height: 30,
  },
  form: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  input: {
    height: 55,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#DDD",
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
  },
  buttonRegister: {
    marginTop: 25,
    borderRadius: 25,
    backgroundColor: "#05B494",
    justifyContent: "center",
    alignItems: "center",
    height: 55,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  headerText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#05B494",
    marginBottom: 30,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  titleText: {
    fontSize: 26,
    fontWeight: "700",
    color: "#343A40",
    marginBottom: 20,
    textAlign: "center",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  radioText: {
    fontSize: 16,
    color: "#6C757D",
    marginLeft: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  error: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
  },
  linkText: {
    color: "#05B494",
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default RegisterScreen;
