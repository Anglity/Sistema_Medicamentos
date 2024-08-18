import React from "react";
import Swiper from "react-native-swiper/src";
import WelcomeScreen from "./WelcomeScreen";
import LoginOrRegisterScreen from "./LoginOrRegisterScreen";
import HomeScreen from "./HomeScreen";

export default function StartScreen() {
  return (
    <Swiper
      style={{ backgroundColor: "white" }}
      showsButtons={false}
      loop={false}
      dotColor="#D8FFF8"
      activeDotColor="#05B494"
      activeDotStyle={{ width: 29 }}
    >
      <WelcomeScreen />
      <LoginOrRegisterScreen />
      {/* <HomeScreen /> */}
    </Swiper>
  );
}
