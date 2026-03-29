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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function SignupScreen() {
  const { t } = useTranslation();
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
      setError(t('auth.fillAllFields'));
      return;
    }
    if (password !== confirm) {
      setError(t('auth.passwordsNoMatch'));
      return;
    }
    if (password.length < 8) {
      setError(t('auth.passwordTooShort'));
      return;
    }
    setLoading(true);
    try {
      await register(name.trim(), email.trim().toLowerCase(), password);
      router.replace('/(tabs)');
    } catch (e: any) {
      const msg: string = e?.message ?? '';
      console.error('[SIGNUP ERROR]', e);
      if (msg.includes('403')) setError(t('auth.usaskEmailOnly'));
      else if (msg.includes('409')) setError(t('auth.emailExists'));
      else setError(msg || t('auth.somethingWrong'));
    } finally {
      setLoading(false);
    }
  }

  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white" style={{ paddingBottom: insets.bottom }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View
            className="bg-[#00654E] pb-12 items-center"
            style={{ paddingTop: insets.top + (Platform.OS === 'ios' ? 20 : 40) }}
          >
            <Text className="text-white text-4xl font-bold tracking-wide">{t('auth.appName')}</Text>
            <Text className="text-green-200 text-sm mt-1">{t('auth.tagline')}</Text>
          </View>

          <View className="px-6 pt-10 gap-5">
            <View className="gap-1">
              <Text className="text-2xl font-semibold text-[#1A1A1A]">{t('auth.createAccount')}</Text>
              <Text className="text-[#666] text-sm">{t('auth.usaskStudentsOnly')}</Text>
            </View>

            {/* Full name */}
            <View className="gap-1.5">
              <Text className="text-sm font-medium text-[#1A1A1A]">{t('auth.fullName')}</Text>
              <TextInput
                className="border border-[#E0E0E0] rounded-lg px-4 py-3 text-[#1A1A1A] text-base"
                placeholder={t('auth.fullNamePlaceholder')}
                placeholderTextColor="#999"
                autoCapitalize="words"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Email */}
            <View className="gap-1.5">
              <Text className="text-sm font-medium text-[#1A1A1A]">{t('auth.usaskEmail')}</Text>
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

            {/* Confirm password */}
            <View className="gap-1.5">
              <Text className="text-sm font-medium text-[#1A1A1A]">{t('auth.confirmPassword')}</Text>
              <TextInput
                className="border border-[#E0E0E0] rounded-lg px-4 py-3 text-[#1A1A1A] text-base"
                placeholder={t('auth.passwordPlaceholder')}
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
                : <Text className="text-[#1A1A1A] font-bold text-base">{t('auth.createAccountButton')}</Text>
              }
            </TouchableOpacity>

            {/* Link to login */}
            <View className="flex-row justify-center gap-1 mt-2 pb-8">
              <Text className="text-[#666] text-sm">{t('auth.haveAccount')}</Text>
              <TouchableOpacity onPress={() => router.push('/login' as any)}>
                <Text className="text-[#00654E] text-sm font-semibold">{t('auth.signInButton')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
