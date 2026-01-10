import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import DetailScreen from '../screens/Detail/DetailScreen';
import ChapterScreen from '../screens/Chapter/ChapterScreen';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator className="bg-zinc-bg"
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
        animationDuration: 300,
        contentStyle: { backgroundColor: '#121215' }
      }}
    >
    
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ animation: 'fade' }}
      />

      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{ animation: 'fade' }}
      />

      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}
      />

      <Stack.Screen
        name="Read"
        component={ChapterScreen}
        options={{
          animation: 'simple_push', 
          orientation: 'portrait',
        }}
      />
    </Stack.Navigator>
  );
}