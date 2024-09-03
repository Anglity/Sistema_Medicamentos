import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import { BoldText, RegularText } from "../components/Text";
import { useNavigation } from "@react-navigation/native";
import SelectDropdown from "react-native-select-dropdown";
import { Icon } from "react-native-elements";
import { Button, TextInput, TouchableRipple, useTheme, Snackbar, Switch, ActivityIndicator } from 'react-native-paper';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import 'moment/locale/es';
import { ref, update, remove } from 'firebase/database';
import { db } from '../services/firebase';

moment.locale('es');

const { width, height } = Dimensions.get('window');
const scale = (size) => (width / 375) * size;

const tiposMedicamentos = ["Comprimido", "Cápsula"];
const intervalosRepeticion = [
  "15 min", "30 min", "45 min", "1 hora", "2 horas", "3 horas", "4 horas", "6 horas", "8 horas", "12 horas", "24 horas"
];

const EditarRecordatorio = ({ route }) => {
  const theme = useTheme();
  const { id, item } = route.params;
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

  useEffect(() => {
    const cargarDatosRecordatorio = () => {
      if (!item) {
        showError("No se encontraron datos para este recordatorio.");
        return;
      }
      
      setNombreMedicamento(item.titulo.trim());
      setTipoMedicamento(item.iconAction);
      setDosaje(item.dosagem.trim());
      setHora(item.horario);
      setFecha(moment(item.fecha, 'dddd, D [de] MMMM [de] YYYY').toDate());
      setCantidadMedicamentos(item.cantidadMedicamentos || '');
      setHoraSegundoMedicamento(item.horaSegundoMedicamento || '');
      setCantidadSegundoMedicamento(item.cantidadSegundoMedicamento || '');
      setRepetirRecordatorio(item.repetir || false);
      setIntervaloRepeticion(item.intervaloRepeticion || null);
    };
  
    cargarDatosRecordatorio();
  }, [item]);

  const validarCampos = () => {
    if (!nombreMedicamento || !tipoMedicamento || !dosaje || !hora || !cantidadMedicamentos) {
      showError("Por favor, completa todos los campos obligatorios.");
      return false;
    }
    return true;
  };

  const editarRecordatorio = async () => {
    if (!validarCampos()) return;

    const recordatorioActualizado = {
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
      const recordatorioRef = ref(db, `recordatorios/${id}`);
      await update(recordatorioRef, recordatorioActualizado);
      showMessage("Recordatorio actualizado exitosamente");
      navigation.navigate("Home");
    } catch (error) {
      console.error('Error actualizando el medicamento en Firebase: ', error);
      showError("Error al actualizar el recordatorio");
    } finally {
      setLoading(false);
    }
  };

  const eliminarRecordatorio = async () => {
    setLoading(true);
    try {
      const recordatorioRef = ref(db, `recordatorios/${id}`);
      await remove(recordatorioRef);
      showMessage("Recordatorio eliminado exitosamente");
      navigation.navigate("Home");
    } catch (error) {
      console.error('Error eliminando el recordatorio en Firebase: ', error);
      showError("Error al eliminar el recordatorio");
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

  const mostrarTimePicker = () => setTimePickerVisible(true);
  const ocultarTimePicker = () => setTimePickerVisible(false);

  const confirmarHora = (date) => {
    const formattedTime = moment(date).format('HH:mm');
    setHora(formattedTime);
    ocultarTimePicker();
  };

  const mostrarDatePicker = () => setDatePickerVisible(true);
  const ocultarDatePicker = () => setDatePickerVisible(false);

  const confirmarFecha = (date) => {
    setFecha(date);
    ocultarDatePicker();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Icon name="arrow-left" type="font-awesome" color={theme.colors.primary} size={24} />
        </TouchableOpacity>
        <BoldText texto="Editar Medicamento" size={scale(28)} style={styles.headerText} />
        <TouchableOpacity onPress={eliminarRecordatorio}>
          <Icon name="trash" type="font-awesome" color={theme.colors.error} size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <RegularText texto="Modifique los detalles del medicamento a continuación" size={scale(16)} style={styles.subHeaderText} />

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
              defaultButtonText={tipoMedicamento || "Seleccione el tipo"}
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

        {cantidadMedicamentos > 1 && (
          <>
            <View style={styles.formElement}>
              <RegularText texto="Hora del Segundo Medicamento*" size={scale(18)} style={styles.labelText} />
              <View style={styles.inputContainer}>
                <Icon name="clock-outline" type="material-community" color={theme.colors.primary} size={22} />
                <TextInput
                  label=""
                  mode="flat"
                  style={styles.input}
                  value={horaSegundoMedicamento}
                  placeholder="Ej: 03:10"
                  onChangeText={setHoraSegundoMedicamento}
                  autoCapitalize="none"
                  underlineColor="transparent"
                  theme={{ colors: { primary: theme.colors.primary, text: theme.colors.text, background: "#FFF" } }}
                />
              </View>
            </View>

            <View style={styles.formElement}>
              <RegularText texto="Cantidad del Segundo Medicamento*" size={scale(18)} style={styles.labelText} />
              <View style={styles.inputContainer}>
                <Icon name="pills" type="font-awesome-5" color={theme.colors.primary} size={22} />
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
          </>
        )}

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
                defaultButtonText={intervaloRepeticion || "Seleccione el intervalo"}
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
              onPress={editarRecordatorio}
              style={styles.buttonRegister}
              labelStyle={styles.buttonLabel}
              contentStyle={styles.buttonContent}
            >
              <Icon name="save" type="font-awesome-5" color="#FFF" size={20} iconStyle={styles.buttonIcon} />
              ACTUALIZAR RECORDATORIO
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
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    backgroundColor: "#F2F4F7", // Fondo ligeramente más claro
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: height * 0.04, // Ajustar para bajar el header
    marginBottom: height * 0.02,
  },
  form: {
    width: "100%",
    marginTop: height * -0.01, // Ajustar espacio superior al formulario
    backgroundColor: "#FFFFFF",
    borderRadius: 12, // Bordes ligeramente menos redondeados
    padding: width * 0.045,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07, // Sombra más suave
    shadowRadius: 6,
    elevation: 3,
  },
  headerText: {
    color: '#34495E', // Texto con un tono más oscuro
    fontWeight: 'bold',
    fontSize: scale(20), // Tamaño ligeramente reducido
    fontFamily: 'Roboto-Black',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto', // Asegurar que el texto esté centrado
  },
  subHeaderText: {
    color: '#7F8C8D', // Color más neutro para el subtítulo
    marginTop: height * 0.008,
    fontSize: scale(14), // Tamaño más pequeño
    fontFamily: 'Roboto-Regular',
    letterSpacing: 0.2,
    textAlign: 'center',
    marginBottom: height * 0.015,
  },
  labelText: {
    color: '#34495E', // Color coherente con el título
    marginBottom: height * 0.008,
    fontSize: scale(16),
    fontFamily: 'Roboto-Bold',
    fontWeight: '700',
  },
  formElement: {
    marginBottom: height * 0.015, // Espaciado ligeramente reducido
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10, // Bordes más sutiles
    backgroundColor: "#ECF0F1", // Fondo más suave
    paddingLeft: width * 0.03,
    paddingRight: width * 0.015,
    borderColor: "#D1D9E6",
    borderWidth: 1,
    height: height * 0.06, // Altura ligeramente reducida
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, // Sombra más discreta
    shadowRadius: 3,
    elevation: 2,
    marginBottom: height * 0.015,
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10, // Bordes más sutiles
    backgroundColor: "#ECF0F1",
    paddingLeft: width * 0.03,
    paddingRight: width * 0.015,
    borderColor: "#D1D9E6",
    borderWidth: 1,
    height: height * 0.06, // Altura ligeramente reducida
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, // Sombra más discreta
    shadowRadius: 3,
    elevation: 2,
    marginBottom: height * 0.015,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.02,
  },
  formElementSmall: {
    flex: 1,
    marginRight: width * 0.02,
  },
  labelTextSmall: {
    color: '#34495E',
    fontSize: scale(15), // Tamaño de fuente más pequeño
    fontFamily: 'Roboto-Bold',
    fontWeight: '900',
    marginBottom: height * 0.008,
  },
  timeButtonSmall: {
    height: height * 0.06, // Altura ligeramente reducida
    borderRadius: 10, // Bordes más sutiles
    backgroundColor: "#ECF0F1",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#D1D9E6",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, // Sombra más discreta
    shadowRadius: 3,
    elevation: 2,
  },
  timeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeTextSmall: {
    marginLeft: width * 0.02,
    color: "#34495E",
    fontFamily: 'Roboto-Medium',
    fontSize: scale(14),
  },
  input: {
    flex: 1,
    backgroundColor: "transparent",
    fontSize: scale(14),
    color: "#34495E",
    marginLeft: width * 0.02,
    fontFamily: 'Roboto-Regular',
  },
  dropdownBtnStyle: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E3E8EF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, // Sombra más discreta
    shadowRadius: 3,
    elevation: 2,
  },
  btnTextStyle: {
    fontSize: scale(14),
    color: "#1F2D3D",
    textAlign: "left",
    marginLeft: width * 0.015,
    fontFamily: 'Roboto-Bold',
  },
  dropdownStyle: {
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderColor: "#D1D9E6",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, // Sombra más discreta
    shadowRadius: 3,
    elevation: 2,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  switch: {
    marginLeft: width * 0.015,
  },
  buttonContainer: {
    marginTop: height * 0.025, // Espaciado ligeramente reducido
    width: "100%",
    alignItems: "center",
  },
  buttonRegister: {
    width: "85%", // Ancho reducido para mejor apariencia
    height: height * 0.06, // Altura ligeramente reducida
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#27AE60", // Verde más oscuro para un tono más serio
    flexDirection: 'row',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, // Sombra ligeramente menos intensa
    shadowRadius: 5,
    elevation: 3,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonLabel: {
    color: "#FFFFFF",
    fontSize: scale(15),
    fontWeight: '600',
    textTransform: 'uppercase',
    fontFamily: 'Roboto-Bold',
    letterSpacing: 0.6,
  },
  buttonIcon: {
    marginRight: width * 0.015,
  },
  deleteIcon: {
    backgroundColor: '#E74C3C', // Fondo rojo para el botón de eliminar
    borderRadius: 30, // Más redondeado
    padding: 10, // Añadir un padding para hacer el icono más redondeado
  },
});




export default EditarRecordatorio;
