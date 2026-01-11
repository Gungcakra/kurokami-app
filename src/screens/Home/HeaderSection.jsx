
import { View, Text, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
const HeaderSection = ({ navigation }) => {
    return (
        <View className="py-6 px-4 mt-8 flex-row justify-between items-center">
            <Image source={require('../../../assets/logo.png')} className="w-10 h-10" />
            <Text className="text-2xl font-bold text-primary-400">Kurokami</Text>

            <TouchableOpacity className="p-2 bg-zinc-900/50 rounded-full border border-white/10" onPress={() => navigation.navigate('Search')}>
                <Ionicons name="search" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
}
export default HeaderSection;