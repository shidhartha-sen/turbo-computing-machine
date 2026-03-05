import { Image } from 'expo-image';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Listing } from '@/types';

type Props = {
  item: Pick<Listing, 'id' | 'title' | 'images'>;
  selected: boolean;
  onPress: () => void;
};

export function TradeItemCard({ item, selected, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="mr-3 items-center"
    >
      <View
        className={`rounded-xl overflow-hidden border-2 ${
          selected ? 'border-[#F4C430]' : 'border-transparent'
        }`}
        style={{ width: 80, height: 80 }}
      >
        {item.images[0] ? (
          <Image
            source={{ uri: item.images[0] }}
            style={{ width: 80, height: 80 }}
            contentFit="cover"
          />
        ) : (
          <View className="w-20 h-20 bg-[#F5F5F5] items-center justify-center">
            <Text className="text-[#999999] text-xs">No image</Text>
          </View>
        )}
      </View>
      <Text className="text-[#1A1A1A] text-xs mt-1 text-center w-20" numberOfLines={2}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );
}
