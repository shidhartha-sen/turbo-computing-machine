import { Bell } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  userName?: string;
  onNotificationPress?: () => void;
  onAvatarPress?: () => void;
};

export function HomeHeader({ userName, onNotificationPress, onAvatarPress }: Props) {
  const insets = useSafeAreaInsets();
  const initials = userName
    ? userName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <View
      className="bg-[#00654E] flex-row items-center px-4 pb-3"
      style={{ paddingTop: insets.top + 8 }}
    >
      <TouchableOpacity
        onPress={onAvatarPress}
        className="w-10 h-10 rounded-full bg-white/30 items-center justify-center"
      >
        <Text className="text-white font-bold text-sm">{initials}</Text>
      </TouchableOpacity>

      <Text className="flex-1 text-white font-semibold text-base text-center">
        University of Saskatchewan
      </Text>

      <TouchableOpacity
        onPress={onNotificationPress}
        className="w-10 h-10 rounded-full bg-white/30 items-center justify-center"
      >
        <Bell size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
}
