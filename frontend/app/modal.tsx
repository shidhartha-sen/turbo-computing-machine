import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Camera, Check, ChevronDown, Film, Image as ImageIcon, X } from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '@/services/api';

const CATEGORIES = ['Textbooks', 'Lab Gear', 'Electronics', 'Furniture', 'Clothing', 'Other'];

const MEETING_LOCATIONS = [
  { id: 'murray', label: 'Murray Library', sublabel: 'Ground Floor', icon: '📚' },
  { id: 'place_riel', label: 'Place Riel', sublabel: 'Food Court', icon: '🍽️' },
  { id: 'health_sciences', label: 'Health Sciences', sublabel: 'Main Atrium', icon: '🏛️' },
  { id: 'other', label: 'Other On-Campus', sublabel: 'Specify in description', icon: '📍' },
];

type PriceType = 'cash' | 'trade' | 'both';
type MediaItem = { uri: string; type: 'image' | 'video' };

export default function CreateListingModal() {
  const router = useRouter();

  const [media, setMedia] = useState<MediaItem[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [priceType, setPriceType] = useState<PriceType>('cash');
  const [price, setPrice] = useState('');
  const [meetingLocation, setMeetingLocation] = useState('murray');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);

  const titleError = submitted && !title.trim();
  const priceError = submitted && priceType !== 'trade' && !price.trim();
  const categoryError = submitted && !category;

  const MAX_PHOTOS = 5;

  const { showActionSheetWithOptions } = useActionSheet();

  function openCategoryPicker() {
    const options = [...CATEGORIES, 'Cancel'];
    showActionSheetWithOptions(
      { options, cancelButtonIndex: options.length - 1, title: 'Select Category' },
      (index) => {
        if (index !== undefined && index < CATEGORIES.length) setCategory(CATEGORIES[index]);
      },
    );
  }

  function openMediaPicker() {
    if (media.length >= MAX_PHOTOS) return;
    showActionSheetWithOptions(
      {
        options: ['Take Photo', 'Record Video', 'Choose from Library', 'Cancel'],
        cancelButtonIndex: 3,
        title: 'Add Media',
      },
      async (index) => {
        if (index === 0) {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') { Alert.alert('Permission required', 'Please allow camera access.'); return; }
          const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.8, allowsEditing: true, aspect: [1, 1] });
          if (!result.canceled && result.assets[0]) setMedia((prev) => [...prev, { uri: result.assets[0].uri, type: 'image' }]);
        } else if (index === 1) {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') { Alert.alert('Permission required', 'Please allow camera access.'); return; }
          const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['videos'], videoMaxDuration: 30 });
          if (!result.canceled && result.assets[0]) setMedia((prev) => [...prev, { uri: result.assets[0].uri, type: 'video' }]);
        } else if (index === 2) {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') { Alert.alert('Permission required', 'Please allow photo library access.'); return; }
          const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images', 'videos'], quality: 0.8, allowsEditing: true, aspect: [1, 1] });
          if (!result.canceled && result.assets[0]) {
            const asset = result.assets[0];
            setMedia((prev) => [...prev, { uri: asset.uri, type: asset.type === 'video' ? 'video' : 'image' }]);
          }
        }
      },
    );
  }

  function removeMedia(index: number) {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    setSubmitted(true);
    if (!title.trim() || !category || (priceType !== 'trade' && !price.trim())) return;

    const parsedPrice = priceType === 'trade' ? 0 : parseFloat(price.replace(/[^0-9.]/g, ''));
    if (priceType !== 'trade' && (isNaN(parsedPrice) || parsedPrice <= 0)) {
      Alert.alert('Invalid price', 'Please enter a valid price.');
      return;
    }

    setLoading(true);
    try {
      const result = await api.createListing({
        title: title.trim(),
        description: description.trim(),
        price: parsedPrice,
        condition: 'good',
        category,
        price_type: priceType,
        meeting_location: meetingLocation,
        image_urls: media.map((m) => m.uri),
      });
      setCreatedId(result.id);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to post listing. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const canPost = title.trim() && category && (priceType === 'trade' || price.trim());

  // ── Success state ───────────────────────────────────────────────────────────
  if (createdId) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-8 gap-6">
        <View className="w-20 h-20 rounded-full bg-[#E8F5F0] items-center justify-center">
          <View className="w-14 h-14 rounded-full bg-[#00654E] items-center justify-center">
            <Check size={28} color="white" strokeWidth={3} />
          </View>
        </View>
        <View className="items-center gap-2">
          <Text className="text-[#1A1A1A] text-2xl font-bold text-center">Your listing is live!</Text>
          <Text className="text-[#666] text-sm text-center">
            Great job! Students can now discover your item on the marketplace.
          </Text>
        </View>
        <View className="w-full gap-3 mt-2">
          <TouchableOpacity
            onPress={() => { router.dismiss(); router.push(`/listing/${createdId}` as any); }}
            className="bg-[#F4C430] rounded-full py-4 items-center"
          >
            <Text className="text-[#1A1A1A] font-bold text-base">View Listing</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setCreatedId(null); setMedia([]); setTitle(''); setCategory('');
              setDescription(''); setPrice(''); setPriceType('cash');
              setMeetingLocation('murray'); setSubmitted(false);
            }}
            className="border-2 border-[#00654E] rounded-full py-4 items-center"
          >
            <Text className="text-[#00654E] font-bold text-base">Post Another Item</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">

        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-[#F0F0F0]">
          <TouchableOpacity onPress={() => router.dismiss()} className="w-8 h-8 items-center justify-center rounded-full bg-[#F0F0F0]">
            <X size={16} color="#1A1A1A" />
          </TouchableOpacity>
          <Text className="text-[#1A1A1A] text-base font-semibold">Create Listing</Text>
          <View className="w-8" />
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: 48 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* Photos / Videos */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-xs font-bold text-[#666] tracking-widest uppercase">Photos & Videos</Text>
              <Text className="text-xs text-[#999]">{media.length}/{MAX_PHOTOS} added</Text>
            </View>
            <View className="flex-row gap-2">
              {/* First slot — add button */}
              <TouchableOpacity
                onPress={() => openMediaPicker()}
                className="w-24 h-24 rounded-xl items-center justify-center"
                style={{ borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#C0C0C0', backgroundColor: '#FAFAFA' }}
              >
                {media[0] ? (
                  <MediaSlot item={media[0]} onRemove={() => removeMedia(0)} />
                ) : (
                  <Camera size={26} color="#999" />
                )}
              </TouchableOpacity>

              {/* Slots 2 & 3 */}
              {[1, 2].map((i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => openMediaPicker()}
                  className="w-24 h-24 rounded-xl items-center justify-center"
                  style={{ borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#C0C0C0', backgroundColor: '#FAFAFA' }}
                >
                  {media[i] ? (
                    <MediaSlot item={media[i]} onRemove={() => removeMedia(i)} />
                  ) : (
                    <ImageIcon size={22} color="#C0C0C0" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Title */}
          <View className="mb-4">
            <Text className="text-xs font-bold text-[#666] tracking-widest uppercase mb-1.5">Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="What are you selling?"
              placeholderTextColor="#BBB"
              className="border border-[#E0E0E0] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm bg-white"
              style={{ borderColor: titleError ? '#EF4444' : '#E0E0E0' }}
            />
            {titleError && <Text className="text-red-500 text-xs mt-1">Title is required</Text>}
          </View>

          {/* Category */}
          <View className="mb-4">
            <Text className="text-xs font-bold text-[#666] tracking-widest uppercase mb-1.5">Category</Text>
            <TouchableOpacity
              onPress={openCategoryPicker}
              className="flex-row items-center justify-between border rounded-xl px-4 py-3 bg-white"
              style={{ borderColor: categoryError ? '#EF4444' : '#E0E0E0' }}
            >
              <Text className="text-sm" style={{ color: category ? '#1A1A1A' : '#BBB' }}>
                {category || 'Select Category'}
              </Text>
              <ChevronDown size={18} color="#999" />
            </TouchableOpacity>
            {categoryError && <Text className="text-red-500 text-xs mt-1">Category is required</Text>}
          </View>

          {/* Description */}
          <View className="mb-4">
            <Text className="text-xs font-bold text-[#666] tracking-widest uppercase mb-1.5">Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Condition, details, reason for selling..."
              placeholderTextColor="#BBB"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              className="border border-[#E0E0E0] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm bg-white"
              style={{ minHeight: 110 }}
            />
          </View>

          {/* Price or Trade */}
          <View className="mb-6">
            <Text className="text-xs font-bold text-[#666] tracking-widest uppercase mb-1.5">Price or Trade</Text>

            {/* Toggle — segmented control style */}
            <View
              className="flex-row rounded-xl p-1 mb-3"
              style={{ backgroundColor: '#F0F0F0' }}
            >
              {(['cash', 'trade', 'both'] as PriceType[]).map((pt) => (
                <TouchableOpacity
                  key={pt}
                  onPress={() => setPriceType(pt)}
                  className="flex-1 py-2 items-center rounded-lg"
                  style={
                    priceType === pt
                      ? { backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 }
                      : {}
                  }
                >
                  <Text
                    className="text-sm font-semibold"
                    style={{ color: priceType === pt ? '#1A1A1A' : '#999' }}
                  >
                    {pt.charAt(0).toUpperCase() + pt.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Price input — shown for cash or both */}
            {priceType !== 'trade' && (
              <View
                className="flex-row items-center border rounded-xl px-4 py-3 bg-white"
                style={{ borderColor: priceError ? '#EF4444' : '#E0E0E0' }}
              >
                <Text className="text-[#1A1A1A] font-semibold mr-1">$</Text>
                <TextInput
                  value={price}
                  onChangeText={setPrice}
                  placeholder="0.00"
                  placeholderTextColor="#BBB"
                  keyboardType="decimal-pad"
                  className="flex-1 text-[#1A1A1A] text-sm"
                />
              </View>
            )}
            {priceError && <Text className="text-red-500 text-xs mt-1">Price is required</Text>}
          </View>

          {/* Meeting Preferences */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-xs font-bold text-[#666] tracking-widest uppercase">Meeting Preferences</Text>
              <Text className="text-xs text-[#00654E] font-semibold">Safe Trade Zones</Text>
            </View>
            <View className="border border-[#E0E0E0] rounded-xl overflow-hidden bg-white">
              {MEETING_LOCATIONS.map((loc, i) => (
                <TouchableOpacity
                  key={loc.id}
                  onPress={() => setMeetingLocation(loc.id)}
                  className="flex-row items-center px-4 py-3"
                  style={{ borderTopWidth: i > 0 ? 1 : 0, borderTopColor: '#F0F0F0' }}
                >
                  <Text className="text-xl w-8">{loc.icon}</Text>
                  <View className="flex-1 ml-2">
                    <Text className="text-sm font-semibold text-[#1A1A1A]">{loc.label}</Text>
                    <Text className="text-xs text-[#999]">{loc.sublabel}</Text>
                  </View>
                  <View
                    className="w-6 h-6 rounded-full items-center justify-center"
                    style={{
                      borderWidth: meetingLocation === loc.id ? 0 : 1.5,
                      borderColor: '#C0C0C0',
                      backgroundColor: meetingLocation === loc.id ? '#00654E' : 'transparent',
                    }}
                  >
                    {meetingLocation === loc.id && <Check size={13} color="white" strokeWidth={3} />}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Post button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className="rounded-xl py-4 items-center"
            style={{ backgroundColor: canPost ? '#00654E' : '#E0E0E0' }}
          >
            {loading
              ? <ActivityIndicator color="white" />
              : <Text style={{ color: canPost ? 'white' : '#999', fontWeight: '700', fontSize: 15 }}>Post Listing</Text>
            }
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}

function MediaSlot({ item, onRemove }: { item: MediaItem; onRemove: () => void }) {
  return (
    <View className="w-full h-full rounded-xl overflow-hidden">
      <Image source={{ uri: item.uri }} className="w-full h-full" resizeMode="cover" />
      {item.type === 'video' && (
        <View className="absolute inset-0 items-center justify-center">
          <View className="bg-black/50 rounded-full w-8 h-8 items-center justify-center">
            <Film size={14} color="white" />
          </View>
        </View>
      )}
      <TouchableOpacity
        onPress={onRemove}
        className="absolute top-1 right-1 bg-black/50 rounded-full w-5 h-5 items-center justify-center"
      >
        <X size={10} color="white" />
      </TouchableOpacity>
    </View>
  );
}
