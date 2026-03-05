import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { MessagesHeader } from '@/components/chat/MessagesHeader';
import { ConversationList } from '@/components/chat/ConversationList';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/services/api';
import { Conversation } from '@/types';

export default function MessagesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const fetchConversations = async () => {
    try {
      const data = await api.getConversations();
      setConversations(data);
    } catch {
      setConversations([]);
    }
  };

  useEffect(() => {
    fetchConversations().finally(() => setLoading(false));
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchConversations();
    setRefreshing(false);
  };

  const filtered = search.trim()
    ? conversations.filter(
        (c) =>
          c.otherUserName.toLowerCase().includes(search.toLowerCase()) ||
          c.listingTitle.toLowerCase().includes(search.toLowerCase()),
      )
    : conversations;

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <MessagesHeader
        userName={user?.name}
        search={search}
        onSearchChange={setSearch}
      />

      {/* Section header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <Text className="text-[#1A1A1A] text-lg font-bold">Messages</Text>
        <Text className="text-[#999] text-sm">
          {filtered.length} conversation{filtered.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <ConversationList
        conversations={filtered}
        loading={loading}
        search={search}
        onPress={(id) => router.push(`/chat/${id}` as any)}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />

    </View>
  );
}
