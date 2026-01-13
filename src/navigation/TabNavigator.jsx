import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions } from 'react-native';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Ionicons from '@expo/vector-icons/Ionicons';

import HomeScreen from '../screens/Home/HomeScreen';
import ExploreScreen from '../screens/Explore/ExploreScreen';
import BookmarkScreen from '../screens/BookmarkScreen';
import HistoryScreen from '../screens/HistoryScreen';
import InfoScreen from '../screens/Info/InfoScreen';

const Tab = createMaterialTopTabNavigator();
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TAB_COUNT = 5;
const SLIDER_WIDTH = SCREEN_WIDTH / TAB_COUNT;

const TabButton = ({ index, activeIndexAnim, iconName, label }) => {
  const activeColor = '#EF4444';
  const inactiveColor = '#71717A';

  const translateYIcon = activeIndexAnim.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [0, -12, 0],
    extrapolate: 'clamp',
  });

  const translateYText = activeIndexAnim.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [15, 0, 15],
    extrapolate: 'clamp',
  });

  const opacityText = activeIndexAnim.interpolate({
    inputRange: [index - 0.5, index, index + 0.5],
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.buttonContent}>
      <Animated.View style={{ transform: [{ translateY: translateYIcon }] }}>
        <View>
          <Ionicons name={iconName} size={22} color={inactiveColor} />
          <Animated.View style={[StyleSheet.absoluteFill, { opacity: opacityText }]}>
            <Ionicons name={iconName.replace('-outline', '')} size={22} color={activeColor} />
          </Animated.View>
        </View>
      </Animated.View>

      <Animated.View 
        style={[
          styles.labelContainer, 
          { 
            opacity: opacityText,
            transform: [{ translateY: translateYText }] 
          }
        ]}
      >
        <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.label, { color: activeColor }]}>
          {label}
        </Text>
      </Animated.View>
    </View>
  );
};

export default function TabNavigator() {
  const insets = useSafeAreaInsets();
  const positionAnim = useRef(new Animated.Value(0)).current;

  const tabs = [
    { name: 'Home', icon: 'home-outline', label: 'Home', component: HomeScreen },
    { name: 'Explore', icon: 'compass-outline', label: 'Explore', component: ExploreScreen },
    { name: 'Bookmark', icon: 'bookmark-outline', label: 'Library', component: BookmarkScreen },
    { name: 'History', icon: 'time-outline', label: 'History', component: HistoryScreen },
    { name: 'Info', icon: 'information-circle-outline', label: 'Info', component: InfoScreen },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#121215' }}>
      <Tab.Navigator
        tabBarPosition="bottom" 
        screenOptions={{
          swipeEnabled: true,
          animationEnabled: true,
        }}
        tabBar={({ state, descriptors, navigation, position }) => {
          useEffect(() => {
            positionAnim.setValue(state.index);
          }, [state.index]);

          return (
            <View style={[styles.tabBar, { height: 65 + insets.bottom, paddingBottom: insets.bottom }]}>
              <Animated.View 
                style={[
                  styles.slider, 
                  { 
                    width: SLIDER_WIDTH,
                    transform: [{ 
                        translateX: position.interpolate({
                            inputRange: [0, TAB_COUNT - 1],
                            outputRange: [0, (TAB_COUNT - 1) * SLIDER_WIDTH]
                        }) 
                    }],
                    bottom: insets.bottom + 10,
                  }
                ]} 
              >
                <View style={styles.sliderInner} />
              </Animated.View>

              {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;

                const onPress = () => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                  if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                  }
                };

                return (
                  <Pressable
                    key={route.key}
                    onPress={onPress}
                    style={styles.tabBarBtn}
                  >
                    <TabButton 
                        index={index} 
                        activeIndexAnim={position} 
                        iconName={tabs[index].icon} 
                        label={tabs[index].label} 
                    />
                  </Pressable>
                );
              })}
            </View>
          );
        }}
      >
        {tabs.map((item) => (
          <Tab.Screen key={item.name} name={item.name} component={item.component} />
        ))}
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#121215',
    position: 'absolute',
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: '#27272A',
    width: '100%',
    elevation: 0,
  },
  tabBarBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: SLIDER_WIDTH,
    height: 65,
  },
  labelContainer: {
    position: 'absolute',
    bottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  label: {
    fontSize: 8.5, 
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  slider: {
    position: 'absolute',
    height: 50, 
    zIndex: 0, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderInner: {
    width: '85%',
    height: '100%',
    backgroundColor: 'rgba(239, 68, 68, 0.12)', 
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  }
});