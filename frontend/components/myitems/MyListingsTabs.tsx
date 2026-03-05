import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type Tab = 'active' | 'sold';

type Props = {
  active: Tab;
  onChange: (tab: Tab) => void;
};

export function MyListingsTabs({ active, onChange }: Props) {
  return (
    <View className="bg-[#00654E] pb-4 px-4">
      <View className="flex-row bg-white/20 rounded-full p-1">
        {(['active', 'sold'] as Tab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => onChange(tab)}
            className={`flex-1 py-2 rounded-full items-center ${
              active === tab ? 'bg-white' : ''
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                active === tab ? 'text-[#00654E]' : 'text-white'
              }`}
            >
              {tab === 'active' ? 'Active' : 'Sold/Traded'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
