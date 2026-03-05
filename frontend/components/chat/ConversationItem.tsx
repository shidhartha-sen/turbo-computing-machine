import { CheckCircle } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Conversation } from '@/types';

type Props = {
  conversation: Conversation;
  onPress: () => void;
};

export function ConversationItem({ conversation, onPress }: Props) {
  const initials = conversation.otherUserName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const timeAgo = formatTimeAgo(conversation.lastMessageAt);

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center px-4 py-3 bg-white border-b border-[#F0F0F0]"
    >
      <View className="w-12 h-12 rounded-full bg-[#F5F5F5] items-center justify-center mr-3">
        <Text className="text-[#00654E] font-bold text-sm">{initials}</Text>
      </View>
      <View className="flex-1">
        <View className="flex-row items-center gap-1">
          <Text className="text-[#1A1A1A] font-semibold text-sm">{conversation.otherUserName}</Text>
          {conversation.isVerifiedUser && <CheckCircle size={13} color="#00654E" fill="#00654E" />}
        </View>
        <Text className="text-[#666666] text-xs mt-0.5" numberOfLines={1}>
          {conversation.listingTitle}
        </Text>
        <Text className="text-[#999999] text-xs mt-0.5" numberOfLines={1}>
          {conversation.lastMessage}
        </Text>
      </View>
      <Text className="text-[#999999] text-xs">{timeAgo}</Text>
    </TouchableOpacity>
  );
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}
