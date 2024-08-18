import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { BoldText, RegularText } from "../components/Text";
import { useNavigation } from "@react-navigation/native";
import SelectDropdown from "react-native-select-dropdown";
import { Icon } from "react-native-elements";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import uuid from "react-native-uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAlarm } from 'react-native-simple-alarm';
import moment from 'moment';
import { Button, TextInput, TouchableRipple } from 'react-native-paper';

const tiposMedicamentos = ["Comprimido", "Cápsula"];
const diasDeLaSemana = [
  { id: 1, dia: "Domingo", short: "dom" },
  { id: 2, dia: "Lunes", short: "lun" },
  { id: 3, dia: "Martes", short: "mar" },
  { id: 4, dia: "Miércoles", short: "mié" },
  { id: 5, dia: "Jueves", short: "jue" },
  { id: 6, dia: "Viernes", short: "vie" },
  { id: 7, dia: "Sábado", short: "sáb" },
];

const NuevoRecordatorio = () => {
  const [nombreMedicamento, setNombreMedicamento] = useState("");
  const [tipoMedicamento, setTipoMedicamento] = useState(null);
  const [dosaje, setDosaje] = useState("");
  const [hora, setHora] = useState("");
  const [dia, setDia] = useState("");

  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [horaSeleccionada, setHoraSeleccionada] = useState(null);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const navigation = useNavigation();

  const crearNuevaAlarma = async () => {
    try {
      await createAlarm({
        active: false,
        date: moment().format(),
        message: 'Recordatorio de medicamento',
        snooze: 1,
      });
    } catch (e) {
      console.log(e);
    }
  };

  async function crearRecordatorio() {
    const nuevoRecordatorio = {
      id: uuid.v4(),
      iconStatus: "relogio",
      titulo: nombreMedicamento,
      dosagem: dosaje,
      horario: hora,
      dia: dia,
      iconAction: tipoMedicamento,
    };

    const obtenerRecordatorio = await AsyncStorage.getItem("lembretes");
    if (obtenerRecordatorio == null) {
      await AsyncStorage.setItem("lembretes", JSON.stringify([nuevoRecordatorio]));
    } else {
      crearNuevaAlarma();
      const lembretesJson = JSON.parse(obtenerRecordatorio);
      lembretesJson.push(nuevoRecordatorio);
      await AsyncStorage.removeItem("lembretes");
      await AsyncStorage.setItem("lembretes", JSON.stringify(lembretesJson));
    }
    console.log("¡Nuevo recordatorio agregado!");
    resetearPagina();
    navigation.navigate("Home");
  }

  function resetearPagina() {
    setNombreMedicamento("");
    setTipoMedicamento(null);
    setDosaje("");
    setHora("");
    setDia("");
    setHoraSeleccionada("");
  }

  const mostrarDatePicker = () => {
    setDatePickerVisible(true);
  };

  const ocultarDatePicker = () => {
    setDatePickerVisible(false);
  };

  const confirmarHora = (time) => {
    const horas = String(time.getHours()).padStart(2, '0');
    const minutos = String(time.getMinutes()).padStart(2, '0');
    setHoraSeleccionada(`${horas}:${minutos}`);
    setHora(`${horas}:${minutos}`);
    ocultarDatePicker();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <View style={styles.header}>
          <BoldText texto="Agregar un nuevo recordatorio" size={22} style={styles.headerText} />
          <RegularText texto="Registrar un nuevo medicamento:" size={18} style={styles.subHeaderText} />
        </View>

        <RegularText texto="Nombre del Medicamento*" size={16} style={styles.labelText} />
        <TextInput
          label=""
          mode="outlined"
          style={styles.input}
          value={nombreMedicamento}
          placeholder="Ej: Ibuprofeno"
          onChangeText={(text) => setNombreMedicamento(text)}
          autoCapitalize="none"
          theme={{ colors: { primary: '#1E88E5', text: '#000' } }}
        />

        <View style={styles.formElement}>
          <RegularText texto="Tipo de Medicamento*" size={16} style={styles.labelText} />
          <SelectDropdown
            data={tiposMedicamentos}
            onSelect={(selectedItem) => setTipoMedicamento(selectedItem)}
            defaultButtonText="Seleccione el tipo"
            buttonStyle={styles.dropdown1BtnStyle}
            buttonTextStyle={styles.btnTextStyle}
            renderDropdownIcon={(isOpened) => (
              <Icon
                name={isOpened ? "chevron-up" : "chevron-down"}
                type="font-awesome"
                color="#1E88E5"
                size={16}
              />
            )}
            dropdownIconPosition="right"
            dropdownStyle={styles.dropdownStyle}
            rowTextForSelection={(item) => item}
            buttonTextAfterSelection={(selectedItem) => selectedItem}
          />
        </View>

        <RegularText texto="Dosaje*" size={16} style={styles.labelText} />
        <TextInput
          label=""
          mode="outlined"
          style={styles.input}
          value={dosaje}
          placeholder="Ej: 100mg"
          onChangeText={(text) => setDosaje(text)}
          autoCapitalize="none"
          theme={{ colors: { primary: '#1E88E5', text: '#000' } }}
        />

        <View style={styles.formElement}>
          <RegularText texto="Hora del recordatorio*" size={16} style={styles.labelText} />
          <TouchableRipple
            onPress={mostrarDatePicker}
            rippleColor="rgba(0, 0, 0, .32)"
            style={styles.timeButton}
          >
            <View>
              <BoldText
                texto={horaSeleccionada ? horaSeleccionada : "Seleccionar Hora"}
                color="#1E88E5"
                size={18}
              />
            </View>
          </TouchableRipple>
          <DateTimePickerModal
            date={fechaSeleccionada}
            isVisible={datePickerVisible}
            mode="time"
            is24Hour={true}
            onConfirm={confirmarHora}
            onCancel={ocultarDatePicker}
          />
        </View>

        <View style={styles.formElement}>
          <RegularText texto="Día del recordatorio*" size={16} style={styles.labelText} />
          <SelectDropdown
            data={diasDeLaSemana}
            onSelect={(selectedItem) => setDia(selectedItem.short)}
            defaultButtonText="Seleccione el día"
            buttonStyle={styles.dropdown1BtnStyle}
            buttonTextStyle={styles.btnTextStyle}
            renderDropdownIcon={(isOpened) => (
              <Icon
                name={isOpened ? "chevron-up" : "chevron-down"}
                type="font-awesome"
                color="#1E88E5"
                size={16}
              />
            )}
            dropdownIconPosition="right"
            dropdownStyle={styles.dropdownStyle}
            rowTextForSelection={(item) => item.dia}
            buttonTextAfterSelection={(selectedItem) => selectedItem.dia}
          />
        </View>

        <Button
          mode="contained"
          onPress={crearRecordatorio}
          style={styles.buttonRegister}
          labelStyle={{ color: "#FFF" }}
        >
          GUARDAR RECORDATORIO
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: "#ECEFF1",
  },
  form: {
    width: "100%",
    marginTop: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  headerText: {
    color: '#1565C0',
    fontWeight: 'bold',
    fontSize: 24,
  },
  subHeaderText: {
    color: '#607D8B',
    marginTop: 5,
    fontSize: 18,
  },
  labelText: {
    color: '#607D8B',
    marginBottom: 10,
    fontSize: 16,
  },
  formElement: {
    marginBottom: 25,
  },
  input: {
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    fontSize: 16,
    paddingLeft: 20,
    color: "#37474F",
    borderColor: "#CFD8DC",
    borderWidth: 1,
  },
  dropdown1BtnStyle: {
    borderColor: "#CFD8DC",
    borderWidth: 1,
    width: "100%",
    height: 50,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  btnTextStyle: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    color: "#1565C0",
    textAlign: "left",
    marginLeft: 8,
  },
  dropdownStyle: {
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  timeButton: {
    width: "100%",
    height: 50,
    borderRadius: 30,
    backgroundColor: "#E1F5FE",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#1565C0",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonRegister: {
    marginTop: 25,
    width: "100%",
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1565C0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});

export default NuevoRecordatorio;
