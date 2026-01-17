import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../screens/WelcomeScreen";
import DetailScreen from "../screens/Detail/DetailScreen";
import ChapterScreen from "../screens/Chapter/ChapterScreen";
import TabNavigator from "./TabNavigator";
import SearchScreen from "../screens/Home/SearchScreen";
import AllScreen from "../screens/All/AllScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#121215" },
        // MENONAKTIFKAN ANIMASI SECARA GLOBAL
        animation: "none",
        // Mengurangi beban render screen yang sedang tidak aktif
        freezeOnBlur: true,
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="Detail" component={DetailScreen} />
      <Stack.Screen name="Read" component={ChapterScreen} />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          animation: "slide_from_bottom", 
        }}
      />
      <Stack.Screen name="All" component={AllScreen} />
    </Stack.Navigator>
  );
}
