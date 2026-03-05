import { Search } from 'lucide-react-native';
import React from 'react';
import { TextInput, View } from 'react-native';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export function SearchBar({ value, onChangeText, placeholder = 'Search textbooks, gear...' }: Props) {
  return (
    <View className="flex-row items-center bg-white rounded-full px-4 py-3 mx-4 mb-3" style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 }}>
      <Search size={18} color="#999999" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999999"
        className="flex-1 ml-2 text-[#1A1A1A] text-sm"
      />
    </View>
  );
}
