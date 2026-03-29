import { Image } from 'expo-image';
import { Play } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { Listing } from '@/types';
import { isVideoUrl, getVideoThumbnail } from '@/utils/media';

const CARD_WIDTH = (Dimensions.get('window').width - 12 * 2 - 8) / 2;

type Props = {
  listing: Listing;
  onPress: () => void;
};

export function ListingCard({ listing, onPress }: Props) {
  const { t } = useTranslation();
  const timeAgo = formatTimeAgo(listing.postedAt);

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl overflow-hidden mb-3"
      style={{ width: CARD_WIDTH, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 }}
    >
      <View>
        <Image
          source={{ uri: isVideoUrl(listing.images[0]) ? getVideoThumbnail(listing.images[0]) : listing.images[0] }}
          style={{ width: '100%', height: 140 }}
          contentFit="cover"
        />
        {isVideoUrl(listing.images[0]) && (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
              <Play size={18} color="white" fill="white" />
            </View>
          </View>
        )}
      </View>
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
            {listing.priceType === 'trade' ? t('listing.trade') : `$${listing.price}`}
          </Text>
          <Text className="text-[#999999] text-xs mx-1">·</Text>
          <Text className="text-[#999999] text-xs">{listing.category}</Text>
        </View>
        <Text className="text-[#999999] text-xs mt-0.5">{t('listing.postedAgo', { timeAgo })}</Text>
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
