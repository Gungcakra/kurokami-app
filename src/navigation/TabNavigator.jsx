import React from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable'; 
import Ionicons from '@expo/vector-icons/Ionicons';

import HomeScreen from '../screens/Home/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import BookmarkScreen from '../screens/BookmarkScreen';
import HistoryScreen from '../screens/HistoryScreen';
import InfoScreen from '../screens/Info/InfoScreen';

const Tab = createBottomTabNavigator();

const TabButton = ({ focused, color, iconName, label }) => {
  const activeTextColor = '#FFFFFF'; 

  return (
    <View style={styles.buttonContainer}>
      {/* Glow Effect di belakang icon yang aktif */}
      {focused && (
        <Animatable.View 
          animation="zoomIn"
          duration={300}
          style={styles.activeIndicator}
        />
      )}

      <Animatable.View
        duration={400}
        transition={["translateY", "scale"]} 
        style={{
          transform: [
            { translateY: focused ? -4 : 0 },
            { scale: focused ? 1.1 : 1 }
          ],
          alignItems: 'center'
        }}
      >
        <Ionicons 
          name={iconName} 
          size={24} 
          color={focused ? '#EF4444' : '#71717A'} 
        />
        
        <View style={{ height: 16, marginTop: 2 }}>
          {focused && (
            <Animatable.View
              animation="fadeInUp" 
              duration={400}
              useNativeDriver
            >
              <Text style={[styles.label, { color: activeTextColor }]}>
                {label}
              </Text>
            </Animatable.View>
          )}
        </View>
      </Animatable.View>
    </View>
  );
};

export default function TabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#EF4444',
        tabBarInactiveTintColor: '#71717A',
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#121215', // Warna gelap pekat yang mewah
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          // Tinggi dinamis: 65 (base) + insets.bottom (jarak aman navigasi HP)
          height: 65 + insets.bottom, 
          paddingBottom: insets.bottom, 
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: '#27272A', // Garis atas sangat tipis
          elevation: 0,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabButton focused={focused} color={color} iconName={focused ? "home" : "home-outline"} label="Home" />
          )
        }} 
      />
      <Tab.Screen 
        name="Explore" 
        component={ExploreScreen} 
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabButton focused={focused} color={color} iconName={focused ? "compass" : "compass-outline"} label="Explore" />
          )
        }} 
      />
      <Tab.Screen 
        name="Bookmark" 
        component={BookmarkScreen} 
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabButton focused={focused} color={color} iconName={focused ? "bookmark" : "bookmark-outline"} label="Library" />
          )
        }} 
      />
      <Tab.Screen 
        name="History" 
        component={HistoryScreen} 
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabButton focused={focused} color={color} iconName={focused ? "time" : "time-outline"} label="History" />
          )
        }} 
      />

      <Tab.Screen 
        name="Information" 
        component={InfoScreen} 
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabButton focused={focused} color={color} iconName={focused ? "information-circle" : "information-circle-outline"} label="Information" />
          )
        }} 
      />
    </Tab.Navigator>
    
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 65,
    marginTop: 5,
  },
  label: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  activeIndicator: {
    position: 'absolute',
    top: -8,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
  }
});