import { MessageSquare, MoreVertical, Tag, Eye, Clock } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MyListing } from '@/types';

type Props = {
  listing: MyListing;
  onPress: () => void;
  onMarkSold: (id: string) => void;
  onDelete: (id: string) => void;
};

function Badge({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
  return (
    <View className="flex-row items-center gap-1 mr-3">
      {icon}
      <Text style={{ color, fontSize: 11, fontWeight: '600' }}>{label}</Text>
    </View>
  );
}

function expiresIn(expiresAt: string | null): string | null {
  if (!expiresAt) return null;
  const days = Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86400000);
  if (days < 0) return 'Expired';
  return `Expires in ${days}d`;
}

export function MyListingRow({ listing, onPress, onMarkSold, onDelete }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const thumbnail = listing.images?.[0]?.image_url;
  const expiry = expiresIn(listing.expires_at);

  function confirmDelete() {
    setMenuOpen(false);
    Alert.alert('Delete listing', 'Are you sure you want to delete this listing?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(listing.id) },
    ]);
  }

  function confirmMarkSold() {
    setMenuOpen(false);
    Alert.alert('Mark as sold', 'Mark this listing as sold/traded?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Mark Sold', onPress: () => onMarkSold(listing.id) },
    ]);
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row bg-white mx-4 mb-3 rounded-2xl overflow-hidden"
      style={{ elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 }}
    >
      {/* Thumbnail */}
      <View className="w-20 h-20 bg-[#F0F0F0] m-3 rounded-xl overflow-hidden">
        {thumbnail ? (
          <Image source={{ uri: thumbnail }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <View className="w-full h-full bg-[#E8F5F0] items-center justify-center">
            <Tag size={24} color="#00654E" />
          </View>
        )}
      </View>

      {/* Info */}
      <View className="flex-1 py-3 pr-2 justify-between">
        <View className="flex-row items-start justify-between">
          <Text className="text-[#1A1A1A] font-semibold text-sm flex-1 pr-2" numberOfLines={2}>
            {listing.title}
          </Text>
          {/* Three-dot menu */}
          <TouchableOpacity onPress={() => setMenuOpen(true)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <MoreVertical size={18} color="#999" />
          </TouchableOpacity>
        </View>

        <Text className="text-[#1A1A1A] font-bold text-base">${listing.price}</Text>

        {/* Badges row */}
        <View className="flex-row flex-wrap mt-1">
          {listing.active_chats > 0 && (
            <Badge
              icon={<MessageSquare size={11} color="#00654E" />}
              label={`${listing.active_chats} Active Chat${listing.active_chats !== 1 ? 's' : ''}`}
              color="#00654E"
            />
          )}
          {listing.offers_count > 0 && (
            <Badge
              icon={<Tag size={11} color="#F4A130" />}
              label={`${listing.offers_count} Offer${listing.offers_count !== 1 ? 's' : ''}`}
              color="#F4A130"
            />
          )}
          {listing.active_chats === 0 && listing.offers_count === 0 && listing.views_count > 0 && (
            <Badge
              icon={<Eye size={11} color="#999" />}
              label={`${listing.views_count} Views`}
              color="#999"
            />
          )}
          {expiry && (
            <Badge
              icon={<Clock size={11} color="#999" />}
              label={expiry}
              color="#999"
            />
          )}
        </View>
      </View>

      {/* Three-dot dropdown modal */}
      <Modal transparent visible={menuOpen} animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <TouchableOpacity className="flex-1" activeOpacity={1} onPress={() => setMenuOpen(false)}>
          <View
            className="absolute right-6 bg-white rounded-xl overflow-hidden"
            style={{ top: 200, minWidth: 160, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12 }}
          >
            <TouchableOpacity onPress={confirmMarkSold} className="px-4 py-3 border-b border-[#F0F0F0]">
              <Text className="text-[#1A1A1A] text-sm">Mark as Sold/Traded</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={confirmDelete} className="px-4 py-3">
              <Text className="text-red-500 text-sm">Delete Listing</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </TouchableOpacity>
  );
}
