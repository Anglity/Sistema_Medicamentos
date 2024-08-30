import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Dimensions, Alert, Image, Text } from "react-native";
import { TextInput, Provider as PaperProvider, Portal, Modal, Button } from "react-native-paper";
import { FontAwesome5, MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker'; 
import { db, auth } from '../services/firebase'; 
import { ref, onValue, update, push, set } from "firebase/database"; 
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from 'date-fns';

const { width, height } = Dimensions.get("window");
const defaultPhoto = require('../../assets/profile.png');

const ProfileScreen = ({ navigation }) => {
  const [photo, setPhoto] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
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
        }, (error) => {
          Alert.alert("Error", "No se pudo obtener la información del usuario.");
          console.error(error);
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
        }, (error) => {
          Alert.alert("Error", "No se pudo obtener los datos adicionales.");
          console.error(error);
        });
      } else {
        Alert.alert("Usuario no identificado", "Por favor, inicie sesión para ver la información del perfil.");
      }
    };

    fetchUserData();
  }, []);

  const selectPhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permiso denegado", "No se ha permitido a la aplicación acceder a sus fotos.");
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
    } catch (error) {
      Alert.alert("Error", "No se pudo seleccionar la foto.");
      console.error(error);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
  };

  const handleConfirm = (selectedDate) => {
    const formattedDate = format(selectedDate, 'dd/MM/yyyy');
    setDob(formattedDate);
    setDatePickerVisibility(false);
  };

  const saveProfile = async () => {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const userRef = ref(db, `users/${userId}`);
      try {
        await update(userRef, { username });

        if (dataId) {
          const dataRef = ref(db, `datos/${dataId}`);
          await update(dataRef, { gender, dob, photo, userId });
          Alert.alert("Perfil guardado", "La información de su perfil ha sido actualizada.");
        } else {
          const newDataRef = push(ref(db, `datos`));
          await set(newDataRef, { username, email, password, gender, dob, photo, userId });
          Alert.alert("Perfil guardado", "La información de su perfil ha sido guardada.");
        }
      } catch (error) {
        Alert.alert("Error", "Hubo un error al guardar su perfil.");
        console.error(error);
      }
    } else {
      Alert.alert("Usuario no identificado", "Por favor, inicie sesión para guardar la información del perfil.");
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      Alert.alert("Cierre de sesión", "Ha cerrado sesión exitosamente.");
      navigation.replace('Login'); // Navigate to Login screen after sign out
    } catch (error) {
      Alert.alert("Error", "Hubo un error al cerrar la sesión.");
      console.error(error);
    }
  };

  const openGenderModal = () => {
    setShowGenderModal(true);
  };

  const selectGender = (selectedGender) => {
    setGender(selectedGender);
    setShowGenderModal(false);
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
                source={photo ? { uri: photo } : defaultPhoto}
                style={styles.avatar} 
              />
              <View style={styles.cameraIcon}>
                <MaterialIcons name="photo-camera" size={22} color="#fff" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={removePhoto} style={styles.removePhotoButton}>
              <Text style={styles.removePhotoText}>Eliminar Foto</Text>
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
                    placeholder="Ingrese su nombre de usuario"
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
                    editable={false} // Email field is not editable
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="Ingrese su correo electrónico"
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
                    editable={false} // Password field is not editable
                    secureTextEntry
                    placeholder="Ingrese su contraseña"
                    placeholderTextColor="#999"
                    underlineColor="transparent"
                    theme={{ colors: { primary: '#00ACC1' }}}
                  />
                </View>
              </View>

              <View style={styles.formElement}>
                <Text style={styles.labelText}>Género</Text>
                <View style={[styles.inputContainer, styles.largerInputContainer]}>
                  <Ionicons name="md-transgender-outline" size={18} color="#00ACC1" style={styles.icon} />
                  <TouchableOpacity onPress={openGenderModal} style={{flex: 1}}>
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
                </View>
              </View>

              <View style={styles.formElement}>
                <Text style={styles.labelText}>Fecha de Nacimiento</Text>
                <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={styles.inputContainer}>
                  <Ionicons name="calendar-outline" size={18} color="#00ACC1" style={styles.icon} />
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

                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  display="spinner"
                  onConfirm={handleConfirm}
                  onCancel={() => setDatePickerVisibility(false)}
                  maximumDate={new Date()}
                  headerTextIOS="Elige tu fecha de nacimiento"
                  confirmTextIOS="Confirmar"
                  cancelTextIOS="Cancelar"
                  customStyles={{
                    datePicker: {
                      backgroundColor: 'white',
                      borderRadius: 10,
                    },
                    header: {
                      backgroundColor: '#00ACC1',
                    },
                    headerTitle: {
                      color: 'white',
                      fontWeight: 'bold',
                    },
                  }}
                />
              </View>

              <TouchableOpacity style={styles.buttonSave} onPress={saveProfile}>
                <MaterialIcons name="save" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.buttonSignOut} onPress={signOut}>
                <MaterialIcons name="logout" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Salir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <Portal>
          <Modal visible={showGenderModal} onDismiss={() => setShowGenderModal(false)} contentContainerStyle={styles.modalContainer}>
            <View style={{ padding: 15 }}>
              <Text style={styles.labelText}>Seleccione su género</Text>
              <Button onPress={() => selectGender('Masculino')}>Masculino</Button>
              <Button onPress={() => selectGender('Femenino')}>Femenino</Button>
              <Button onPress={() => selectGender('Otro')}>Otro</Button>
            </View>
          </Modal>
        </Portal>

      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 4, 
    },
    gradient: {
      flex: 1,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: '3%',
    },
    innerContainer: {
      width: "95%", 
      maxWidth: 400, 
      alignItems: "center",
      paddingVertical: '3%', 
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      borderRadius: 15,
      paddingHorizontal: '3%',  
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
    backButton: {
      position: "absolute",
      top: '3%', 
      left: '3%', 
      zIndex: 1,
      backgroundColor: '#00ACC1',
      padding: 8,  
      borderRadius: 25,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    avatarContainer: {
      marginBottom: '3%',  
      alignItems: 'center',
    },
    avatar: {
      width: width * 0.28,  
      height: width * 0.28,
      borderRadius: (width * 0.28) / 2,
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
      borderRadius: 12,
      padding: 4, 
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    removePhotoButton: {
      marginTop: 6,  
      paddingHorizontal: 12,
      paddingVertical: 5,
      backgroundColor: '#d9534f',
      borderRadius: 5,
    },
    removePhotoText: {
      color: '#fff',
      fontSize: width * 0.033, 
      fontWeight: 'bold',
    },
    form: {
      width: "100%",
      padding: '3%',  
    },
    formElement: {
      marginBottom: '2%',  
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 10,  
      backgroundColor: "#F1F1F1",
      paddingHorizontal: '3%',  
      elevation: 1,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      width: "100%",
    },
    largerInputContainer: {
      paddingHorizontal: '3%',  
      height: height * 0.045,  
    },
    input: {
      flex: 1,
      height: height * 0.04,  
      backgroundColor: "transparent",
      fontSize: width * 0.033,  
      color: "#333",
      paddingLeft: 5,  
    },
    icon: {
      marginRight: '3%',
    },
    modalContainer: {
      backgroundColor: 'white',
      padding: 12,  
      margin: 12,  
      borderRadius: 10,
    },
    buttonSave: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: '2%',  
      width: "100%",
      height: height * 0.055,  
      borderRadius: 30,  
      justifyContent: "center",
      backgroundColor: "#00BFA6",  
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },  
      shadowOpacity: 0.3,  
      shadowRadius: 10,  
      elevation: 5,  
    },
    buttonSignOut: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: '3%',  
      width: "100%",
      height: height * 0.055,  
      borderRadius: 30,  
      justifyContent: "center",
      backgroundColor: "#FF5A5F",  
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },  
      shadowOpacity: 0.3,  
      shadowRadius: 10,  
      elevation: 5,  
    },
    buttonText: {
      color: "#FFFFFF",  
      fontSize: width * 0.045,  
      fontWeight: "700",  
      textTransform: "uppercase",  
      letterSpacing: 1,  
    },
    buttonIcon: {
      marginRight: 10,  
      color: "#FFFFFF",  
    },
    pageTitleText: {
      fontSize: width * 0.065,  
      fontWeight: "700",
      color: "#00ACC1",
      marginBottom: '3%',
      textAlign: "center",
    },
    labelText: {
      fontSize: width * 0.038,  
      fontWeight: "700",
      color: "#333",
      marginBottom: '2%',
    },
});

export default ProfileScreen;
