import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import StartScreen from "./screens/StartScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import NewReminder from "./screens/NewReminder";
import EditReminder from "./screens/EditReminder";
import HomeScreen from "./screens/HomeScreen";
import HappyScreen from "./screens/HappyScreen";
import ProfileScreen from "./screens/ProfileScreen"; // Importa ProfileScreen

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen
          name="Start"
          component={StartScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NewReminder"
          component={NewReminder}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditReminder"
          component={EditReminder}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Happy"
          component={HappyScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen} // Agrega ProfileScreen aquí
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
