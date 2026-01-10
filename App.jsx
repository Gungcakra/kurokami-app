import "./src/styles/global.css"; // WAJIB: Import CSS di baris pertama
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <SafeAreaProvider>
      {/* StatusBar disesuaikan dengan tema Dark Mode kamu */}
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#1A1A1F" // Sesuai --bg-primary
      />
      
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;