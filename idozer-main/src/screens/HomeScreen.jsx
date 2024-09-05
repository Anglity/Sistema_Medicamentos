import React, { useState, useEffect } from "react";
import { StyleSheet, View, ActivityIndicator, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Text, Button, IconButton, Menu, Divider, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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

  const getIcon = (nombre) => {
    switch (nombre) {
      case 'Comprimido':
        return 'pill'; 
      case 'Cápsula':
        return 'capsule'; 
      default:
        return 'pill'; 
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

  const navigateToProfile = () => {
    navigation.navigate("Profile");
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
            <ReminderCard item={item} />
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.noRemindersAnimation}>
          <MaterialCommunityIcons 
            name="emoticon-sad-outline" 
            size={100} 
            color="#FFB300" 
          />
          <Text style={isDayTime ? styles.noRemindersText : styles.noRemindersTextNight}>
            No hay recordatorios para hoy
          </Text>
        </View>
      )}
    </View>
  )}
</ScrollView>


      <BottomNavigationBar 
        isDayTime={isDayTime} 
        toggleTheme={toggleTheme} 
        navigateToNewReminder={navigateToNewReminder} 
        navigateToProfile={navigateToProfile}
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

const ReminderCard = ({ item }) => {
  return (
    <View style={styles.reminderCard}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons 
          name={item.iconAction === 'Cápsula' ? 'capsule' : 'pill'} 
          size={24} 
          color="#fff" 
        />
      </View>
      <View style={styles.reminderDetails}>
        <Text style={styles.reminderTitle}>{item.titulo}</Text>
        <Text style={styles.reminderSubtitle}>{item.cantidadMedicamentos} {item.iconAction}, {item.dosagem}</Text>
      </View>
      <View style={styles.timeContainer}>
        <Text style={styles.reminderTime}>{item.horario}</Text>
      </View>
    </View>
  );
};

const dayPickerStyles = StyleSheet.create({
  container: {
    backgroundColor: "#FAFAFA",
    padding: 10,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 12,
  },
  containerNight: {
    backgroundColor: "#333344",
    padding: 10,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4A4A4A",
    fontFamily: "sans-serif", // Usamos una fuente predeterminada
  },
  headerTextNight: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "sans-serif",
  },
  monthButton: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DADADA",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#FFFFFF",
  },
  monthButtonNight: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#666666",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#444455",
  },
  monthButtonText: {
    color: "#4A4A4A",
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "sans-serif",
  },
  monthButtonTextNight: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "sans-serif",
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
    paddingVertical: 5,
    paddingHorizontal: 7,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
  },
  selectedDayButton: {
    backgroundColor: "#5CDB95",
    borderRadius: 10,
  },
  selectedDayButtonNight: {
    backgroundColor: "#FF6F61",
    borderRadius: 10,
  },
  dayText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "sans-serif", // Cambiamos aquí también
    color: "#4A4A4A",
  },
  dateText: {
    fontSize: 12,
    marginTop: 2,
    color: "#757575",
    fontFamily: "sans-serif",
  },
  selectedDayText: {
    color: "#FFFFFF",
    fontFamily: "sans-serif", // Fuente predeterminada
  },
  selectedDayTextNight: {
    color: "#000000",
    fontFamily: "sans-serif",
  },
  defaultDayText: {
    color: "#4A4A4A",
    fontFamily: "sans-serif",
  },
  defaultDayTextNight: {
    color: "#CCCCCC",
    fontFamily: "sans-serif",
  },
});


const styles = StyleSheet.create({
  containerDay: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    paddingTop: 20, 
    paddingHorizontal: 8, 
  },
  containerNight: {
    flex: 1,
    backgroundColor: "#1A1A2E",
    paddingTop: 20, 
    paddingHorizontal: 8, 
  },
  headerDiv: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8, 
  },
  appTitleDay: {
    color: "#00796B",
    fontSize: 24, // Mejoramos el tamaño de la fuente
    fontWeight: "700",
    fontFamily: "HelveticaNeue-Medium", // Cambiamos la fuente para mejorar legibilidad
  },
  appTitleNight: {
    color: "#BB86FC",
    fontSize: 24, 
    fontWeight: "700",
    fontFamily: "HelveticaNeue-Medium", 
  },
  iconButton: {
    backgroundColor: "#E0E0E0",
    borderRadius: 20,
    padding: 3, 
  },
  content: {
    flex: 1,
  },
  sectionTitleDay: {
    color: "#424242",
    fontSize: 18, 
    fontWeight: "600",
    fontFamily: "HelveticaNeue-Light", // Nueva tipografía para subtítulos
    marginBottom: 8, 
  },
  sectionTitleNight: {
    color: "#FFFFFF",
    fontSize: 18, 
    fontWeight: "600",
    fontFamily: "HelveticaNeue-Light", 
    marginBottom: 8, 
  },
  reminderList: {
    marginTop: 8, 
  },
  // Tarjeta de recordatorio compacta
  reminderCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10, 
    paddingHorizontal: 12, 
    marginVertical: 8, 
    borderRadius: 8, 
    elevation: 1, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.1,
    shadowRadius: 4, 
  },
  iconContainer: {
    backgroundColor: "#FFB300", 
    padding: 8, 
    borderRadius: 20, 
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10, 
  },
  reminderDetails: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16, // Mejora en el tamaño del texto del título
    fontWeight: "bold",
    color: "#333",
    fontFamily: "HelveticaNeue-Bold", // Usamos una tipografía más moderna y legible
  },
  reminderSubtitle: {
    fontSize: 13, // Ajuste de la fuente del subtítulo
    color: "#666",
    marginTop: 2, 
    fontFamily: "HelveticaNeue-Light", 
  },
  timeContainer: {
    backgroundColor: "#1976D2", 
    borderRadius: 6, 
    paddingHorizontal: 10, 
    paddingVertical: 3, 
    justifyContent: "center",
    alignItems: "center",
  },
  reminderTime: {
    fontSize: 14, 
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "HelveticaNeue-Bold", // Nueva fuente para la hora
  },
  noRemindersAnimation: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  noRemindersText: {
    color: "#9E9E9E",
    textAlign: "center",
    marginTop: 20, 
    fontSize: 14, 
    fontWeight: "500",
    fontFamily: "HelveticaNeue-Light", 
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
