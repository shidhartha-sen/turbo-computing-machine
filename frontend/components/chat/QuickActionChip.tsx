import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

type Props = {
  label: string;
  icon?: React.ReactNode;
  onPress: () => void;
};

export function QuickActionChip({ label, icon, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center gap-1 border border-[#00654E] h-12 mt-4 rounded-full px-2.5 py-1 mr-1.5"
    >
      {icon}
      <Text className="text-[#00654E] text-xs font-semibold">{label}</Text>
    </TouchableOpacity>
  );
}
