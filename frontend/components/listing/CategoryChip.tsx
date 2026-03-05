import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

type Props = {
  label: string;
  active: boolean;
  onPress: () => void;
  icon?: React.ReactNode;
};

export function CategoryChip({ label, active, onPress, icon }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center gap-1.5 px-4 py-2 rounded-full mr-2 ${
        active ? 'bg-[#F4C430]' : 'bg-white border border-[#E0E0E0]'
      }`}
    >
      {icon}
      <Text className={`text-sm font-semibold ${active ? 'text-[#1A1A1A]' : 'text-[#666666]'}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
