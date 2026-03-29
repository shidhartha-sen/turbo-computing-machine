import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { ArrowLeft } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BadgeTag } from '@/components/listing/BadgeTag';
import { SellerCard } from '@/components/profile/SellerCard';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/services/api';
import { Listing } from '@/types';
import { isVideoUrl } from '@/utils/media';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ItemDetailsScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [startingChat, setStartingChat] = useState(false);

  useEffect(() => {
    api.getListing(id)
      .then(setListing)
      .catch(() => setListing(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentImage(index);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#00654E" />
      </View>
    );
  }

  if (!listing) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
        <Text style={{ color: '#999999', fontSize: 15, textAlign: 'center' }}>
          {t('listing.notFound')}
        </Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: '#00654E', fontWeight: '600' }}>{t('common.goBack')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isOwnListing = user?.id === listing.sellerId;
  const timeAgo = formatTimeAgo(listing.postedAt);

  const handleMessage = async () => {
    try {
      setStartingChat(true);
      const conv = await api.createConversation(listing.id, listing.sellerId);
      router.push(`/chat/${conv.id}` as any);
    } catch {
      // conversation may already exist; try fetching existing ones
    } finally {
      setStartingChat(false);
    }
  };
  const description = expanded ? listing.description : listing.description.slice(0, 120);

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Image carousel */}
        <View style={{ position: 'relative' }}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {listing.images.length > 0 ? (
              listing.images.map((url, i) =>
                isVideoUrl(url) ? (
                  <CarouselVideo key={i} url={url} />
                ) : (
                  <Image
                    key={i}
                    source={{ uri: url }}
                    style={{ width: SCREEN_WIDTH, height: 300 }}
                    contentFit="cover"
                  />
                ),
              )
            ) : (
              <View style={{ width: SCREEN_WIDTH, height: 300, backgroundColor: '#E0E0E0', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#999999' }}>{t('common.noImage')}</Text>
              </View>
            )}
          </ScrollView>

          {/* Back & action buttons */}
          <View style={{ position: 'absolute', top: insets.top + 8, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16 }}>
            <TouchableOpacity onPress={() => router.back()} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', elevation: 3 }}>
              <ArrowLeft size={20} color="#1A1A1A" />
            </TouchableOpacity>
          </View>

          {/* Dot indicators */}
          {listing.images.length > 1 && (
            <View style={{ position: 'absolute', bottom: 12, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
              {listing.images.map((_, i) => (
                <View key={i} style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: i === currentImage ? 'white' : 'rgba(255,255,255,0.5)' }} />
              ))}
            </View>
          )}
        </View>

        {/* Content */}
        <View className="bg-white px-4 pt-4 pb-5">
          <Text className="text-[#1A1A1A] text-2xl font-bold mb-1">{listing.title}</Text>
          <View className="flex-row items-center mb-3">
            <Text className="text-[#1A1A1A] text-xl font-bold">
              {listing.priceType === 'trade' ? t('listing.trade') : `$${Number(listing.price).toFixed(2)}`}
            </Text>
            <Text className="text-[#999999] text-sm ml-3">{t('listing.postedAgo', { timeAgo })}</Text>
          </View>

          {/* Badges */}
          <View className="flex-row flex-wrap gap-2 mb-4">
            {listing.isVerified && <BadgeTag label="USask Verified" variant="verified" />}
            <BadgeTag label={listing.condition} variant="condition" />
            {listing.priceType === 'trade' && <BadgeTag label={t('listing.trade')} variant="trade" />}
            {listing.priceType === 'cash' && <BadgeTag label={t('listing.cash')} variant="cash" />}
          </View>

          {/* Action buttons */}
          {!isOwnListing && (
            <View className="flex-row gap-3 mb-4">
              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center gap-2 border border-[#E0E0E0] rounded-full py-3"
                onPress={handleMessage}
                disabled={startingChat}
              >
                <Text className="text-[#1A1A1A] font-semibold">{startingChat ? t('listing.opening') : t('listing.message')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center gap-2 bg-[#F4C430] rounded-full py-3"
                style={{ elevation: 3 }}
                onPress={() => router.push(`/make-offer/${listing.id}` as any)}
              >
                <Text className="text-[#1A1A1A] font-bold">{t('listing.makeOffer')}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Description */}
          <Text className="text-[#666666] text-sm leading-6">
            {description}
            {listing.description.length > 120 && !expanded ? '...' : ''}
          </Text>
          {listing.description.length > 120 && (
            <TouchableOpacity onPress={() => setExpanded(!expanded)} className="mt-1">
              <Text className="text-[#00654E] text-sm font-semibold">
                {expanded ? t('listing.showLess') : t('listing.readMore')}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Seller */}
        <View className="px-4 mt-3">
          <SellerCard
            seller={{
              id: listing.sellerId,
              name: listing.sellerName,
              rating: listing.sellerRating,
              year: listing.sellerYear,
              faculty: '',
            }}
            onViewProfile={() => router.push(`/chat/${listing.sellerId}` as any)}
          />
        </View>

      </ScrollView>
    </View>
  );
}

function CarouselVideo({ url }: { url: string }) {
  const player = useVideoPlayer(url, (p) => {
    p.loop = false;
  });

  return (
    <View style={{ width: SCREEN_WIDTH, height: 300 }}>
      <VideoView
        player={player}
        style={{ width: SCREEN_WIDTH, height: 300 }}
        contentFit="cover"
        nativeControls
      />
    </View>
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
