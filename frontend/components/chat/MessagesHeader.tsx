import React from 'react';
import { HomeHeader } from '@/components/home/HomeHeader';
import { SearchBar } from '@/components/home/SearchBar';
import { View } from 'react-native';

type Props = {
  userName?: string;
  search: string;
  onSearchChange: (text: string) => void;
};

export function MessagesHeader({ userName, search, onSearchChange }: Props) {
  return (
    <>
      <HomeHeader userName={userName} />
      <View className="bg-[#00654E]">
        <SearchBar
          value={search}
          onChangeText={onSearchChange}
          placeholder="Search conversations..."
        />
      </View>
    </>
  );
}
