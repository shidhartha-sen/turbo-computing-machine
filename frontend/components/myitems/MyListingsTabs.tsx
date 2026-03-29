import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';

type Tab = 'active' | 'sold';

type Props = {
  active: Tab;
  onChange: (tab: Tab) => void;
};

export function MyListingsTabs({ active, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <View className="bg-[#00654E] pb-4 px-4">
      <View className="flex-row bg-white/20 rounded-full p-1">
        {(['active', 'sold'] as Tab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => onChange(tab)}
            className={`flex-1 py-2 rounded-full items-center ${
              active === tab ? 'bg-white' : ''
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                active === tab ? 'text-[#00654E]' : 'text-white'
              }`}
            >
              {tab === 'active' ? t('myItems.active') : t('myItems.soldTraded')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
