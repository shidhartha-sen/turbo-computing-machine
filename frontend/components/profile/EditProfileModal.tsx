import { X } from 'lucide-react-native';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from '@/types';

type Props = {
  visible: boolean;
  profile: User | null;
  onClose: () => void;
  onSave: (name: string, faculty: string, year: string) => void;
};

export function EditProfileModal({ visible, profile, onClose, onSave }: Props) {
  const [name, setName] = useState(profile?.name ?? '');
  const [faculty, setFaculty] = useState(profile?.faculty ?? '');
  const [year, setYear] = useState(profile?.year ?? '');

  function handleSave() {
    onSave(name.trim(), faculty.trim(), year.trim());
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">

          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-[#F0F0F0]">
            <TouchableOpacity onPress={onClose} className="w-8 h-8 items-center justify-center rounded-full bg-[#F0F0F0]">
              <X size={16} color="#1A1A1A" />
            </TouchableOpacity>
            <Text className="text-[#1A1A1A] text-base font-semibold">Edit Profile</Text>
            <TouchableOpacity onPress={handleSave}>
              <Text className="text-[#00654E] font-bold text-sm">Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 48 }} keyboardShouldPersistTaps="handled">
            {/* Avatar */}
            <View className="items-center mb-6 mt-2">
              <View className="w-20 h-20 rounded-full bg-[#00654E] items-center justify-center mb-2">
                <Text className="text-white font-bold text-2xl">
                  {name ? name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                </Text>
              </View>
              <TouchableOpacity>
                <Text className="text-[#00654E] text-sm font-semibold">Change Photo</Text>
              </TouchableOpacity>
            </View>

            <View className="gap-4">
              <FieldRow label="Full Name" value={name} onChangeText={setName} placeholder="Your name" />
              <FieldRow label="Faculty / Program" value={faculty} onChangeText={setFaculty} placeholder="e.g. Engineering" />
              <FieldRow label="Year" value={year} onChangeText={setYear} placeholder="e.g. 3rd Year" />

              <View className="mt-2 bg-[#F5F5F5] rounded-xl p-3">
                <Text className="text-xs text-[#999] text-center">
                  Email address cannot be changed. Contact support if needed.
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

function FieldRow({ label, value, onChangeText, placeholder }: {
  label: string; value: string; onChangeText: (t: string) => void; placeholder: string;
}) {
  return (
    <View>
      <Text className="text-xs font-bold text-[#666] tracking-widest uppercase mb-1.5">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#BBB"
        className="border border-[#E0E0E0] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm bg-white"
      />
    </View>
  );
}
