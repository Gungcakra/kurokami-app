import "./src/styles/global.css"; // WAJIB: Import CSS di baris pertama
import React from 'react';
import { StatusBar } from 'react-native';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { Platform, UIManager } from 'react-native';
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import 'react-native-gesture-handler';
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const styles = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#1A1A1F',
  },
};
const App = () => {
  useEffect(() => {
    SystemUI.setBackgroundColorAsync("#1A1A1F");
  }, []);
  return (
    <SafeAreaProvider>
    
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#1A1A1F" 
      />
      
      <NavigationContainer theme={styles}>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;