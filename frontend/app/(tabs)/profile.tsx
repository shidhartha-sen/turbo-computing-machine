import {
  Globe,
  LogOut,
  Star,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import languages from '@/i18n/languages';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAuth } from '@/context/AuthContext';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { SettingsRow, SettingsSection } from '@/components/profile/SettingsRow';
import { api } from '@/services/api';
import { Review, User } from '@/types';

export default function ProfileScreen() {
  const { logout } = useAuth();
  const { t, i18n } = useTranslation();
  const [langPickerVisible, setLangPickerVisible] = useState(false);
  const currentLang = languages.find((l) => l.code === i18n.language) ?? languages[0];
  const [profile, setProfile] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editVisible, setEditVisible] = useState(false);

const fetchProfile = async () => {
    try {
      const user = await api.getMyProfile();
      setProfile(user);
      const rev = await api.getReviews(user.id).catch(() => []);
      setReviews(rev);
    } catch {
      setProfile(null);
    }
  };

  useEffect(() => {
    fetchProfile().finally(() => setLoading(false));
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProfile();
    setRefreshing(false);
  };

  function handleSaveProfile(name: string, faculty: string, year: string) {
    if (profile) {
      setProfile({ ...profile, name, faculty, year });
    }
  }

  function handleSignOut() {
    Alert.alert(t('profile.signOut'), t('profile.signOutConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('profile.signOut'), style: 'destructive', onPress: logout },
    ]);
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F5F5F5]">
        <ActivityIndicator size="large" color="#00654E" />
      </View>
    );
  }

  return (
    <>
      <ScrollView
        className="flex-1 bg-[#F5F5F5]"
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#00654E" />}
      >
        {/* Green header with avatar, stats, edit button */}
        <ProfileHeader profile={profile} onEditProfile={() => setEditVisible(true)} />

        <View className="h-8" />


{/* ── Language ────────────────────────────── */}
        <SettingsSection title="">
          <SettingsRow
            type="nav"
            icon={<Globe size={16} color="#00654E" />}
            label={t('profile.language')}
            value={currentLang.name}
            onPress={() => setLangPickerVisible(true)}
            last
          />
        </SettingsSection>

{/* ── Sign Out ─────────────────────────────── */}
        <SettingsSection title="">
          <SettingsRow
            type="nav"
            icon={<LogOut size={16} color="#EF4444" />}
            label={t('profile.signOut')}
            danger
            onPress={handleSignOut}
            last
          />
        </SettingsSection>

        {/* ── Recent Reviews ───────────────────────── */}
        {reviews.length > 0 && (
          <View className="px-4 mt-2 mb-4">
            <Text className="text-[#1A1A1A] text-base font-bold mb-3">{t('profile.recentReviews')}</Text>
            {reviews.map((review) => (
              <ReviewRow key={review.id} review={review} />
            ))}
          </View>
        )}

        {/* App version */}
        <Text className="text-center text-[#CCC] text-xs mt-4">{t('profile.appVersion')}</Text>
      </ScrollView>

      <Modal
        visible={langPickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setLangPickerVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white rounded-t-3xl max-h-[60%]">
            <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100">
              <Text className="text-lg font-bold text-[#1A1A1A]">{t('profile.language')}</Text>
              <TouchableOpacity onPress={() => setLangPickerVisible(false)}>
                <Text className="text-[#00654E] font-semibold">{t('common.cancel')}</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={languages}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`flex-row items-center justify-between px-5 py-4 border-b border-gray-50 ${
                    item.code === i18n.language ? 'bg-[#E8F5E9]' : ''
                  }`}
                  onPress={() => {
                    i18n.changeLanguage(item.code);
                    setLangPickerVisible(false);
                  }}
                >
                  <Text className={`text-base ${item.code === i18n.language ? 'text-[#00654E] font-bold' : 'text-[#1A1A1A]'}`}>
                    {item.name}
                  </Text>
                  {item.code === i18n.language && (
                    <Text className="text-[#00654E] font-bold">✓</Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <EditProfileModal
        visible={editVisible}
        profile={profile}
        onClose={() => setEditVisible(false)}
        onSave={handleSaveProfile}
      />
    </>
  );
}

function ReviewRow({ review }: { review: Review }) {
  const initials = review.reviewerName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <View
      className="bg-white rounded-2xl p-4 mb-3"
      style={{ elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 }}
    >
      <View className="flex-row items-center mb-2">
        <View className="w-9 h-9 rounded-full bg-[#F5F5F5] items-center justify-center mr-2">
          <Text className="text-[#00654E] font-bold text-xs">{initials}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-[#1A1A1A] font-semibold text-sm">{review.reviewerName}</Text>
          <View className="flex-row">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={11} color="#F4C430" fill={i < review.rating ? '#F4C430' : 'none'} />
            ))}
          </View>
        </View>
      </View>
      <Text className="text-[#666] text-sm">{review.comment}</Text>
    </View>
  );
}
