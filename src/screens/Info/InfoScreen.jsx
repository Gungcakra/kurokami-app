import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const InfoScreen = () => {
  const insets = useSafeAreaInsets();
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleCollapse = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const infoItems = [
    { 
        icon: 'book-outline', 
        title: 'Project Mission', 
        description: 'Visi dibalik platform kurokami', 
        content: 'Kurokami dibangun untuk memberikan akses baca manhwa tercepat dengan kualitas gambar HD tanpa beban iklan yang mengganggu kenyamanan scrolling.',
        color: '#60A5FA', 
        bg: 'bg-blue-500/10' 
    },
    { 
        icon: 'shield-half-outline', 
        title: 'Data & Privacy', 
        description: 'Keamanan library & riwayat baca', 
        content: 'Data bookmark dan riwayat baca kamu disimpan secara lokal dan terenkripsi. Kami tidak mengumpulkan data pribadi di luar kebutuhan sinkronisasi akun.',
        color: '#34D399', 
        bg: 'bg-emerald-500/10' 
    },
    { 
        icon: 'Skull-outline', 
        title: 'Community Rules', 
        description: 'Pedoman komentar & interaksi', 
        content: 'Dilarang melakukan spoiler di kolom komentar, spamming, atau promosi platform ilegal lainnya. Mari jaga komunitas tetap sehat.',
        color: '#FBBF24', 
        bg: 'bg-amber-500/10' 
    },
    { 
        icon: 'cafe-outline', 
        title: 'Support Dev', 
        description: 'Bantu kami tetap hidup', 
        content: 'Aplikasi ini dikelola secara independen. Kamu bisa mendukung server kami melalui donasi di menu "Buy Me a Coffee" agar update tetap lancar.',
        color: '#EF4444', 
        bg: 'bg-red-500/10' 
    },
  ];

  return (
    <View className="flex-1 bg-[#0F0F12]">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        {/* HERO HEADER */}
        <View style={{ paddingTop: insets.top + 50 }} className="px-8 mb-12">
          <Animatable.View animation="fadeIn" duration={1000}>
            <View className="flex-row items-center mb-4">
              <View className="h-[2px] w-8 bg-red-600 mr-3" />
              <Text className="text-red-600 text-[12px] font-black tracking-[3px] uppercase">
                Application Info
              </Text>
            </View>
            
            <Text className="text-white text-5xl font-black tracking-tighter leading-[48px]">
              Informasi{"\n"}<Text className="text-zinc-700">Aplikasi.</Text>
            </Text>
            
            <View className="flex-row items-center mt-6 bg-zinc-900/50 self-start px-4 py-2 rounded-full border border-white/5">
              <View className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
              <Text className="text-zinc-400 font-bold text-xs">V.1.0.1 Stable Build</Text>
            </View>
          </Animatable.View>
        </View>

        {/* MENU SECTION */}
        <View className="px-6">
          {infoItems.map((item, index) => {
            const isExpanded = expandedIndex === index;
            
            return (
              <Animatable.View 
                key={index}
                animation="fadeInUp"
                delay={index * 100}
                className="mb-4"
              >
                <TouchableOpacity 
                  activeOpacity={0.8}
                  onPress={() => toggleCollapse(index)}
                  className={`bg-zinc-900/40 flex-row items-center p-5 rounded-[32px] border ${isExpanded ? 'border-red-600/40 bg-zinc-900/80' : 'border-white/[0.03]'}`}
                >
                  <View className={`${item.bg} w-14 h-14 rounded-2xl items-center justify-center border border-white/5`}>
                    <Ionicons name={item.icon} size={28} color={item.color} />
                  </View>

                  <View className="flex-1 ml-5">
                    <Text className="text-white text-[17px] font-black tracking-tight">{item.title}</Text>
                    <Text className="text-zinc-500 text-[13px] font-medium mt-0.5">{item.description}</Text>
                  </View>

                  <View className={`${isExpanded ? 'bg-red-600' : 'bg-zinc-800'} p-2 rounded-xl`}>
                    <Ionicons 
                      name={isExpanded ? "chevron-up" : "chevron-forward"} 
                      size={16} 
                      color={isExpanded ? "white" : "#A1A1AA"} 
                    />
                  </View>
                </TouchableOpacity>

                {isExpanded && (
                  <Animatable.View 
                    animation="fadeIn"
                    className="px-8 py-6 bg-zinc-900/20 mx-4 rounded-b-[32px] border-x border-b border-white/[0.03]"
                  >
                    <Text className="text-white text-sm leading-7 font-medium">
                      {item.content}
                    </Text>
                  </Animatable.View>
                )}
              </Animatable.View>
            );
          })}
        </View>

        {/* FOOTER */}
        <View className="mt-20 items-center px-12">
          <Text className="text-zinc-700 text-[10px] text-center font-black tracking-[4px] uppercase mb-4">
            Kurokami
          </Text>
          <View className="flex-row items-center">
             <View className="h-[1px] flex-1 bg-zinc-900" />
             <Ionicons name="flash" size={14} color="#3F3F46" className="mx-4" />
             <View className="h-[1px] flex-1 bg-zinc-900" />
          </View>
          <Text className="text-zinc-800 text-[11px] mt-6 font-bold">
            BUILD REPOSITORY 2026-X1
          </Text>
        </View>
      </ScrollView>

      {/* BOTTOM GRADIENT MASK */}
      <LinearGradient
        colors={['transparent', '#0F0F12']}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 150 }}
        pointerEvents="none"
      />
    </View>
  );
}

export default InfoScreen;