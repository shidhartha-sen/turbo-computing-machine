import { Image } from 'expo-image';
import React from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { Listing } from '@/types';

const CARD_WIDTH = (Dimensions.get('window').width - 12 * 2 - 8) / 2;

type Props = {
  listing: Listing;
  onPress: () => void;
};

export function ListingCard({ listing, onPress }: Props) {
  const timeAgo = formatTimeAgo(listing.postedAt);

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl overflow-hidden mb-3"
      style={{ width: CARD_WIDTH, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 }}
    >
      <Image
        source={{ uri: listing.images[0] }}
        style={{ width: '100%', height: 140 }}
        contentFit="cover"
      />
      <View className="p-2.5">
        <Text className="text-[#1A1A1A] font-semibold text-sm" numberOfLines={2}>
          {listing.title}
        </Text>
        <View className="flex-row items-center mt-1">
          <Text
            className={`font-bold text-sm ${
              listing.priceType === 'trade' ? 'text-[#3A8B8B]' : 'text-[#1A1A1A]'
            }`}
          >
            {listing.priceType === 'trade' ? 'Trade' : `$${listing.price}`}
          </Text>
          <Text className="text-[#999999] text-xs mx-1">·</Text>
          <Text className="text-[#999999] text-xs">{listing.category}</Text>
        </View>
        <Text className="text-[#999999] text-xs mt-0.5">Posted {timeAgo}</Text>
      </View>
    </TouchableOpacity>
  );
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
