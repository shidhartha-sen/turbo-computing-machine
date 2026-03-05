import { CheckCircle } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';

type Variant = 'verified' | 'condition' | 'trade' | 'cash';

const variantStyles: Record<Variant, { container: string; text: string; showIcon: boolean }> = {
  verified: { container: 'bg-white border border-[#E0E0E0] flex-row items-center gap-1 px-2 py-1 rounded-full', text: 'text-[#1A1A1A] text-xs font-semibold', showIcon: true },
  condition: { container: 'bg-white border border-[#E0E0E0] flex-row items-center gap-1 px-2 py-1 rounded-full', text: 'text-[#1A1A1A] text-xs font-semibold', showIcon: true },
  trade: { container: 'bg-[#3A8B8B] flex-row items-center px-2 py-1 rounded-full', text: 'text-white text-xs font-semibold', showIcon: false },
  cash: { container: 'bg-[#00654E] flex-row items-center px-2 py-1 rounded-full', text: 'text-white text-xs font-semibold', showIcon: false },
};

type Props = {
  label: string;
  variant?: Variant;
};

export function BadgeTag({ label, variant = 'condition' }: Props) {
  const style = variantStyles[variant];
  return (
    <View className={style.container}>
      {style.showIcon && <CheckCircle size={12} color="#00654E" />}
      <Text className={style.text}>{label}</Text>
    </View>
  );
}
