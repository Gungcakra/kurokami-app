import React, { useEffect, useState } from "react";
import { View, Text, Image, StatusBar } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import Animated, {
  FadeInUp,
  FadeInDown,
  ZoomIn,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import Alert from "../components/Alert";
import Constants from 'expo-constants';
const WelcomeScreen = ({ navigation }) => {
  // 1. Deklarasi State harus di level paling atas
  const [showAlert, setShowAlert] = useState({
    show: false,
    title: "",
    message: "",
    type: "",
  });
  const version = Constants.expoConfig?.version || '1.0.0';
  const checkConnectionAndNavigate = async () => {
    // Tunggu animasi splash screen selesai
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const state = await NetInfo.fetch();
    
    // Cek koneksi
    if (state.isConnected && state.isInternetReachable !== false) {
      navigation.replace("Main");
    } else {
      setShowAlert({
        show: true,
        title: "Koneksi Terputus",
        message: "Aplikasi membutuhkan internet. Periksa koneksi Anda dan coba lagi.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    checkConnectionAndNavigate();
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: withRepeat(
      withSequence(
        withTiming(0.8, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    ),
  }));

  return (
    <View className="flex-1 bg-[#0F0F12] items-center justify-center">
      <StatusBar barStyle="light-content" backgroundColor="#0F0F12" />

      <Animated.View
        entering={ZoomIn.duration(1000).springify()}
        style={[pulseStyle]}
        className="relative"
      >
        <View className="w-40 h-40 items-center justify-center overflow-hidden">
          <Image
            source={require("../../assets/logo.png")}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>
      </Animated.View>

      <View className="items-center mt-10">
        <Animated.View entering={FadeInUp.delay(500).duration(1000)}>
          <Text className="text-white text-4xl font-black tracking-[8px] italic uppercase">
            KUROKAMI
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(800).duration(1000)}>
          <View className="flex-row items-center mt-2">
            <View className="h-[1px] w-8 bg-zinc-800" />
            <Text className="text-zinc-600 mx-3 text-[10px] font-black tracking-[4px] uppercase">
              Manhwa Reader
            </Text>
            <View className="h-[1px] w-8 bg-zinc-800" />
          </View>
        </Animated.View>
      </View>

      <Animated.View
        entering={FadeInDown.delay(1200)}
        className="absolute bottom-12"
      >
        <Text className="text-white text-[10px] font-bold tracking-widest">
          V {version}
        </Text>
      </Animated.View>

      <Alert 
        showAlert={showAlert} 
        setShowAlert={setShowAlert} 
        onConfirm={() => checkConnectionAndNavigate()} 
      />
    </View>
  );
};

export default WelcomeScreen;