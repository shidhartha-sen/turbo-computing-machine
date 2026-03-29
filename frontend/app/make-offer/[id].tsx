import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Info, Play } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { TradeItemCard } from '@/components/offer/TradeItemCard';
import { api } from '@/services/api';
import { Listing } from '@/types';
import { isVideoUrl, getVideoThumbnail } from '@/utils/media';

export default function MakeOfferScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [listing, setListing] = useState<Listing | null>(null);
  const [myItems, setMyItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [cashOffer, setCashOffer] = useState('');
  const [tradeEnabled, setTradeEnabled] = useState(false);
  const [selectedTradeIds, setSelectedTradeIds] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([api.getListing(id), api.getMyListings('active')])
      .then(([l, items]) => { setListing(l); setMyItems(items as any); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const toggleTradeItem = (itemId: string) => {
    setSelectedTradeIds((prev) =>
      prev.includes(itemId) ? prev.filter((i) => i !== itemId) : [...prev, itemId]
    );
  };

  const handleSubmit = async () => {
    if (!listing) return;
    try {
      setSubmitting(true);
      await api.createOffer(listing.id, Number(cashOffer), selectedTradeIds, message);
      router.back();
    } catch {
      // handle error
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#00654E" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#F5F5F5]"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View
        className="bg-white flex-row items-center px-4 pb-3 border-b border-[#F0F0F0]"
        style={{ paddingTop: insets.top + 8 }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <ArrowLeft size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text className="text-[#1A1A1A] text-lg font-bold">{t('offer.makeOffer')}</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Item summary */}
        {listing && (
          <View className="bg-white rounded-2xl p-4 flex-row gap-3 mb-4" style={{ elevation: 2 }}>
            {listing.images[0] ? (
              <View style={{ width: 56, height: 56, borderRadius: 12, overflow: 'hidden' }}>
                <Image
                  source={{ uri: isVideoUrl(listing.images[0]) ? getVideoThumbnail(listing.images[0]) : listing.images[0] }}
                  style={{ width: 56, height: 56 }}
                  contentFit="cover"
                />
                {isVideoUrl(listing.images[0]) && (
                  <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}>
                      <Play size={8} color="white" fill="white" />
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <View style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: '#F5F5F5' }} />
            )}
            <View className="flex-1">
              <Text className="text-[#00654E] text-xs font-semibold mb-0.5">
                {t('offer.buyingFrom', { name: listing.sellerName })}
              </Text>
              <Text className="text-[#1A1A1A] font-semibold text-sm" numberOfLines={2}>
                {listing.title}
              </Text>
              <Text className="text-[#1A1A1A] font-bold text-base mt-1">
                ${listing.price.toFixed(2)}
              </Text>
            </View>
          </View>
        )}

        {/* Cash offer */}
        <Text className="text-[#1A1A1A] font-semibold text-sm mb-2">{t('offer.yourCashOffer')}</Text>
        <View className="bg-white rounded-2xl px-4 py-4 mb-4" style={{ elevation: 1 }}>
          <TextInput
            value={cashOffer}
            onChangeText={setCashOffer}
            placeholder="0"
            keyboardType="numeric"
            className="text-[#1A1A1A] text-3xl font-bold"
            placeholderTextColor="#E0E0E0"
          />
        </View>

        {/* Propose a trade */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-[#1A1A1A] font-semibold text-sm">{t('offer.proposeATrade')}</Text>
          <Switch
            value={tradeEnabled}
            onValueChange={setTradeEnabled}
            trackColor={{ false: '#E0E0E0', true: '#00654E' }}
            thumbColor="white"
          />
        </View>

        {tradeEnabled && (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-3"
              contentContainerStyle={{ paddingRight: 16 }}
            >
              {myItems.map((item) => (
                <TradeItemCard
                  key={item.id}
                  item={item}
                  selected={selectedTradeIds.includes(item.id)}
                  onPress={() => toggleTradeItem(item.id)}
                />
              ))}
            </ScrollView>

            <View className="flex-row items-start gap-2 bg-[#F0F8F5] rounded-xl p-3 mb-4">
              <Info size={14} color="#00654E" style={{ marginTop: 1 }} />
              <Text className="text-[#00654E] text-xs flex-1">
                {t('offer.tradeHelp')}
              </Text>
            </View>
          </>
        )}

        {/* Message to seller */}
        <Text className="text-[#1A1A1A] font-semibold text-sm mb-2">{t('offer.messageToSeller')}</Text>
        <View className="bg-white rounded-2xl px-4 py-3 mb-4" style={{ elevation: 1 }}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder={t('offer.messagePlaceholder')}
            placeholderTextColor="#999999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="text-[#1A1A1A] text-sm"
            style={{ minHeight: 100 }}
          />
        </View>
      </ScrollView>

      {/* Submit button */}
      <View
        className="bg-white px-4 pt-3 border-t border-[#F0F0F0]"
        style={{ paddingBottom: insets.bottom + 12 }}
      >
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={submitting}
          className="bg-[#F4C430] rounded-full py-4 items-center"
          style={{ elevation: 3 }}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#1A1A1A" />
          ) : (
            <Text className="text-[#1A1A1A] font-bold text-base">{t('offer.sendOffer')}</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
