import React from 'react';
import { useTranslation } from 'react-i18next';
import { HomeHeader } from '@/components/home/HomeHeader';
import { SearchBar } from '@/components/home/SearchBar';
import { View } from 'react-native';

type Props = {
  search: string;
  onSearchChange: (text: string) => void;
};

export function MessagesHeader({ search, onSearchChange }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <HomeHeader />
      <View className="bg-[#00654E]">
        <SearchBar
          value={search}
          onChangeText={onSearchChange}
          placeholder={t('messages.searchPlaceholder')}
        />
      </View>
    </>
  );
}
