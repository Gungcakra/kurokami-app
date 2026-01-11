import { View, Text, FlatList } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import ManhwaCard from '../../components/ManhwaCard';
import ManhwaCardSkeleton from '../../components/ManhwaCardSkeleton';
import { useManhwa } from '../../hooks/home';
const NewUpdateSection = ({ navigation }) => {
    const { newUpdates, loading, error } = useManhwa();
    return (
        <View className="mt-8">
            <View className="flex-row justify-between items-end mb-4">
                <Text className="text-zinc-text text-2xl font-bold">  Update Terbaru</Text>
                <Text className="text-primary-400 text-lg font-semibold">Semua</Text>
            </View>

            {error ? (
                <Text className="text-zinc-text">Terjadi kesalahan: {error.message}</Text>
            ) : loading ? (
                <FlatList
                    data={Array.from({ length: 9 })}
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
                    data={newUpdates?.slice(0, 9)}
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