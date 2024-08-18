import React from "react";
import { Text, StyleSheet } from "react-native";

export const ThinText = ({ texto, size, color }) => {
  return (
    <Text
      style={{
        fontFamily: "thin",
        fontSize: size ? size : 15,
        color: color ? color : "black",
      }}
    >
      {texto}
    </Text>
  );
};

export const RegularText = ({ texto, size, color }) => {
  return (
    <Text
      style={{
        fontFamily: "regular",
        fontSize: size ? size : 15,
        color: color ? color : "black",
      }}
    >
      {texto}
    </Text>
  );
};

export const MediumText = ({ texto, size, color }) => {
  return (
    <Text
      style={{
        fontFamily: "medium",
        fontSize: size ? size : 15,
        color: color ? color : "black",
      }}
    >
      {texto}
    </Text>
  );
};

export const LightText = ({ texto, size, color }) => {
  return (
    <Text
      style={{
        fontFamily: "light",
        fontSize: size ? size : 15,
        color: color ? color : "black",
      }}
    >
      {texto}
    </Text>
  );
};

export const BoldText = ({ texto, size, color }) => {
  return (
    <Text
      style={{
        fontFamily: "bold",
        fontSize: size ? size : 15,
        color: color ? color : "black",
      }}
    >
      {texto}
    </Text>
  );
};

export const BoldTextLink = ({ texto, size, color }) => {
  return (
    <Text
      style={{
        fontFamily: "bold",
        fontSize: size ? size : 15,
        color: color ? color : "black",
        textDecorationLine: "underline",
      }}
    >
      {texto}
    </Text>
  );
};
