import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

export default function SignupScreen() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignup() {
    setError(null);
    if (!name || !email || !password || !confirm) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      await register(name.trim(), email.trim().toLowerCase(), password);
      router.replace('/(tabs)');
    } catch (e: any) {
      const msg: string = e?.message ?? '';
      console.error('[SIGNUP ERROR]', e);
      if (msg.includes('403')) setError('Only @usask.ca email addresses are allowed.');
      else if (msg.includes('409')) setError('An account with this email already exists.');
      else setError(msg || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View className="bg-[#00654E] pt-16 pb-12 items-center">
            <Text className="text-white text-4xl font-bold tracking-wide">Flipurt</Text>
            <Text className="text-green-200 text-sm mt-1">USask Marketplace</Text>
          </View>

          <View className="px-6 pt-10 gap-5">
            <View className="gap-1">
              <Text className="text-2xl font-semibold text-[#1A1A1A]">Create account</Text>
              <Text className="text-[#666] text-sm">USask students only (@usask.ca)</Text>
            </View>

            {/* Full name */}
            <View className="gap-1.5">
              <Text className="text-sm font-medium text-[#1A1A1A]">Full Name</Text>
              <TextInput
                className="border border-[#E0E0E0] rounded-lg px-4 py-3 text-[#1A1A1A] text-base"
                placeholder="Jane Smith"
                placeholderTextColor="#999"
                autoCapitalize="words"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Email */}
            <View className="gap-1.5">
              <Text className="text-sm font-medium text-[#1A1A1A]">USask Email</Text>
              <TextInput
                className="border border-[#E0E0E0] rounded-lg px-4 py-3 text-[#1A1A1A] text-base"
                placeholder="nsid@usask.ca"
                placeholderTextColor="#999"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Password */}
            <View className="gap-1.5">
              <Text className="text-sm font-medium text-[#1A1A1A]">Password</Text>
              <TextInput
                className="border border-[#E0E0E0] rounded-lg px-4 py-3 text-[#1A1A1A] text-base"
                placeholder="••••••••"
                placeholderTextColor="#999"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {/* Confirm password */}
            <View className="gap-1.5">
              <Text className="text-sm font-medium text-[#1A1A1A]">Confirm Password</Text>
              <TextInput
                className="border border-[#E0E0E0] rounded-lg px-4 py-3 text-[#1A1A1A] text-base"
                placeholder="••••••••"
                placeholderTextColor="#999"
                secureTextEntry
                value={confirm}
                onChangeText={setConfirm}
              />
            </View>

            {error && <Text className="text-red-500 text-sm">{error}</Text>}

            {/* Create account button */}
            <TouchableOpacity
              onPress={handleSignup}
              disabled={loading}
              className="bg-[#F4C430] rounded-lg py-4 items-center mt-2"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading
                ? <ActivityIndicator color="#1A1A1A" />
                : <Text className="text-[#1A1A1A] font-bold text-base">Create Account</Text>
              }
            </TouchableOpacity>

            {/* Link to login */}
            <View className="flex-row justify-center gap-1 mt-2 pb-8">
              <Text className="text-[#666] text-sm">Already have an account?</Text>
              <TouchableOpacity onPress={() => router.push('/login' as any)}>
                <Text className="text-[#00654E] text-sm font-semibold">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
