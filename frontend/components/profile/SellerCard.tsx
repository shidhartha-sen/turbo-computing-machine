import { Star } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { User } from '@/types';

type Props = {
  seller: Pick<User, 'id' | 'name' | 'rating' | 'year' | 'faculty'>;
  onViewProfile?: () => void;
};

export function SellerCard({ seller, onViewProfile }: Props) {
  const initials = (seller.name ?? '')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <View className="flex-row items-center bg-white rounded-2xl p-4" style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 }}>
      <View className="w-12 h-12 rounded-full bg-[#F5F5F5] items-center justify-center mr-3">
        <Text className="text-[#00654E] font-bold text-base">{initials}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-[#1A1A1A] font-semibold text-sm">{seller.name}</Text>
        <View className="flex-row items-center mt-0.5">
          <Star size={12} color="#F4C430" fill="#F4C430" />
          <Text className="text-[#666666] text-xs ml-1">
            {(seller.rating ?? 0).toFixed(1)} · {seller.year}
          </Text>
        </View>
      </View>
      {onViewProfile && (
        <TouchableOpacity
          onPress={onViewProfile}
          className="border border-[#E0E0E0] rounded-full px-3 py-1.5"
        >
          <Text className="text-[#1A1A1A] text-xs font-semibold">View Profile</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
