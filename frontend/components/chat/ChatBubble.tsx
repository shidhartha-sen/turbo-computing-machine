import React from 'react';
import { Text, View } from 'react-native';

type Props = {
  text: string;
  isMe: boolean;
  senderName?: string;
};

export function ChatBubble({ text, isMe, senderName }: Props) {
  return (
    <View className={`mb-3 max-w-[75%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
      {!isMe && senderName && (
        <Text className="text-[#999999] text-xs mb-1 ml-1">{senderName}</Text>
      )}
      <View
        className={`px-4 py-3 rounded-2xl ${
          isMe ? 'bg-[#F4C430] rounded-br-sm' : 'bg-white rounded-bl-sm'
        }`}
        style={{ elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 2 }}
      >
        <Text className={`text-sm leading-5 ${isMe ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]'}`}>
          {text}
        </Text>
      </View>
    </View>
  );
}
