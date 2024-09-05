import React, { useState, useEffect } from "react";
import { StyleSheet, View, ActivityIndicator, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Text, Button, IconButton, Menu, Divider, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';  // Importamos Lottie
import { db } from '../services/firebase';
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database';
import moment from 'moment';

// Obtenemos las dimensiones de la pantalla
const { width } = Dimensions.get('window');

const icons = [
  { nome: "Comprimido", icon: "pill" },
  { nome: "Cápsula", icon: "capsule" },
];

const menuItems = [
  { nome: "Sair", function: "deslogarUser" },
];

const daysOfWeek = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

const HomeScreen = () => {
  const [recordatorios, setRecordatorios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(moment().format('dddd, D [de] MMMM [de] YYYY'));
  const [menuVisible, setMenuVisible] = useState(false);
  const [isDayTime, setIsDayTime] = useState(true);

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const fetchRecordatorios = async (day) => {
    setLoading(true);
    
    const formattedDay = moment(day, 'dddd, D [de] MMMM [de] YYYY').format('dddd, D [de] MMMM [de] YYYY');
    const recordatoriosRef = query(ref(db, 'recordatorios'), orderByChild('fecha'), equalTo(formattedDay));
    
    onValue(recordatoriosRef, (snapshot) => {
      const fetchedData = [];
      snapshot.forEach((childSnapshot) => {
        fetchedData.push(childSnapshot.val());
      });
      setRecordatorios(fetchedData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching data: ", error);
      setLoading(false);
    });
  };

  const getIconAnimation = (nombre) => {
    switch (nombre) {
      case 'Comprimido':
        return require('../../assets/comprimido.png'); // Animación Lottie comprimido
      case 'Cápsula':
        return require('../../assets/capsulas.png'); // Animación Lottie cápsula
      default:
        //return require('../../assets/default.json'); // Animación default
    }
  };

  const deslogarUser = async () => {
    navigation.navigate("Start");
  };

  useEffect(() => {
    if (isFocused) {
      fetchRecordatorios(selectedDay);
    }
  }, [isFocused, selectedDay]);

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    fetchRecordatorios(day);
  };

  const toggleTheme = () => {
    setIsDayTime(!isDayTime);
  };

  const navigateToNewReminder = () => {
    navigation.navigate("NewReminder");
  };

  const navigateToEditReminder = (item) => {
    navigation.navigate("EditReminder", {
      item: item,
      reminders: recordatorios,
    });
  };

  return (
    <View style={isDayTime ? styles.containerDay : styles.containerNight}>
      <View style={styles.headerDiv}>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton
              icon="account-circle"
              size={40}
              onPress={() => setMenuVisible(true)}
              style={styles.iconButton}
            />
          }
        >
          {menuItems.map((item, index) => (
            <Menu.Item
              key={index}
              onPress={() => {
                setMenuVisible(false);
                if (item.function === "deslogarUser") {
                  deslogarUser();
                }
              }}
              title={item.nome}
            />
          ))}
          <Divider />
        </Menu>
        <Text style={isDayTime ? styles.appTitleDay : styles.appTitleNight}>idozer</Text>
      </View>

      <DayPicker onDaySelect={handleDaySelect} isDayTime={isDayTime} />

      <ScrollView style={styles.content}>
        <Text style={isDayTime ? styles.sectionTitleDay : styles.sectionTitleNight}>Recordatorios de Hoy</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#05B494" />
        ) : (
          <View style={styles.reminderList}>
            {recordatorios.length > 0 ? (
              recordatorios.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => navigateToEditReminder(item)}
                >
                  <Card style={isDayTime ? styles.reminderCardDay : styles.reminderCardNight}>
                    <View style={styles.reminderRow}>
                      <View style={isDayTime ? styles.reminderIconContainerDay : styles.reminderIconContainerNight}>
                        <LottieView 
                          source={getIconAnimation(item.iconAction)} 
                          autoPlay loop style={{ width: 40, height: 40 }} 
                        />
                      </View>
                      <View style={styles.reminderDetails}>
                        <Text style={isDayTime ? styles.reminderTitleDay : styles.reminderTitleNight}>{item.titulo}</Text>
                        <Text style={isDayTime ? styles.reminderTimeTextDay : styles.reminderTimeTextNight}>Hora: {item.horario}</Text>
                        <Text style={isDayTime ? styles.reminderDosageDay : styles.reminderDosageNight}>Dosaje: {item.dosagem}</Text>
                        <Text style={isDayTime ? styles.reminderQuantityDay : styles.reminderQuantityNight}>Cantidad: {item.cantidadMedicamentos}</Text>
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noRemindersAnimation}>
                <LottieView 
                  source={require('../../assets/empty.json')} // Animación cuando no hay recordatorios
                  autoPlay loop 
                  style={{ width: 200, height: 200 }} 
                />
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <BottomNavigationBar 
        isDayTime={isDayTime} 
        toggleTheme={toggleTheme} 
        navigateToNewReminder={navigateToNewReminder} 
        
      />
    </View>
  );
};

const DayPicker = ({ onDaySelect, isDayTime }) => {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [daysInWeek, setDaysInWeek] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    updateDaysInWeek(selectedDate);
  }, [selectedMonth, selectedYear]);

  const updateDaysInWeek = (currentDate) => {
    const currentDayOfWeek = new Date(selectedYear, selectedMonth, currentDate).getDay();
    const startOfWeek = currentDate - currentDayOfWeek;
    const daysArray = [];

    for (let i = 0; i < 7; i++) {
      let currentDay = startOfWeek + i;
      const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
      if (currentDay <= 0) {
        const daysInPreviousMonth = new Date(selectedYear, selectedMonth, 0).getDate();
        daysArray.push(daysInPreviousMonth + currentDay);
      } else if (currentDay > daysInMonth) {
        daysArray.push(currentDay - daysInMonth);
      } else {
        daysArray.push(currentDay);
      }
    }

    setDaysInWeek(daysArray);
  };

  const handleDayPress = (index) => {
    setSelectedDay(index);
    const newDate = new Date(selectedYear, selectedMonth, daysInWeek[index]);
    setSelectedDate(newDate.getDate());
    const formattedDate = moment(newDate).format('dddd, D [de] MMMM [de] YYYY');
    onDaySelect(formattedDate);
  };

  const handleMonthSelect = (monthIndex) => {
    setSelectedMonth(monthIndex);
    setMenuVisible(false);

    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();

    if (monthIndex === currentMonth) {
      setSelectedDate(currentDay);
      setSelectedDay(new Date().getDay());
      updateDaysInWeek(currentDay);
    } else {
      const firstDayOfMonth = new Date(selectedYear, monthIndex, 1);
      setSelectedDate(1);
      setSelectedDay(firstDayOfMonth.getDay());
      updateDaysInWeek(1);
    }
  };

  const handlePrevWeek = () => {
    const firstDayOfCurrentWeek = new Date(selectedYear, selectedMonth, daysInWeek[0]);
    firstDayOfCurrentWeek.setDate(firstDayOfCurrentWeek.getDate() - 7);

    if (firstDayOfCurrentWeek.getMonth() !== selectedMonth) {
      setSelectedMonth(firstDayOfCurrentWeek.getMonth());
      setSelectedYear(firstDayOfCurrentWeek.getFullYear());
    }

    setSelectedDate(firstDayOfCurrentWeek.getDate());
    updateDaysInWeek(firstDayOfCurrentWeek.getDate());
  };

  const handleNextWeek = () => {
    const lastDayOfCurrentWeek = new Date(selectedYear, selectedMonth, daysInWeek[6]);
    lastDayOfCurrentWeek.setDate(lastDayOfCurrentWeek.getDate() + 7);

    if (lastDayOfCurrentWeek.getMonth() !== selectedMonth) {
      setSelectedMonth(lastDayOfCurrentWeek.getMonth());
      setSelectedYear(lastDayOfCurrentWeek.getFullYear());
    }

    setSelectedDate(lastDayOfCurrentWeek.getDate());
    updateDaysInWeek(lastDayOfCurrentWeek.getDate());
  };

  return (
    <View style={isDayTime ? dayPickerStyles.container : dayPickerStyles.containerNight}>
      <View style={dayPickerStyles.header}>
        <Text style={isDayTime ? dayPickerStyles.headerText : dayPickerStyles.headerTextNight}>
          {months[selectedMonth]} {selectedYear}
        </Text>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setMenuVisible(true)}
              labelStyle={isDayTime ? dayPickerStyles.monthButtonText : dayPickerStyles.monthButtonTextNight}
              style={isDayTime ? dayPickerStyles.monthButton : dayPickerStyles.monthButtonNight}
              icon={() => <MaterialCommunityIcons name="chevron-down" size={20} color={isDayTime ? "#333" : "#FFF"} />}
            >
              {months[selectedMonth]}
            </Button>
          }
        >
          {months.map((month, index) => (
            <Menu.Item
              key={index}
              onPress={() => handleMonthSelect(index)}
              title={`${month} ${selectedYear}`}
            />
          ))}
        </Menu>
      </View>
      <View style={dayPickerStyles.navigationButtons}>
        <TouchableOpacity onPress={handlePrevWeek}>
          <MaterialCommunityIcons name="chevron-left" size={24} color={isDayTime ? "#333" : "#FFF"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNextWeek}>
          <MaterialCommunityIcons name="chevron-right" size={24} color={isDayTime ? "#333" : "#FFF"} />
        </TouchableOpacity>
      </View>
      <View style={dayPickerStyles.daysContainer}>
        {daysOfWeek.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              dayPickerStyles.dayButton,
              selectedDay === index && (isDayTime ? dayPickerStyles.selectedDayButton : dayPickerStyles.selectedDayButtonNight),
            ]}
            onPress={() => handleDayPress(index)}
          >
            <Text
              style={[
                dayPickerStyles.dayText,
                selectedDay === index ? (isDayTime ? dayPickerStyles.selectedDayText : dayPickerStyles.selectedDayTextNight) : (isDayTime ? dayPickerStyles.defaultDayText : dayPickerStyles.defaultDayTextNight),
              ]}
            >
              {day}
            </Text>
            <Text
              style={[
                dayPickerStyles.dateText,
                selectedDay === index ? (isDayTime ? dayPickerStyles.selectedDayText : dayPickerStyles.selectedDayTextNight) : (isDayTime ? dayPickerStyles.defaultDayText : dayPickerStyles.defaultDayTextNight),
              ]}
            >
              {daysInWeek[index]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const BottomNavigationBar = ({ isDayTime, toggleTheme, navigateToNewReminder, navigateToProfile }) => {
  return (
    <View style={isDayTime ? styles.navigationBarDay : styles.navigationBarNight}>
      <TouchableOpacity style={styles.navButton} onPress={toggleTheme}>
        <MaterialCommunityIcons name={isDayTime ? "weather-sunny" : "weather-night"} size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton}>
        <MaterialCommunityIcons name="calendar" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton} onPress={navigateToNewReminder}>
        <View style={isDayTime ? styles.centralButtonDay : styles.centralButtonNight}>
          <MaterialCommunityIcons name="plus" size={35} color="white" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton}>
        <MaterialCommunityIcons name="file-document-outline" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton} onPress={navigateToProfile}>
        <MaterialCommunityIcons name="account-group-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const dayPickerStyles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    padding: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 15,
  },
  containerNight: {
    backgroundColor: "#2C2C2C",
    padding: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  headerTextNight: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  monthButton: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  monthButtonNight: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#555555",
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  monthButtonText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "600",
  },
  monthButtonTextNight: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 5,
    borderRadius: 8,
  },
  selectedDayButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
  },
  selectedDayButtonNight: {
    backgroundColor: "#FF4081",
    borderRadius: 8,
  },
  dayText: {
    fontSize: 12,
    fontWeight: "600",
  },
  dateText: {
    fontSize: 10,
    marginTop: 2,
  },
  selectedDayText: {
    color: "#FFFFFF",
  },
  selectedDayTextNight: {
    color: "#000000",
  },
  defaultDayText: {
    color: "#333333",
  },
  defaultDayTextNight: {
    color: "#CCCCCC",
  },
});

const styles = StyleSheet.create({
  containerDay: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    paddingTop: 30,
    paddingHorizontal: 10,
  },
  containerNight: {
    flex: 1,
    backgroundColor: "#1A1A2E",
    paddingTop: 30,
    paddingHorizontal: 10,
  },
  headerDiv: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  appTitleDay: {
    color: "#00796B",
    fontSize: 26,
    fontWeight: "700",
  },
  appTitleNight: {
    color: "#BB86FC",
    fontSize: 26,
    fontWeight: "700",
  },
  iconButton: {
    backgroundColor: "#E0E0E0",
    borderRadius: 20,
    padding: 5,
  },
  content: {
    flex: 1,
  },
  sectionTitleDay: {
    color: "#424242",
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
  },
  sectionTitleNight: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
  },
  reminderList: {
    marginTop: 10,
  },
  reminderCardDay: {
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    paddingHorizontal: 15,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
    borderColor: "#E0E0E0",
    borderWidth: 1,
  },
  reminderCardNight: {
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#2C2C2C",
    paddingVertical: 15,
    paddingHorizontal: 15,
    shadowColor: "rgba(0, 0, 0, 0.5)",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 3,
    borderColor: "#FF4081",
    borderWidth: 1,
  },
  reminderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  reminderIconContainerDay: {
    backgroundColor: "#03DAC6",
    borderRadius: 25,
    padding: 10,
  },
  reminderIconContainerNight: {
    backgroundColor: "#BB86FC",
    borderRadius: 25,
    padding: 10,
  },
  reminderDetails: {
    flex: 1,
    marginLeft: 10,
  },
  reminderTitleDay: {
    color: "#212121",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  reminderTitleNight: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  reminderInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  reminderTimeTextDay: {
    color: "#757575",
    fontSize: 14,
    fontWeight: "500",
  },
  reminderTimeTextNight: {
    color: "#E0E0E0",
    fontSize: 14,
    fontWeight: "500",
  },
  reminderDosageDay: {
    color: "#00796B",
    fontSize: 14,
    fontWeight: "500",
  },
  reminderDosageNight: {
    color: "#BB86FC",
    fontSize: 14,
    fontWeight: "500",
  },
  reminderQuantityDay: {
    color: "#00796B",
    fontSize: 14,
    fontWeight: "500",
  },
  reminderQuantityNight: {
    color: "#BB86FC",
    fontSize: 14,
    fontWeight: "500",
  },
  statusLabelDay: {
    backgroundColor: "#D1C4E9",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
    marginTop: 5,
  },
  statusLabelNight: {
    backgroundColor: "#6200EA",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
    marginTop: 5,
  },
  noRemindersText: {
    color: "#9E9E9E",
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    fontWeight: "500",
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#FF4081",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  navigationBarDay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
  },
  navigationBarNight: {
    position: "absolute",
    bottom: 0,
    left: 0, 
    right: 0,
    height: 50,
    backgroundColor: "#162447",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
  },
  navButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  centralButtonDay: {
    position: "absolute",
    bottom: -15,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  centralButtonNight: {
    position: "absolute",
    bottom: -15,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
});
export default HomeScreen;