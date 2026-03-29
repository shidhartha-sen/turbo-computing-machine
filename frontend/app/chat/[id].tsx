import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Send } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChatBubble } from '@/components/chat/ChatBubble';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/services/api';
import { Conversation, Message } from '@/types';

export default function ChatScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const scrollRef = useRef<ScrollView>(null);

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.getConversations()
      .then((convs) => {
        const conv = convs.find((c) => c.id === id) ?? null;
        setConversation(conv);
      })
      .catch(() => {});

    api.getMessages(id)
      .then(setMessages)
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSend = async () => {
    if (!text.trim()) return;
    try {
      setSending(true);
      const msg = await api.sendMessage(id, text.trim());
      setMessages((prev) => [...prev, msg]);
      setText('');
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    } catch {
      // handle error
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#F5F5F5]"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {/* Header */}
      <View
        className="bg-white flex-row items-center px-4 pb-3 border-b border-[#F0F0F0]"
        style={{ paddingTop: insets.top + 8 }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <ArrowLeft size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-[#1A1A1A] font-bold text-base">
            {conversation?.otherUserName ?? t('messages.chat')}
          </Text>
          {conversation?.isVerifiedUser && (
            <Text className="text-[#00654E] text-xs font-semibold">{t('messages.verifiedStudent')}</Text>
          )}
        </View>
      </View>

{/* Trade banner */}
      {conversation?.tradeProposed && (
        <View className="mx-4 mt-3 bg-white rounded-2xl p-3 flex-row items-center gap-3" style={{ elevation: 2 }}>
          <View className="flex-1">
            <Text className="text-[#1A1A1A] font-semibold text-sm">{conversation.listingTitle}</Text>
            <Text className="text-[#999999] text-xs">{t('messages.agreedOnTrade')}</Text>
          </View>
        </View>
      )}

      {/* Messages */}
      {loading ? (
        <ActivityIndicator size="large" color="#00654E" style={{ flex: 1, alignSelf: 'center' }} />
      ) : (
        <ScrollView
          ref={scrollRef}
          className="flex-1 px-4 pt-4"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          {messages.map((msg, i) => {
            const isMe = msg.senderId === user?.id;
            const showDate =
              i === 0 ||
              new Date(messages[i - 1].sentAt).toDateString() !== new Date(msg.sentAt).toDateString();

            return (
              <View key={msg.id}>
                {showDate && (
                  <Text style={{ textAlign: 'center', color: '#999999', fontSize: 12, marginBottom: 12, marginTop: i > 0 ? 12 : 0 }}>
                    {formatDate(msg.sentAt)}
                  </Text>
                )}
                <ChatBubble
                  text={msg.text}
                  isMe={isMe}
                  senderName={!isMe ? conversation?.otherUserName : undefined}
                />
              </View>
            );
          })}
          <View style={{ height: 8 }} />
        </ScrollView>
      )}


      {/* Input bar */}
      <View
        className="bg-white flex-row items-center px-4 pt-3 border-t border-[#F0F0F0] gap-2"
        style={{ paddingBottom: insets.bottom + 8 }}
      >
<View className="flex-1 bg-[#F5F5F5] rounded-full px-4 py-2.5">
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder={t('messages.messagePlaceholder', { name: conversation?.otherUserName ?? '' })}
            placeholderTextColor="#999999"
            className="text-[#1A1A1A] text-sm"
            multiline
            maxLength={500}
          />
        </View>
        <TouchableOpacity
          onPress={handleSend}
          disabled={!text.trim() || sending}
          className="w-10 h-10 rounded-full bg-[#F4C430] items-center justify-center"
          style={{ opacity: text.trim() ? 1 : 0.5 }}
        >
          <Send size={18} color="#1A1A1A" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
