import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function HomeHeader() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View
      className="bg-[#00654E] flex-row items-center px-4 pb-3"
      style={{ paddingTop: insets.top + 8 }}
    >
      <Text className="flex-1 text-white font-semibold text-base text-center">
        {t('home.universityName')}
      </Text>
    </View>
  );
}
