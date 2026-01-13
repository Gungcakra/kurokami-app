import 'react-native-gesture-handler'; // PINDAH KE BARIS 1
import "./src/styles/global.css"; 
import React, { useEffect } from 'react';
import { StatusBar, Platform, UIManager } from 'react-native';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // IMPORT INI
import AppNavigator from './src/navigation/AppNavigator';
import * as SystemUI from "expo-system-ui";

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
    // Bungkus dengan GestureHandlerRootView agar gestur dikenali
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar 
          barStyle="light-content" // Diubah ke light karena background gelap
          backgroundColor="#1A1A1F" 
        />
        
        <NavigationContainer theme={styles}>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;