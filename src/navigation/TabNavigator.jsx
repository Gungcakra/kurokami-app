import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Ionicons from '@expo/vector-icons/Ionicons';

// Import Screens (Pastikan path sesuai dengan struktur folder kamu)
import HomeScreen from '../screens/Home/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import BookmarkScreen from '../screens/BookmarkScreen';
import HistoryScreen from '../screens/HistoryScreen';
import InfoScreen from '../screens/Info/InfoScreen';

const Tab = createBottomTabNavigator();
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TAB_COUNT = 5;
const SLIDER_WIDTH = SCREEN_WIDTH / TAB_COUNT;

// const slowTransitionSpec = {
//   // Gunakan objek konfigurasi yang dikenali oleh React Navigation
//   open: {
//     animation: 'spring',
//     config: {
//       stiffness: 100, // Semakin rendah semakin lambat
//       damping: 20,
//       mass: 1,
//     },
//   },
//   close: {
//     animation: 'spring',
//     config: {
//       stiffness: 100,
//       damping: 20,
//       mass: 1,
//     },
//   },
// };
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
      {/* Container Icon */}
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
        <Text 
          numberOfLines={1} 
          adjustsFontSizeToFit 
          style={[styles.label, { color: activeColor }]}
        >
          {label}
        </Text>
      </Animated.View>
    </View>
  );
};

export default function TabNavigator() {
  const insets = useSafeAreaInsets();
  const activeIndexAnim = useRef(new Animated.Value(0)).current;

  const handleTabPress = (index, props) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    Animated.spring(activeIndexAnim, {
      toValue: index,
      useNativeDriver: true,
      bounciness: 5,
      speed: 12,
    }).start();

    if (props.onPress) props.onPress();
  };

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
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          animation: 'shift',
          freezeOnBlur: false,
          gestureEnabled: true,
          sceneStyle: { backgroundColor: '#121215' },
          tabBarStyle: [
            styles.tabBar, 
            { height: 65 + insets.bottom, paddingBottom: insets.bottom }
          ],
        }}
      >
        {tabs.map((item, index) => (
          <Tab.Screen 
            key={item.name}
            name={item.name} 
            component={item.component} 
            options={{
              tabBarIcon: () => (
                <TabButton 
                    index={index} 
                    activeIndexAnim={activeIndexAnim} 
                    iconName={item.icon} 
                    label={item.label} 
                />
              ),
              tabBarButton: (props) => (
                <Pressable 
                  {...props} 
                  style={styles.tabBarBtn} 
                  onPress={() => handleTabPress(index, props)} 
                />
              )
            }} 
          />
        ))}
      </Tab.Navigator>

      {/* Slider Kotak Aktif */}
      <Animated.View 
        style={[
          styles.slider, 
          { 
            width: SLIDER_WIDTH,
            transform: [{ 
                translateX: activeIndexAnim.interpolate({
                    inputRange: [0, TAB_COUNT - 1],
                    outputRange: [0, (TAB_COUNT - 1) * SLIDER_WIDTH]
                }) 
            }],
            bottom: insets.bottom + 10,
          }
        ]} 
        pointerEvents="none"
      >
        <View style={styles.sliderInner} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#121215',
    position: 'absolute',
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
    height: '100%',
  },
  labelContainer: {
    position: 'absolute',
    bottom: 1,
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