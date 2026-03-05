import { CheckCircle, Star } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { User } from '@/types';

type Props = {
  profile: User | null;
  onEditProfile: () => void;
};

export function ProfileHeader({ profile, onEditProfile }: Props) {
  const insets = useSafeAreaInsets();

  const initials = profile?.name
    ? profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <View className="bg-[#00654E]" style={{ paddingTop: insets.top }}>
      <View className="px-6 pt-5 pb-8 items-center">
        {/* Avatar */}
        <View
          className="w-20 h-20 rounded-full items-center justify-center mb-3"
          style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
        >
          <Text className="text-white font-bold text-2xl">{initials}</Text>
        </View>

        {/* Name + verified */}
        <View className="flex-row items-center gap-2 mb-0.5">
          <Text className="text-white text-xl font-bold">{profile?.name ?? 'Student'}</Text>
          {profile?.isVerified && <CheckCircle size={18} color="white" fill="rgba(255,255,255,0.4)" />}
        </View>

        <Text className="text-white/70 text-xs mb-2">
          {profile?.faculty ? `${profile.faculty} · ` : ''}{profile?.year ?? ''}
        </Text>

        {/* Rating */}
        <View className="flex-row items-center gap-1 mb-5">
          <Star size={13} color="#F4C430" fill="#F4C430" />
          <Text className="text-white/80 text-sm">
            {profile?.rating ? profile.rating.toFixed(1) : '—'} rating
          </Text>
          <View className="w-px h-3 bg-white/30 mx-1" />
          <Text className="text-white/60 text-xs font-semibold uppercase tracking-wide">Verified Student</Text>
        </View>

        {/* Stats row */}
        <View
          className="flex-row w-full rounded-2xl overflow-hidden"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
        >
          <StatBox label="Listings" value={profile?.listingsCount ?? 0} />
          <View className="w-px" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
          <StatBox label="Trades" value={profile?.tradesCount ?? 0} />
          <View className="w-px" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
          <StatBox label="Reviews" value={profile?.reviewsCount ?? 0} />
        </View>
      </View>

      {/* Edit Profile button — sits at bottom of header, overlapping body */}
      <View className="px-6 pb-0 -mb-5 z-10">
        <TouchableOpacity
          onPress={onEditProfile}
          className="bg-white rounded-full py-3 items-center"
          style={{ elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6 }}
        >
          <Text className="text-[#00654E] font-bold text-sm">Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <View className="flex-1 items-center py-3">
      <Text className="text-white font-bold text-lg">{value}</Text>
      <Text className="text-white/60 text-xs mt-0.5">{label}</Text>
    </View>
  );
}
