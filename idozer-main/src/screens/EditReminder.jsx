import React, { useState } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { BoldText, LightText, RegularText } from "../components/Text";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import SelectDropdown from "react-native-select-dropdown";
import { Icon } from "react-native-elements";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const tiposMedicamentos = ["Comprimido", "Cápsula"];
const diasDeLaSemana = [
  {
    id: 1,
    dia: "Domingo",
    short: "dom",
  },
  {
    id: 2,
    dia: "Lunes",
    short: "lun",
  },
  {
    id: 3,
    dia: "Martes",
    short: "mar",
  },
  {
    id: 4,
    dia: "Miércoles",
    short: "mié",
  },
  {
    id: 5,
    dia: "Jueves",
    short: "jue",
  },
  {
    id: 6,
    dia: "Viernes",
    short: "vie",
  },
  {
    id: 7,
    dia: "Sábado",
    short: "sáb",
  },
];

const EditarRecordatorio = ({ route }) => {
  const { item, recordatorios } = route.params;

  const [id, setId] = useState(item.id);
  const [nombreMedicamento, setNombreMedicamento] = useState(item.titulo);
  const [tipoMedicamento, setTipoMedicamento] = useState(item.iconAction);
  const [dosaje, setDosaje] = useState(item.dosagem);
  const [hora, setHora] = useState(item.horario);
  const [dia, setDia] = useState(item.dia);

  const findDia = diasDeLaSemana.find((each) => each.short === dia);
  const diaNombre = findDia.dia;

  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [horaSeleccionada, setHoraSeleccionada] = useState(item.horario);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const navigation = useNavigation();

  async function editarRecordatorio() {
    const nuevoRecordatorio = {
      id: id,
      iconStatus: "relogio",
      titulo: nombreMedicamento,
      dosagem: dosaje,
      horario: hora,
      dia: dia,
      iconAction: tipoMedicamento,
    };

    const obtenerRecordatorios = await AsyncStorage.getItem("lembretes");

    if (obtenerRecordatorios != null) {
      const recordatoriosJson = JSON.parse(obtenerRecordatorios);
      const idAEliminar = id;
      const nuevosRecordatorios = recordatoriosJson.filter(
        (item) => item.id !== idAEliminar
      );
      nuevosRecordatorios.push(nuevoRecordatorio);
      console.log(nuevosRecordatorios);
      await AsyncStorage.removeItem("lembretes");
      await AsyncStorage.setItem("lembretes", JSON.stringify(nuevosRecordatorios));
    }
    console.log("¡Recordatorio editado!");
    navigation.navigate("Home");
  }

  async function eliminarRecordatorio() {
    const obtenerRecordatorios = await AsyncStorage.getItem("lembretes");

    if (obtenerRecordatorios != null) {
      const recordatoriosJson = JSON.parse(obtenerRecordatorios);
      const idAEliminar = id;
      const nuevosRecordatorios = recordatoriosJson.filter(
        (item) => item.id !== idAEliminar
      );
      await AsyncStorage.removeItem("lembretes");
      await AsyncStorage.setItem("lembretes", JSON.stringify(nuevosRecordatorios));
    }
    console.log("¡Recordatorio eliminado!");
    navigation.navigate("Home");
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
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            marginBottom: 20,
            justifyContent: "space-between",
          }}
        >
          <BoldText texto="Editar recordatorio" size={16} />
          <TouchableOpacity onPress={eliminarRecordatorio}>
            <Icon name="trash-outline" type="ionicon" color="red" />
          </TouchableOpacity>
        </View>

        <View
          style={{
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <BoldText texto="Editar recordatorio" size={16} />
          <RegularText texto="Modifica los detalles del medicamento:" size={16} />
        </View>

        <View style={styles.form}>
          <View style={styles.formElement}>
            <RegularText texto="Nombre (ej: Sertralina)*" size={14} />
            <TextInput
              style={styles.input}
              value={nombreMedicamento}
              placeholder="Ibuprofeno"
              onChangeText={(text) => setNombreMedicamento(text)}
              autoCapitalize={"none"}
            />
          </View>

          <View style={styles.formElement}>
            <RegularText texto="Tipo de Medicamento*" size={14} />
            <SelectDropdown
              data={tiposMedicamentos}
              onSelect={(selectedItem) => {
                setTipoMedicamento(selectedItem);
              }}
              defaultButtonText={
                <LightText
                  texto={tipoMedicamento ? tipoMedicamento : "Seleccione el tipo"}
                  size={13}
                />
              }
              buttonStyle={styles.dropdown1BtnStyle}
              buttonTextStyle={styles.btnTextStyle}
              buttonTextAfterSelection={(selectedItem, index) => {
                return <LightText texto={selectedItem} />;
              }}
              rowTextForSelection={(item, index) => {
                return <LightText texto={item} />;
              }}
              renderDropdownIcon={(isOpened) => {
                return (
                  <LightText
                    texto={
                      isOpened ? (
                        <Icon name="chevron-up-outline" type="ionicon" />
                      ) : (
                        <Icon name="chevron-down-outline" type="ionicon" />
                      )
                    }
                  />
                );
              }}
              dropdownIconPosition={"right"}
              dropdownStyle={styles.dropdownStyle}
            />
          </View>

          <View style={styles.formElement}>
            <RegularText texto="Dosaje (ej: 100mg)*" size={14} />
            <TextInput
              style={styles.input}
              value={dosaje}
              placeholder="200mg"
              onChangeText={(text) => setDosaje(text)}
              autoCapitalize={"none"}
            />
          </View>

          <View style={styles.formElement}>
            <RegularText texto="Hora del recordatorio*" size={14} />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                onPress={mostrarDatePicker}
                style={styles.floatingButtonStyle}
              >
                <BoldText
                  texto={
                    horaSeleccionada ? (
                      <BoldText texto={horaSeleccionada} color="white" />
                    ) : (
                      <BoldText texto="+" color="white" size={40} />
                    )
                  }
                />
              </TouchableOpacity>
            </View>
            <DateTimePickerModal
              date={fechaSeleccionada}
              isVisible={datePickerVisible}
              mode={"time"}
              is24Hour={true}
              onConfirm={confirmarHora}
              onCancel={ocultarDatePicker}
            />
          </View>

          <View style={styles.formElement}>
            <RegularText texto="Día del recordatorio*" size={14} />
            <SelectDropdown
              data={diasDeLaSemana}
              onSelect={(selectedItem, index) => {
                setDia(selectedItem.short);
              }}
              defaultButtonText={
                <LightText
                  texto={diaNombre ? diaNombre : "Seleccione el día"}
                  size={13}
                />
              }
              buttonStyle={styles.dropdown1BtnStyle}
              buttonTextStyle={styles.btnTextStyle}
              buttonTextAfterSelection={(selectedItem, index) => {
                return <LightText texto={selectedItem.dia} />;
              }}
              rowTextForSelection={(item, index) => {
                return <LightText texto={item.dia} />;
              }}
              renderDropdownIcon={(isOpened) => {
                return (
                  <LightText
                    texto={
                      isOpened ? (
                        <Icon name="chevron-up-outline" type="ionicon" />
                      ) : (
                        <Icon name="chevron-down-outline" type="ionicon" />
                      )
                    }
                  />
                );
              }}
              dropdownIconPosition={"right"}
              dropdownStyle={styles.dropdownStyle}
            />
          </View>

          <TouchableOpacity
            style={styles.buttonRegister}
            onPress={editarRecordatorio}
          >
            <BoldText texto="EDITAR RECORDATORIO" color="#FFFFFF" size={16} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 70,
    alignItems: "center",
    fontFamily: "light",
    marginLeft: 30,
    width: "85%",
  },
  form: {
    width: "100%",
    marginTop: 20,
  },
  input: {
    fontFamily: "light",
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 10,
    width: "100%",
    height: 40,
    borderRadius: 4,
    backgroundColor: "white",
  },
  buttonRegister: {
    marginTop: 10,
    width: "100%",
    height: 40,
    borderRadius: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#05B494",
    marginBottom: 20,
  },
  dropdown1BtnStyle: {
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 5,
    marginBottom: 15,
    width: "100%",
    height: 40,
    borderRadius: 4,
    backgroundColor: "white",
  },
  btnTextStyle: {
    fontFamily: "light",
    fontSize: 14,
    color: "black",
    textAlign: "left",
    marginLeft: 2,
  },
  dropdownStyle: {
    borderRadius: 15,
  },
  floatingButtonStyle: {
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    backgroundColor: "#05B494",
    width: 60,
    height: 60,
    marginTop: 5,
    borderRadius: 100,
    marginBottom: 15,
  },
});

export default EditarRecordatorio;
