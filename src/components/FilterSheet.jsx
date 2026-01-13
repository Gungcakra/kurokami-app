import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export const FilterSheet = ({ visible, onClose, filters, updateFilter, genres, statuses, formats }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    if (visible) {
      setLocalFilters(filters);
    }
  }, [visible, filters]);

  const handleUpdateLocal = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClear = () => {
    setLocalFilters({
      ...localFilters,
      genres: [],
      status: '',
      format: 'all', 
    });
  };

  const handleApply = () => {
    Object.keys(localFilters).forEach(key => {
      updateFilter(key, localFilters[key]);
    });
    onClose();
  };

  const Section = ({ title, children }) => (
    <View className="mb-6">
      <Text className="text-zinc-500 text-[10px] font-black uppercase tracking-[2px] mb-3">{title}</Text>
      <View className="flex-row flex-wrap">{children}</View>
    </View>
  );

  const Chip = ({ label, isActive, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`mr-2 mb-2 px-5 py-2.5 rounded-2xl border ${
        isActive ? 'bg-red-600 border-red-600' : 'bg-zinc-soft border-zinc-border'
      }`}
    >
      <Text className={`font-bold capitalize ${isActive ? 'text-white' : 'text-zinc-muted'}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end bg-black/60">
        <View className="bg-zinc-bg rounded-t-[40px] p-8 h-[85%] border-t border-white/10">
          
          {/* Header */}
          <View className="flex-row justify-between items-center mb-8">
            <View>
              <Text className="text-white text-2xl font-black tracking-tighter">Filter</Text>
              <TouchableOpacity onPress={handleClear} className="mt-1">
                <Text className="text-white bg-primary-500 px-2 py-1 rounded text-xs font-bold uppercase tracking-widest">Reset</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={onClose} className="bg-zinc-soft p-2 rounded-full">
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            {/* Format */}
            <Section title="Format">
              {formats.map(f => (
                <Chip 
                  key={f} 
                  label={f} 
                  isActive={localFilters.format === f} 
                  onPress={() => handleUpdateLocal('format', f)} 
                />
              ))}
            </Section>

            {/* Status */}
            <Section title="Status">
              {statuses.map(s => (
                <Chip 
                  key={s.value} 
                  label={s.label} 
                  isActive={localFilters.status === s.value} 
                  onPress={() => handleUpdateLocal('status', s.value)} 
                />
              ))}
            </Section>

            {/* Genres */}
            <Section title="Genres">
              {genres.map(g => {
                const isSel = localFilters.genres.includes(g.name);
                return (
                  <Chip
                    key={g.id}
                    label={g.name}
                    isActive={isSel}
                    onPress={() => {
                      const newGenres = isSel 
                        ? localFilters.genres.filter(i => i !== g.name) 
                        : [...localFilters.genres, g.name];
                      handleUpdateLocal('genres', newGenres);
                    }}
                  />
                );
              })}
            </Section>
          </ScrollView>

          {/* Action Button */}
          <View className="py-4">
            <TouchableOpacity 
              onPress={handleApply}
              className="bg-red-600 py-4 rounded-[20px] items-center shadow-xl shadow-red-600/40"
            >
              <Text className="text-white font-black italic text-lg">Terapkan Filter</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </View>
    </Modal>
  );
};