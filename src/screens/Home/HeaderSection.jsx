import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HeaderSection = ({ navigation }) => {
    const insets = useSafeAreaInsets();

    return (
        /* Menggunakan position absolute agar melayang di atas ScrollView */
        <View 
            style={{ paddingTop: insets.top + 10 }}
            className="absolute top-0 left-0 right-0 z-50 flex-row justify-between items-center px-6 pb-4 bg-[#121215] backdrop-blur-md border-b border-white/5"
        >
            <View className="flex-row items-center gap-3">
                <Image source={require('../../../assets/logo.png')} className="w-10 h-10" />
                <Text className="text-2xl font-black text-white tracking-tighter">
                    <Text className="text-red-600">Kurokami</Text>
                </Text>
            </View>

            <TouchableOpacity 
                className="p-2.5 bg-zinc-800/50 rounded-2xl border border-white/10" 
                onPress={() => navigation.navigate('Search')}
            >
                <Ionicons name="search" size={22} color="white" />
            </TouchableOpacity>
        </View>
    );
}

export default HeaderSection;