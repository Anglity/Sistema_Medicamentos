import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Dimensions } from "react-native";
import { BoldText, RegularText } from "../components/Text";
import { useNavigation } from "@react-navigation/native";
import SelectDropdown from "react-native-select-dropdown";
import { Icon } from "react-native-elements";
import { Button, TextInput, TouchableRipple, useTheme, Snackbar, Switch, ActivityIndicator } from 'react-native-paper';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import uuid from "react-native-uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAlarm } from 'react-native-simple-alarm';
import moment from 'moment';
import 'moment/locale/es';
import { ref, set, update } from 'firebase/database';
import { db } from '../services/firebase';

moment.locale('es');

const { width, height } = Dimensions.get('window');
const scale = (size) => (width / 375) * size;

const tiposMedicamentos = ["Comprimido", "Cápsula"];
const intervalosRepeticion = [
  "15 min", "30 min", "45 min", "1 hora", "2 horas", "3 horas", "4 horas", "6 horas", "8 horas", "12 horas", "24 horas"
];

const NuevoRecordatorio = () => {
  const theme = useTheme();
  const [nombreMedicamento, setNombreMedicamento] = useState("");
  const [tipoMedicamento, setTipoMedicamento] = useState(null);
  const [dosaje, setDosaje] = useState("");
  const [hora, setHora] = useState("");
  const [fecha, setFecha] = useState(new Date());
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarError, setSnackbarError] = useState(false);
  const [cantidadMedicamentos, setCantidadMedicamentos] = useState("");
  const [horaSegundoMedicamento, setHoraSegundoMedicamento] = useState("");
  const [cantidadSegundoMedicamento, setCantidadSegundoMedicamento] = useState("");
  const [repetirRecordatorio, setRepetirRecordatorio] = useState(false);
  const [intervaloRepeticion, setIntervaloRepeticion] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const validarCampos = () => {
    if (!nombreMedicamento || !tipoMedicamento || !dosaje || !hora || !cantidadMedicamentos) {
      showError("Por favor, completa todos los campos obligatorios.");
      return false;
    }
    return true;
  };

  const crearNuevaAlarma = async (recordatorioId) => {
    try {
      await createAlarm({
        active: true,
        date: moment(fecha).format(),
        message: 'Recordatorio de medicamento',
        snooze: 1,
      });

      if (repetirRecordatorio && intervaloRepeticion) {
        programarRepeticion(recordatorioId);
      }
    } catch (e) {
      console.log(e);
      showError("Error al crear la alarma");
    }
  };

  const programarRepeticiones = async (recordatorio) => {
    const intervalMapping = {
      "15 min": 15,
      "30 min": 30,
      "45 min": 45,
      "1 hora": 60,
      "2 horas": 120,
      "3 horas": 180,
      "4 horas": 240,
      "6 horas": 360,
      "8 horas": 480,
      "12 horas": 720,
      "24 horas": 1440,
    };
  
    const repeticiones = [];
    let nuevaFecha = moment(recordatorio.fecha).add(intervalMapping[recordatorio.intervaloRepeticion], 'minutes');
    
    const MAX_REPETITIONS = 10; 
  
    for (let i = 0; i < MAX_REPETITIONS; i++) {
      repeticiones.push({
        id: uuid.v4(),
        hora: nuevaFecha.format('HH:mm'),
        fecha: nuevaFecha.format('YYYY-MM-DD'),
        repetir: true,
        intervaloRepeticion: recordatorio.intervaloRepeticion,
        ...recordatorio
      });
      nuevaFecha = nuevaFecha.add(intervalMapping[recordatorio.intervaloRepeticion], 'minutes');
    }
  
    try {
      const recordatorioRef = ref(db, `recordatorios/${recordatorio.id}`);
      await set(recordatorioRef, { ...recordatorio, repeticiones });
      console.log("Repeticiones programadas en Firebase");
    } catch (error) {
      console.error("Error al programar las repeticiones: ", error);
      showError("Error al programar las repeticiones");
    }
  };

  const guardarRecordatorio = async (recordatorio) => {
    try {
      const recordatorioRef = ref(db, `recordatorios/${recordatorio.id}`);
      await set(recordatorioRef, recordatorio);
      console.log("¡Recordatorio guardado en Firebase!");
    } catch (error) {
      console.error("Error al guardar el recordatorio en Firebase: ", error);
      showError("Error al guardar el recordatorio en Firebase");
    }
  };

  const crearRecordatorio = async () => {
    if (!validarCampos()) return;
  
    const nuevoRecordatorio = {
      id: uuid.v4(),
      iconStatus: "clock-outline",
      titulo: nombreMedicamento,
      dosagem: dosaje,
      horario: hora,
      fecha: moment(fecha).format('dddd, D [de] MMMM [de] YYYY'),
      iconAction: tipoMedicamento,
      cantidadMedicamentos,
      horaSegundoMedicamento: cantidadMedicamentos > 1 ? horaSegundoMedicamento : null,
      cantidadSegundoMedicamento: cantidadMedicamentos > 1 ? cantidadSegundoMedicamento : null,
      repetir: repetirRecordatorio,
      intervaloRepeticion: repetirRecordatorio ? intervaloRepeticion : null,
    };
  
    setLoading(true);
  
    try {
      const obtenerRecordatorio = await AsyncStorage.getItem("lembretes");
      const lembretesJson = obtenerRecordatorio ? JSON.parse(obtenerRecordatorio) : [];
      lembretesJson.push(nuevoRecordatorio);
      await AsyncStorage.setItem("lembretes", JSON.stringify(lembretesJson));
  
      await guardarRecordatorio(nuevoRecordatorio);
  
      if (repetirRecordatorio && intervaloRepeticion) {
        await programarRepeticiones(nuevoRecordatorio); 
      } else {
        await crearNuevaAlarma(nuevoRecordatorio.id); 
      }
  
      showMessage("¡Nuevo recordatorio guardado exitosamente!");
      resetearPagina();
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error al crear el recordatorio: ", error);
      showError("Error al crear el recordatorio");
    } finally {
      setLoading(false);
    }
  };
  
  const showMessage = (message) => {
    setSnackbarMessage(message);
    setSnackbarError(false);
    setSnackbarVisible(true);
  };

  const showError = (message) => {
    setSnackbarMessage(message);
    setSnackbarError(true);
    setSnackbarVisible(true);
  };

  const resetearPagina = () => {
    setNombreMedicamento("");
    setTipoMedicamento(null);
    setDosaje("");
    setHora("");
    setFecha(new Date());
    setCantidadMedicamentos("");
    setHoraSegundoMedicamento("");
    setCantidadSegundoMedicamento("");
    setRepetirRecordatorio(false);
    setIntervaloRepeticion(null);
  };

  const mostrarTimePicker = () => setTimePickerVisible(true);
  const ocultarTimePicker = () => setTimePickerVisible(false);

  const confirmarHora = (date) => {
    const formattedTime = moment(date).format('HH:mm');
    setHora(formattedTime);
    ocultarTimePicker();

    if (cantidadMedicamentos > 1) {
      const segundaHora = moment(date).add(8, 'hours').format('HH:mm');
      setHoraSegundoMedicamento(segundaHora);
    }
  };

  const mostrarDatePicker = () => setDatePickerVisible(true);
  const ocultarDatePicker = () => setDatePickerVisible(false);

  const confirmarFecha = (date) => {
    setFecha(date);
    ocultarDatePicker();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <View style={styles.header}>
          <BoldText texto="Registrar Medicamento" size={scale(28)} style={styles.headerText} />
          <RegularText texto="Complete los detalles del medicamento a continuación" size={scale(16)} style={styles.subHeaderText} />
        </View>

        <View style={styles.formElement}>
          <RegularText texto="Nombre del Medicamento*" size={scale(18)} style={styles.labelText} />
          <View style={styles.inputContainer}>
            <Icon name="pills" type="font-awesome-5" color={theme.colors.primary} size={22} />
            <TextInput
              label=""
              mode="flat"
              style={styles.input}
              value={nombreMedicamento}
              placeholder="Ej: Ibuprofeno"
              onChangeText={setNombreMedicamento}
              autoCapitalize="none"
              underlineColor="transparent"
              theme={{ colors: { primary: theme.colors.primary, text: theme.colors.text, background: "#FFF" } }}
            />
          </View>
        </View>

        <View style={styles.formElement}>
          <RegularText texto="Tipo de Medicamento*" size={scale(18)} style={styles.labelText} />
          <View style={styles.selectContainer}>
            <SelectDropdown
              data={tiposMedicamentos}
              onSelect={setTipoMedicamento}
              defaultButtonText="Seleccione el tipo"
              buttonStyle={styles.dropdownBtnStyle}
              buttonTextStyle={styles.btnTextStyle}
              renderDropdownIcon={(isOpened) => (
                <Icon
                  name={isOpened ? "chevron-up" : "chevron-down"}
                  type="font-awesome"
                  color={theme.colors.primary}
                  size={18}
                />
              )}
              dropdownIconPosition="right"
              dropdownStyle={styles.dropdownStyle}
              rowTextForSelection={(item) => item}
              buttonTextAfterSelection={(selectedItem) => selectedItem}
            />
          </View>
        </View>

        <View style={styles.formElement}>
          <RegularText texto="Dosaje*" size={scale(18)} style={styles.labelText} />
          <View style={styles.inputContainer}>
            <Icon name="weight" type="font-awesome-5" color={theme.colors.primary} size={22} />
            <TextInput
              label=""
              mode="flat"
              style={styles.input}
              value={dosaje}
              placeholder="Ej: 100mg"
              onChangeText={setDosaje}
              autoCapitalize="none"
              underlineColor="transparent"
              theme={{ colors: { primary: theme.colors.primary, text: theme.colors.text, background: "#FFF" } }}
            />
          </View>
        </View>

        <View style={styles.formElement}>
          <RegularText texto="Cantidad de Medicamentos*" size={scale(18)} style={styles.labelText} />
          <View style={styles.inputContainer}>
            <Icon name="pills" type="font-awesome-5" color={theme.colors.primary} size={22} />
            <TextInput
              label=""
              mode="flat"
              style={styles.input}
              value={cantidadMedicamentos}
              placeholder="Ej: 2"
              onChangeText={setCantidadMedicamentos}
              keyboardType="numeric"
              underlineColor="transparent"
              theme={{ colors: { primary: theme.colors.primary, text: theme.colors.text, background: "#FFF" } }}
            />
          </View>
        </View>

        <View style={styles.dateTimeContainer}>
          <View style={styles.formElementSmall}>
            <RegularText texto="Fecha*" size={scale(18)} style={styles.labelTextSmall} />
            <TouchableRipple
              onPress={mostrarDatePicker}
              rippleColor="rgba(0, 0, 0, .1)"
              style={styles.timeButtonSmall}
            >
              <View style={styles.timeButtonContent}>
                <Icon name="calendar" type="font-awesome" color={theme.colors.primary} size={20} />
                <BoldText
                  texto={fecha ? moment(fecha).format('DD/MM/YYYY') : "Fecha"}
                  color={theme.colors.primary}
                  size={scale(16)}
                  style={styles.timeTextSmall}
                />
              </View>
            </TouchableRipple>
            <DateTimePickerModal
              isVisible={datePickerVisible}
              mode="date"
              onConfirm={confirmarFecha}
              onCancel={ocultarDatePicker}
              locale="es-ES"
            />
          </View>

          <View style={styles.formElementSmall}>
            <RegularText texto="Hora*" size={scale(18)} style={styles.labelTextSmall} />
            <TouchableRipple
              onPress={mostrarTimePicker}
              rippleColor="rgba(0, 0, 0, .1)"
              style={styles.timeButtonSmall}
            >
              <View style={styles.timeButtonContent}>
                <Icon name="clock-outline" type="material-community" color={theme.colors.primary} size={20} />
                <BoldText
                  texto={hora ? hora : "Hora"}
                  color={theme.colors.primary}
                  size={scale(16)}
                  style={styles.timeTextSmall}
                />
              </View>
            </TouchableRipple>
            <DateTimePickerModal
              isVisible={timePickerVisible}
              mode="time"
              onConfirm={confirmarHora}
              onCancel={ocultarTimePicker}
              locale="es-ES"
            />
          </View>
        </View>

        {cantidadMedicamentos > 1 && (
          <View style={styles.formElement}>
            <RegularText texto="Cantidad del Segundo Medicamento*" size={scale(18)} style={styles.labelText} />
            <View style={styles.inputContainer}>
              <Icon name="weight" type="font-awesome-5" color={theme.colors.primary} size={22} />
              <TextInput
                label=""
                mode="flat"
                style={styles.input}
                value={cantidadSegundoMedicamento}
                placeholder="Ej: 100mg"
                onChangeText={setCantidadSegundoMedicamento}
                autoCapitalize="none"
                underlineColor="transparent"
                theme={{ colors: { primary: theme.colors.primary, text: theme.colors.text, background: "#FFF" } }}
              />
            </View>
            <RegularText texto={`Se tomará a las ${horaSegundoMedicamento}`} size={scale(14)} style={styles.subHeaderText} />
          </View>
        )}

        <View style={styles.switchContainer}>
          <RegularText texto="Repetir Recordatorio" size={scale(18)} style={styles.labelText} />
          <Switch
            value={repetirRecordatorio}
            onValueChange={() => setRepetirRecordatorio(!repetirRecordatorio)}
            style={styles.switch}
          />
        </View>

        {repetirRecordatorio && (
          <View style={styles.formElement}>
            <RegularText texto="Intervalo de Repetición*" size={scale(18)} style={styles.labelText} />
            <View style={styles.selectContainer}>
              <SelectDropdown
                data={intervalosRepeticion}
                onSelect={setIntervaloRepeticion}
                defaultButtonText="Seleccione el intervalo"
                buttonStyle={styles.dropdownBtnStyle}
                buttonTextStyle={styles.btnTextStyle}
                renderDropdownIcon={(isOpened) => (
                  <Icon
                    name={isOpened ? "chevron-up" : "chevron-down"}
                    type="font-awesome"
                    color={theme.colors.primary}
                    size={18}
                  />
                )}
                dropdownIconPosition="right"
                dropdownStyle={styles.dropdownStyle}
                rowTextForSelection={(item) => item}
                buttonTextAfterSelection={(selectedItem) => selectedItem}
              />
            </View>
          </View>
        )}

        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator animating={true} color={theme.colors.primary} />
          ) : (
            <Button
              mode="contained"
              onPress={crearRecordatorio}
              style={styles.buttonRegister}
              labelStyle={styles.buttonLabel}
              contentStyle={styles.buttonContent}
            >
              <Icon name="save" type="font-awesome-5" color="#FFF" size={20} iconStyle={styles.buttonIcon} />
              GUARDAR RECORDATORIO
            </Button>
          )}
        </View>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={Snackbar.DURATION_SHORT}
          style={{ backgroundColor: snackbarError ? theme.colors.error : theme.colors.primary }}
        >
          {snackbarMessage}
        </Snackbar>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    backgroundColor: "#EFF3F6",
  },
  form: {
    width: "100%",
    marginTop: height * 0.015,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: width * 0.06,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    marginBottom: height * 0.03,
    alignItems: 'center',
  },
  headerText: {
    color: '#2E3A47',
    fontWeight: 'bold',
    fontSize: scale(30),
    fontFamily: 'Roboto-Black',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  subHeaderText: {
    color: '#66788A',
    marginTop: height * 0.01,
    fontSize: scale(17),
    fontFamily: 'Roboto-Regular',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  labelText: {
    color: '#2E3A47',
    marginBottom: height * 0.015,
    fontSize: scale(19),
    fontFamily: 'Roboto-Bold',
    fontWeight: '700',
  },
  formElement: {
    marginBottom: height * 0.025,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: "#F7F9FC",
    paddingLeft: width * 0.04,
    paddingRight: width * 0.02,
    borderColor: "#D1D9E6",
    borderWidth: 1,
    height: height * 0.07,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: height * 0.02,
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: "#F7F9FC",
    paddingLeft: width * 0.04,
    paddingRight: width * 0.02,
    borderColor: "#D1D9E6",
    borderWidth: 1,
    height: height * 0.07,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: height * 0.02,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.025,
  },
  formElementSmall: {
    flex: 1,
    marginRight: width * 0.03,
  },
  labelTextSmall: {
    color: '#2E3A47',
    fontSize: scale(18),
    fontFamily: 'Roboto-Bold',
    fontWeight: '700',
    marginBottom: height * 0.01,
  },
  timeButtonSmall: {
    height: height * 0.07,
    borderRadius: 14,
    backgroundColor: "#F7F9FC",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#D1D9E6",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  timeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeTextSmall: {
    marginLeft: width * 0.03,
    color: "#2E3A47",
    fontFamily: 'Roboto-Medium',
    fontSize: scale(17),
  },
  input: {
    flex: 1,
    backgroundColor: "transparent",
    fontSize: scale(17),
    color: "#2E3A47",
    marginLeft: width * 0.03,
    fontFamily: 'Roboto-Regular',
  },
  dropdownBtnStyle: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E3E8EF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  btnTextStyle: {
    fontSize: scale(16),
    color: "#1F2D3D",
    textAlign: "left",
    marginLeft: width * 0.02,
    fontFamily: 'Roboto-Bold',
  },
  dropdownStyle: {
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderColor: "#D1D9E6",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 4,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.03,
  },
  switch: {
    marginLeft: width * 0.02,
  },
  buttonContainer: {
    marginTop: height * 0.04,
    width: "100%",
    alignItems: "center",
  },
  buttonRegister: {
    width: "90%",
    height: height * 0.075,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    flexDirection: 'row',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonLabel: {
    color: "#FFFFFF",
    fontSize: scale(17),
    fontWeight: '600',
    textTransform: 'uppercase',
    fontFamily: 'Roboto-Bold',
    letterSpacing: 1,
  },
  buttonIcon: {
    marginRight: width * 0.02,
  },
});

export default NuevoRecordatorio;
