import { useRouter } from 'expo-router';
import { BookOpen, FlaskConical, LayoutGrid, Plus } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { HomeHeader } from '@/components/home/HomeHeader';
import { SearchBar } from '@/components/home/SearchBar';
import { CategoryChip } from '@/components/listing/CategoryChip';
import { ListingCard } from '@/components/listing/ListingCard';
import { api } from '@/services/api';
import { Listing } from '@/types';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: <LayoutGrid size={14} color="#1A1A1A" /> },
  { id: 'Textbooks', label: 'Textbooks', icon: <BookOpen size={14} color="#1A1A1A" /> },
  { id: 'Lab Gear', label: 'Lab Gear', icon: <FlaskConical size={14} color="#1A1A1A" /> },
];

export default function HomeScreen() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      const category = activeCategory === 'all' ? undefined : activeCategory;
      const data = await api.getListings(category, search || undefined);
      setListings(data);
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, search]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchListings();
    setRefreshing(false);
  };

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <HomeHeader />

      <View className="bg-[#00654E] pb-4">
        <SearchBar value={search} onChangeText={setSearch} />
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#00654E" />}
      >
        {/* Category chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4 py-3"
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat.id}
              label={cat.label}
              active={activeCategory === cat.id}
              onPress={() => setActiveCategory(cat.id)}
            />
          ))}
        </ScrollView>

        {/* Section header */}
        <View className="px-4 mb-3">
          <Text className="text-[#1A1A1A] text-lg font-bold">Recent Listings</Text>
        </View>

        {/* Grid */}
        {loading ? (
          <ActivityIndicator size="large" color="#00654E" style={{ marginTop: 40 }} />
        ) : listings.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 64, paddingHorizontal: 32 }}>
            <Text style={{ color: '#999999', fontSize: 15, textAlign: 'center' }}>
              No listings found. Be the first to post!
            </Text>
          </View>
        ) : (
          <FlatList
            data={listings}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={{ paddingHorizontal: 12, gap: 8 }}
            renderItem={({ item }) => (
              <ListingCard
                listing={item}
                onPress={() => router.push(`/listing/${item.id}` as any)}
              />
            )}
          />
        )}
      </ScrollView>

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
        onPress={() => router.push('/modal')}
      >
        <Plus size={18} color="#1A1A1A" />
        <Text style={{ color: '#1A1A1A', fontWeight: '700', fontSize: 14 }}>Post</Text>
      </TouchableOpacity>
    </View>
  );
}
