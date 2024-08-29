import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Dimensions, Alert, Image, Text, Platform } from "react-native";
import { TextInput, Provider as PaperProvider, Button, Menu } from "react-native-paper";
import { FontAwesome5, MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker'; 
import { db, auth } from '../services/firebase'; 
import { ref, onValue, update, push } from "firebase/database"; 
import DateTimePicker from '@react-native-community/datetimepicker';

const { width, height } = Dimensions.get("window");

const ProfileScreen = () => {
  const [photo, setPhoto] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderMenu, setShowGenderMenu] = useState(false);
  const [dataId, setDataId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const userRef = ref(db, `users/${userId}`);
        const dataRef = ref(db, `datos`);

        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setUsername(data.username || "");
            setEmail(data.email || "");
            setPassword(data.password || "********");
          }
        });

        onValue(dataRef, (snapshot) => {
          const allData = snapshot.val();
          for (const key in allData) {
            if (allData[key].userId === userId) {
              setGender(allData[key].gender || "");
              setDob(allData[key].dob || "");
              setPhoto(allData[key].photo || null);
              setDataId(key);
              break;
            }
          }
        });
      } else {
        Alert.alert("No User Logged In", "Please log in to view profile information.");
      }
    };

    fetchUserData();
  }, []);

  const selectPhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Denied", "You have declined to allow this app to access your photos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri); 
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDob(new Date(selectedDate).toLocaleDateString());
    }
  };

  const saveProfile = () => {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const userRef = ref(db, `users/${userId}`);
      update(userRef, { username });

      if (dataId) {
        const dataRef = ref(db, `datos/${dataId}`);
        update(dataRef, { gender, dob, photo, userId })
          .then(() => {
            Alert.alert("Profile Saved", "Your profile information has been updated.");
          })
          .catch((error) => {
            Alert.alert("Error", "There was an error saving your profile.");
            console.error(error);
          });
      } else {
        const dataRef = push(ref(db, `datos`));
        set(dataRef, { username, email, password, gender, dob, photo, userId })
          .then(() => {
            Alert.alert("Profile Saved", "Your profile information has been saved.");
          })
          .catch((error) => {
            Alert.alert("Error", "There was an error saving your profile.");
            console.error(error);
          });
      }
    } else {
      Alert.alert("No User Logged In", "Please log in to save profile information.");
    }
  };

  const signOut = () => {
    auth.signOut()
      .then(() => {
        Alert.alert("Signed Out", "You have been signed out.");
      })
      .catch((error) => {
        Alert.alert("Error", "There was an error signing out.");
        console.error(error);
      });
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <LinearGradient colors={['#E0F7FA', '#00ACC1']} style={styles.gradient}>
          <TouchableOpacity style={styles.backButton} onPress={() => console.log('Back pressed')}>
            <Feather name="arrow-left" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.innerContainer}>
            <Text style={styles.pageTitleText}>Mi Perfil</Text>

            <TouchableOpacity onPress={selectPhoto} style={styles.avatarContainer}>
              <Image 
                source={photo ? { uri: photo } : require('../../assets/profile.png')}
                style={styles.avatar} 
              />
              <View style={styles.cameraIcon}>
                <MaterialIcons name="photo-camera" size={22} color="#fff" />
              </View>
            </TouchableOpacity>

            <View style={styles.form}>
              <View style={styles.formElement}>
                <Text style={styles.labelText}>Nombre de Usuario</Text>
                <View style={styles.inputContainer}>
                  <FontAwesome5 name="user" size={18} color="#00ACC1" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    placeholderTextColor="#999"
                    underlineColor="transparent"
                    theme={{ colors: { primary: '#00ACC1' }}}
                  />
                </View>
              </View>

              <View style={styles.formElement}>
                <Text style={styles.labelText}>Correo Electrónico</Text>
                <View style={styles.inputContainer}>
                  <FontAwesome5 name="envelope" size={18} color="#00ACC1" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    placeholderTextColor="#999"
                    underlineColor="transparent"
                    theme={{ colors: { primary: '#00ACC1' }}}
                  />
                </View>
              </View>

              <View style={styles.formElement}>
                <Text style={styles.labelText}>Contraseña</Text>
                <View style={styles.inputContainer}>
                  <Feather name="lock" size={18} color="#00ACC1" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="#999"
                    underlineColor="transparent"
                    theme={{ colors: { primary: '#00ACC1' }}}
                  />
                </View>
              </View>

              <View style={styles.formElement}>
                <Text style={styles.labelText}>Género</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="md-transgender-outline" size={18} color="#00ACC1" style={styles.icon} />
                  <TouchableOpacity onPress={() => setShowGenderMenu(true)} style={{flex: 1}}>
                    <TextInput
                      style={styles.input}
                      value={gender}
                      editable={false}
                      placeholder="Seleccione su género"
                      placeholderTextColor="#999"
                      underlineColor="transparent"
                      theme={{ colors: { primary: '#00ACC1' }}}
                    />
                  </TouchableOpacity>
                  <Menu
                    visible={showGenderMenu}
                    onDismiss={() => setShowGenderMenu(false)}
                    anchor={
                      <TouchableOpacity onPress={() => setShowGenderMenu(true)}>
                        <Ionicons name="chevron-down" size={24} color="#00ACC1" />
                      </TouchableOpacity>
                    }
                  >
                    <Menu.Item onPress={() => { setGender('Masculino'); setShowGenderMenu(false); }} title="Masculino" />
                    <Menu.Item onPress={() => { setGender('Femenino'); setShowGenderMenu(false); }} title="Femenino" />
                    <Menu.Item onPress={() => { setGender('Otro'); setShowGenderMenu(false); }} title="Otro" />
                  </Menu>
                </View>
              </View>

              <View style={styles.formElement}>
                <Text style={styles.labelText}>Fecha de Nacimiento</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="calendar-outline" size={18} color="#00ACC1" style={styles.icon} />
                  <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{flex: 1}}>
                    <TextInput
                      style={styles.input}
                      value={dob}
                      editable={false}
                      placeholder="Seleccione su fecha de nacimiento"
                      placeholderTextColor="#999"
                      underlineColor="transparent"
                      theme={{ colors: { primary: '#00ACC1' }}}
                    />
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={new Date()}
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                    />
                  )}
                </View>
              </View>

              <TouchableOpacity style={styles.buttonSave} onPress={saveProfile}>
                <MaterialIcons name="save" size={22} color="#FFFFFF" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.buttonSignOut} onPress={signOut}>
                <MaterialIcons name="logout" size={22} color="#FFFFFF" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Salir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 8,  // Reducido para un diseño más compacto
    },
    gradient: {
      flex: 1,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: '3%',
    },
    innerContainer: {
      width: "100%",
      maxWidth: 420,  // Más estrecho para un diseño más pegado
      alignItems: "center",
      paddingVertical: '4%',  // Reducido para compactar el diseño
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      borderRadius: 15,
      paddingHorizontal: '4%',  // Reducido para un diseño más compacto
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
    backButton: {
      position: "absolute",
      top: '5%',
      left: '5%',
      zIndex: 1,
      backgroundColor: '#00ACC1',
      padding: 10,  // Reducido para un diseño más compacto
      borderRadius: 25,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    avatarContainer: {
      marginBottom: '4%',
      alignItems: 'center',
    },
    avatar: {
      width: width * 0.2,  // Reducido para un diseño más compacto
      height: width * 0.2,
      borderRadius: (width * 0.2) / 2,
      backgroundColor: '#E0E7ED',
      borderWidth: 2,
      borderColor: '#00ACC1',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 6,
    },
    cameraIcon: {
      position: 'absolute',
      bottom: 5,
      right: 5,
      backgroundColor: '#00ACC1',
      borderRadius: 15,
      padding: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    form: {
      width: "100%",
      padding: '3%',
    },
    formElement: {
      marginBottom: '3%',  // Reducido para compactar el diseño
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 10,  // Reducido para un diseño más compacto
      backgroundColor: "#F1F1F1",
      paddingHorizontal: '3%',  // Reducido para un diseño más compacto
      elevation: 1,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      width: "100%",
    },
    input: {
      flex: 1,
      height: height * 0.05,  // Reducido para un diseño más compacto
      backgroundColor: "transparent",
      fontSize: width * 0.04,  // Reducido para un diseño más compacto
      color: "#333",
      paddingLeft: 6,  // Reducido para un diseño más compacto
    },
    icon: {
      marginRight: '3%',
    },
    buttonSave: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: '4%',  // Reducido para un diseño más compacto
      width: "100%",
      height: height * 0.06,  // Reducido para un diseño más compacto
      borderRadius: 20,
      justifyContent: "center",
      backgroundColor: "#00ACC1",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 6,
    },
    buttonSignOut: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: '3%',  // Reducido para un diseño más compacto
      width: "100%",
      height: height * 0.06,  // Reducido para un diseño más compacto
      borderRadius: 20,
      justifyContent: "center",
      backgroundColor: "#d9534f",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 6,
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: width * 0.04,  // Reducido para un diseño más compacto
      fontWeight: "700",
      marginLeft: 5,
    },
    buttonIcon: {
      marginRight: 6,  // Reducido para un diseño más compacto
    },
    pageTitleText: {
      fontSize: width * 0.07,  // Reducido para un diseño más compacto
      fontWeight: "700",
      color: "#00ACC1",
      marginBottom: '4%',
      textAlign: "center",
    },
    labelText: {
      fontSize: width * 0.04,  // Reducido para un diseño más compacto
      fontWeight: "700",
      color: "#333",
      marginBottom: '2%',
    },
  });  
export default ProfileScreen;
