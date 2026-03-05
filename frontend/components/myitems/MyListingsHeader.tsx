import { Settings, Menu } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  onMenuPress?: () => void;
  onSettingsPress?: () => void;
};

export function MyListingsHeader({ onMenuPress, onSettingsPress }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-[#00654E] flex-row items-center px-4 pb-3"
      style={{ paddingTop: insets.top + 8 }}
    >
      <TouchableOpacity
        onPress={onMenuPress}
        className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
      >
        <Menu size={20} color="white" />
      </TouchableOpacity>

      <Text className="flex-1 text-white font-bold text-lg text-center">My Listings</Text>

      <TouchableOpacity
        onPress={onSettingsPress}
        className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
      >
        <Settings size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
}
