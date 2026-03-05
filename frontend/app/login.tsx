import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setError(null);
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
      router.replace('/(tabs)');
    } catch (e: any) {
      const msg: string = e?.message ?? '';
      console.error('[LOGIN ERROR]', e);
      if (msg.includes('403')) setError('Only @usask.ca accounts are allowed.');
      else if (msg.includes('401')) setError('Incorrect email or password.');
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
        {/* Header */}
        <View className="bg-[#00654E] pt-16 pb-12 items-center">
          <Text className="text-white text-4xl font-bold tracking-wide">Flipurt</Text>
          <Text className="text-green-200 text-sm mt-1">USask Marketplace</Text>
        </View>

        <View className="flex-1 px-6 pt-10 gap-5">
          <View className="gap-1">
            <Text className="text-2xl font-semibold text-[#1A1A1A]">Sign in</Text>
            <Text className="text-[#666] text-sm">Use your USask email address</Text>
          </View>

          {/* Email */}
          <View className="gap-1.5">
            <Text className="text-sm font-medium text-[#1A1A1A]">Email</Text>
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

          {error && <Text className="text-red-500 text-sm">{error}</Text>}

          {/* Sign in button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className="bg-[#F4C430] rounded-lg py-4 items-center mt-2"
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading
              ? <ActivityIndicator color="#1A1A1A" />
              : <Text className="text-[#1A1A1A] font-bold text-base">Sign In</Text>
            }
          </TouchableOpacity>

          {/* Link to signup */}
          <View className="flex-row justify-center gap-1 mt-2">
            <Text className="text-[#666] text-sm">Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/signup' as any)}>
              <Text className="text-[#00654E] text-sm font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
