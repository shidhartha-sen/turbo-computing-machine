import { ChevronRight } from 'lucide-react-native';
import { Switch, Text, TouchableOpacity, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

type BaseProps = {
  icon: React.ReactElement;
  label: string;
  sublabel?: string;
  last?: boolean;
};

type PressableRow = BaseProps & {
  type: 'nav';
  onPress: () => void;
  danger?: boolean;
};

type ToggleRow = BaseProps & {
  type: 'toggle';
  value: boolean;
  onValueChange: (v: boolean) => void;
};

type Props = PressableRow | ToggleRow;

export function SettingsRow(props: Props) {
  const { icon, label, sublabel, last } = props;

  const inner = (
    <View
      className="flex-row items-center px-4 py-3.5 bg-white"
      style={{ borderBottomWidth: last ? 0 : 1, borderBottomColor: '#F0F0F0' }}
    >
      {/* Icon container */}
      <View className="w-8 h-8 rounded-lg items-center justify-center mr-3" style={{ backgroundColor: '#F5F5F5' }}>
        {icon}
      </View>

      {/* Label */}
      <View className="flex-1">
        <Text
          className="text-sm font-semibold"
          style={{ color: props.type === 'nav' && props.danger ? '#EF4444' : '#1A1A1A' }}
        >
          {label}
        </Text>
        {sublabel ? <Text className="text-xs text-[#999] mt-0.5">{sublabel}</Text> : null}
      </View>

      {/* Right side */}
      {props.type === 'nav' ? (
        <ChevronRight size={16} color={props.danger ? '#EF4444' : '#C0C0C0'} />
      ) : (
        <Switch
          value={props.value}
          onValueChange={props.onValueChange}
          trackColor={{ false: '#E0E0E0', true: '#00654E' }}
          thumbColor="white"
        />
      )}
    </View>
  );

  if (props.type === 'nav') {
    return (
      <TouchableOpacity onPress={props.onPress} activeOpacity={0.7}>
        {inner}
      </TouchableOpacity>
    );
  }
  return inner;
}

export function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mb-4">
      <Text className="text-xs font-bold text-[#999] tracking-widest uppercase px-4 mb-2 mt-2">
        {title}
      </Text>
      <View className="rounded-2xl overflow-hidden mx-4" style={{ elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4 }}>
        {children}
      </View>
    </View>
  );
}
