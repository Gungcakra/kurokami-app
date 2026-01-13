import React from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import DetailScreen from '../screens/Detail/DetailScreen';
import ChapterScreen from '../screens/Chapter/ChapterScreen';
import TabNavigator from './TabNavigator';
import SearchScreen from '../screens/Home/SearchScreen';
import AllScreen from '../screens/All/AllScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationDuration: 400,
        contentStyle: { backgroundColor: '#121215' },
        ...TransitionPresets.SlideFromRightIOS
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
          presentation: 'card',
          gestureResponseDistance: 500,
        }}
      />

      <Stack.Screen
        name="Read"
        component={ChapterScreen}
        options={{
          animation: 'simple_push',
          orientation: 'portrait',
          gestureResponseDistance: 500,
        }}
      />

      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          contentStyle: { backgroundColor: 'transparent' },
          cardOverlayEnabled: true,
          gestureResponseDistance: 500,
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}
      />

      <Stack.Screen
        name="All"
        component={AllScreen}
        options={{
          animation: 'slide_from_right',
          presentation: 'card',
          gestureResponseDistance: 500,
        }}
      />
    </Stack.Navigator>
  );
}