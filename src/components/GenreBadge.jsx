import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const GenreBadge = ({ navigation, genre }) => {
  return (
    <View>
      <TouchableOpacity onPress={() => {navigation.navigate('Explore', { genre:genre })}} className="bg-gray-800 px-4 py-1 rounded-full mr-2 mb-3 border border-primary-600">
        <Text className="text-white text-lg font-semibold">{genre}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GenreBadge;
