import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient'; // Pastikan sudah install ini

// Aktifkan LayoutAnimation untuk Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const InfoScreen = () => {
  const insets = useSafeAreaInsets();
  // State untuk menyimpan index mana yang sedang terbuka
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleCollapse = (index) => {
    // Animasi transisi smooth saat buka/tutup
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const infoItems = [
    { 
        icon: 'information-circle-outline', 
        title: 'About', 
        description: 'Learn more about our app mission', 
        content: 'This app is designed to provide the best user experience with high-performance animations and modern UI.',
        color: 'text-blue-400', 
        bg: 'bg-blue-400/10' 
    },
    { 
        icon: 'shield-checkmark-outline', 
        title: 'Privacy', 
        description: 'Your privacy and data security', 
        content: 'We do not sell your data. Everything is encrypted and stored securely following international standards.',
        color: 'text-emerald-400', 
        bg: 'bg-emerald-400/10' 
    },
    { 
        icon: 'file-document-outline', 
        title: 'Terms', 
        description: 'Terms and conditions of service', 
        content: 'By using this app, you agree to our terms of service and community guidelines.',
        color: 'text-amber-400', 
        bg: 'bg-amber-400/10' 
    },
    { 
        icon: 'heart-outline', 
        title: 'Support', 
        description: 'Get help and support from us', 
        content: 'Contact us via email at support@example.com or visit our help center 24/7.',
        color: 'text-red-500', 
        bg: 'bg-red-500/10' 
    },
  ];

  return (
    <View className="flex-1 bg-[#121215]">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        {/* HERO HEADER */}
        <View style={{ paddingTop: insets.top + 40 }} className="px-6 mb-10">
          <Animatable.View animation="fadeInLeft" duration={800}>
            <View className="bg-red-600 self-start px-3 py-1 rounded-md mb-4">
              <Text className="text-white text-[10px] font-black tracking-[2px]">APP INFO</Text>
            </View>
            
            <Text className="text-white text-4xl font-black leading-tight">
              Settings &{"\n"}Information
            </Text>
            <View className="flex-row items-center mt-2">
              <View className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
              <Text className="text-zinc-500 font-medium text-sm">Version 1.0.0 (Stable)</Text>
            </View>
          </Animatable.View>
        </View>

        {/* MENU SECTION WITH COLLAPSE */}
        <View className="px-6">
          {infoItems.map((item, index) => {
            const isExpanded = expandedIndex === index;
            
            return (
              <Animatable.View 
                key={index}
                animation="fadeInUp"
                delay={200 + (index * 100)}
                duration={600}
                className="mb-4"
              >
                <TouchableOpacity 
                  activeOpacity={0.7}
                  onPress={() => toggleCollapse(index)}
                  className={`bg-zinc-900/50 flex-row items-center p-5 rounded-[28px] border ${isExpanded ? 'border-red-500/50' : 'border-zinc-800'}`}
                >
                  <View className={`${item.bg} w-12 h-12 rounded-2xl items-center justify-center`}>
                    <Ionicons name={item.icon} size={24} className={item.color} color="currentColor" />
                  </View>

                  <View className="flex-1 ml-4">
                    <Text className="text-white text-lg font-bold">{item.title}</Text>
                    <Text className="text-zinc-500 text-xs mt-0.5">{item.description}</Text>
                  </View>

                  <Animatable.View 
                    transition="rotate"
                    style={{ transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] }}
                    className="bg-zinc-800 p-1.5 rounded-full"
                  >
                    <Ionicons name="chevron-forward" size={14} color="#71717A" />
                  </Animatable.View>
                </TouchableOpacity>

                {/* COLLAPSIBLE CONTENT */}
                {isExpanded && (
                  <View className="px-6 py-4 bg-zinc-900/30 mx-4 rounded-b-3xl border-x border-b border-zinc-800/50">
                    <Text className="text-zinc-400 text-sm leading-6">
                      {item.content}
                    </Text>
                  </View>
                )}
              </Animatable.View>
            );
          })}
        </View>

        {/* FOOTER */}
        <View className="mt-12 items-center px-10">
          <View className="w-12 h-[1px] bg-zinc-800 mb-6" />
          <Text className="text-zinc-600 text-[11px] text-center font-bold tracking-[1px] uppercase">
            Designed for the future of mobile experience
          </Text>
          <Text className="text-zinc-800 text-[10px] mt-2 font-medium">
            © 2026 GEMINI FLIGHT NAVIGATOR
          </Text>
        </View>
      </ScrollView>

      {/* FIXED GRADIENT OVERLAY */}
      <LinearGradient
        colors={['#121215', 'transparent']}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 100 }}
        pointerEvents="none"
      />
    </View>
  );
}

export default InfoScreen;