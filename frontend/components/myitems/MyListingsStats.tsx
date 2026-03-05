import React from 'react';
import { Text, View } from 'react-native';
import { MyListingsStats as Stats } from '@/types';

type Props = { stats: Stats };

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <View className="flex-1 bg-white rounded-xl p-3 items-start">
      <Text className="text-[#999] text-xs font-semibold tracking-widest uppercase">{label}</Text>
      <Text className="text-[#1A1A1A] text-2xl font-bold mt-1">{value}</Text>
    </View>
  );
}

export function MyListingsStatsRow({ stats }: Props) {
  return (
    <View className="flex-row gap-2 px-4 py-3">
      <StatBox label="Active" value={stats.active} />
      <StatBox label="Sold" value={stats.sold} />
      <StatBox label="Views" value={stats.total_views} />
    </View>
  );
}
