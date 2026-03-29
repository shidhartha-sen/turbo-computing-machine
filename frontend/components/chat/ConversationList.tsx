import { MessageSquarePlus } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from 'react-native';

import { ConversationItem } from './ConversationItem';
import { Conversation } from '@/types';

type Props = {
  conversations: Conversation[];
  loading: boolean;
  search: string;
  onPress: (id: string) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
};

export function ConversationList({ conversations, loading, search, onPress, onRefresh, refreshing }: Props) {
  const { t } = useTranslation();

  if (loading) {
    return <ActivityIndicator size="large" color="#00654E" style={{ marginTop: 40 }} />;
  }

  if (conversations.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-8 gap-3" style={{ marginTop: -60 }}>
        <View className="w-16 h-16 rounded-full bg-[#E8F5F0] items-center justify-center">
          <MessageSquarePlus size={28} color="#00654E" />
        </View>
        <Text className="text-[#1A1A1A] font-semibold text-base">
          {search ? t('messages.noResults') : t('messages.noConversations')}
        </Text>
        <Text className="text-[#999] text-sm text-center">
          {search
            ? t('messages.tryDifferent')
            : t('messages.getStarted')}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={conversations}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View className="h-px bg-[#F0F0F0]" />}
      refreshControl={
        onRefresh ? <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor="#00654E" /> : undefined
      }
      renderItem={({ item }) => (
        <ConversationItem conversation={item} onPress={() => onPress(item.id)} />
      )}
    />
  );
}
