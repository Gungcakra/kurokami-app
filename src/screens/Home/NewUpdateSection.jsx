import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import ManhwaCard from '../../components/ManhwaCard';
import ManhwaCardSkeleton from '../../components/ManhwaCardSkeleton';
import { useUpdate } from '../../hooks/home';
import { useState } from 'react';
const NewUpdateSection = ({ navigation }) => {

    const [selectedType, setSelectedType] = useState('all');
    const { newUpdates, loading, error } = useUpdate(selectedType);

    const filterButtons = [
        { label: 'Semua', value: 'all' },
        { label: 'Manhwa', value: 'manhwa' },
        { label: 'Manhua', value: 'manhua' },
        { label: 'Manga', value: 'manga' },
    ];

    return (
        <View className="mt-8">
            <View className="flex-row justify-between items-end mb-4">
                <View>
                    <Text className="text-white text-2xl font-bold tracking-tighter">Update Terbaru</Text>
                    <View className="h-1 w-8 bg-primary-600 rounded-full mt-1" />
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('All', { type:  'new-update'})} className="pb-1">
                <Text className="text-primary-400 text-lg font-semibold">Semua</Text>
                </TouchableOpacity>
            </View>

            <View className="flex-row gap-2 mb-4">
                {filterButtons.map((btn) => (
                    <Text
                        key={btn.value}
                        onPress={() => setSelectedType(btn.value)}
                        className={`px-4 py-2 rounded-lg font-semibold ${selectedType === btn.value
                                ? 'bg-primary-600 text-white'
                                : 'bg-zinc-800 text-zinc-400'
                            }`}
                    >
                        {btn.label}
                    </Text>
                ))}
            </View>

            {error ? (
                <Text className="text-zinc-text">Terjadi kesalahan: {error.message}</Text>
            ) : loading ? (
                <FlatList
                    data={newUpdates || Array.from({ length: 9 })}
                    renderItem={() => (
                        <ManhwaCardSkeleton />
                    )}
                    keyExtractor={(_, index) => `skeleton-${index}`}
                    numColumns={3}
                    scrollEnabled={false}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                />
            ) : (
                <FlatList
                    data={newUpdates?.slice(0, 15)}
                    renderItem={({ item }) => (
                        <ManhwaCard
                            item={item}
                            isNew={true}
                            onPress={() => navigation.navigate('Detail', { id: item.manga_id })}
                        />
                    )}
                    keyExtractor={(item, index) => `${item.manga_id}-${index}`}
                    numColumns={3}
                    scrollEnabled={false}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    maxToRenderPerBatch={9}
                />
            )}
        </View>
    );
}

export default NewUpdateSection;