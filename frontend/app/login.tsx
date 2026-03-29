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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  async function handleLogin() {
    setError(null);
    if (!email || !password) {
      setError(t('auth.fillAllFields'));
      return;
    }
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
      router.replace('/(tabs)');
    } catch (e: any) {
      const msg: string = e?.message ?? '';
      console.error('[LOGIN ERROR]', e);
      if (msg.includes('403')) setError(t('auth.usaskOnly'));
      else if (msg.includes('401')) setError(t('auth.incorrectCredentials'));
      else setError(msg || t('auth.somethingWrong'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-white" style={{ paddingBottom: insets.bottom }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View
          className="bg-[#00654E] pb-12 items-center"
          style={{ paddingTop: insets.top + (Platform.OS === 'ios' ? 20 : 40) }}
        >
          <Text className="text-white text-4xl font-bold tracking-wide">{t('auth.appName')}</Text>
          <Text className="text-green-200 text-sm mt-1">{t('auth.tagline')}</Text>
        </View>

        <View className="flex-1 px-6 pt-10 gap-5">
          <View className="gap-1">
            <Text className="text-2xl font-semibold text-[#1A1A1A]">{t('auth.signIn')}</Text>
            <Text className="text-[#666] text-sm">{t('auth.useUsaskEmail')}</Text>
          </View>

          {/* Email */}
          <View className="gap-1.5">
            <Text className="text-sm font-medium text-[#1A1A1A]">{t('auth.email')}</Text>
            <TextInput
              className="border border-[#E0E0E0] rounded-lg px-4 py-3 text-[#1A1A1A] text-base"
              placeholder={t('auth.emailPlaceholder')}
              placeholderTextColor="#999"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Password */}
          <View className="gap-1.5">
            <Text className="text-sm font-medium text-[#1A1A1A]">{t('auth.password')}</Text>
            <TextInput
              className="border border-[#E0E0E0] rounded-lg px-4 py-3 text-[#1A1A1A] text-base"
              placeholder={t('auth.passwordPlaceholder')}
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
              : <Text className="text-[#1A1A1A] font-bold text-base">{t('auth.signInButton')}</Text>
            }
          </TouchableOpacity>

          {/* Link to signup */}
          <View className="flex-row justify-center gap-1 mt-2">
            <Text className="text-[#666] text-sm">{t('auth.noAccount')}</Text>
            <TouchableOpacity onPress={() => router.push('/signup' as any)}>
              <Text className="text-[#00654E] text-sm font-semibold">{t('auth.signUp')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
