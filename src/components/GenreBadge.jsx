import React from 'react';
import { Text, View } from 'react-native';

const GenreBadge = ({ genre }) => {
    return (
        <View className="bg-gray-800 px-4 py-1 rounded-full mr-2 mb-3 border border-primary-600">
            <Text className="text-white text-lg font-semibold">{genre}</Text>
        </View>
    );
}

export default GenreBadge;