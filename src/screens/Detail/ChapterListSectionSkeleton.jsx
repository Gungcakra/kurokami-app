import React from 'react';
import { View, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';

const ChapterListSectionSkeleton = () => {
    return (
        <Animatable.View animation="fadeInUp" className="px-6 bg-zinc-bg mb-6">
            <View className="flex-row gap-2 mb-6">
                <View className="flex-1 flex-row items-center bg-zinc-soft rounded-2xl px-4 border border-zinc-border">
                    <View className="w-6 h-6 bg-zinc-muted rounded-full" />
                    <View className="flex-1 ml-2 h-12 bg-zinc-muted rounded" />
                </View>
            </View>
        </Animatable.View>
    );
};

export default ChapterListSectionSkeleton;