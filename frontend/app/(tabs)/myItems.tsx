import { useRouter } from 'expo-router';
import { Plus, Package } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';


import { MyListingsHeader } from '@/components/myitems/MyListingsHeader';
import { MyListingsTabs } from '@/components/myitems/MyListingsTabs';
import { MyListingRow } from '@/components/myitems/MyListingRow';
import { api } from '@/services/api';
import { MyListing } from '@/types';

type Tab = 'active' | 'sold';

export default function MyItemsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('active');
  const [listings, setListings] = useState<MyListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getMyListings(tab);
      setListings(data);
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAll();
    setRefreshing(false);
  };

  async function handleMarkSold(id: string) {
    await api.updateListing(id, { status: 'sold' });
    fetchAll();
  }

  async function handleDelete(id: string) {
    await api.deleteListing(id);
    fetchAll();
  }

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <MyListingsHeader />
      <MyListingsTabs active={tab} onChange={setTab} />

      {/* Section label */}
      <View className="flex-row items-center justify-between px-4 pb-2">
        <Text className="text-[#1A1A1A] text-base font-bold">
          {tab === 'active' ? t('myItems.activeListings') : t('myItems.soldTraded')}
        </Text>
        <Text className="text-[#999] text-sm">{t('myItems.itemCount', { count: listings.length })}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#00654E" style={{ marginTop: 40 }} />
      ) : listings.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-3 px-8" style={{ marginTop: -60 }}>
          <View className="w-16 h-16 rounded-full bg-[#E8F5F0] items-center justify-center">
            <Package size={28} color="#00654E" />
          </View>
          <Text className="text-[#1A1A1A] font-semibold text-base">
            {tab === 'active' ? t('myItems.noActiveListings') : t('myItems.nothingSold')}
          </Text>
          <Text className="text-[#999] text-sm text-center">
            {tab === 'active'
              ? t('myItems.postFirst')
              : t('myItems.soldAppearHere')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 4, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#00654E" />}
          renderItem={({ item }) => (
            <MyListingRow
              listing={item}
              onPress={() => router.push(`/listing/${item.id}` as any)}
              onMarkSold={handleMarkSold}
              onDelete={handleDelete}
            />
          )}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          backgroundColor: '#F4C430',
          borderRadius: 999,
          paddingHorizontal: 20,
          paddingVertical: 14,
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
        }}
        onPress={() => router.push('/modal' as any)}
      >
        <Plus size={18} color="#1A1A1A" />
        <Text style={{ color: '#1A1A1A', fontWeight: '700', fontSize: 14 }}>{t('common.post')}</Text>
      </TouchableOpacity>
    </View>
  );
}
