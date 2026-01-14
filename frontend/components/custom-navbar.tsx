import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, Calendar, MessageCircle, DollarSign, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const iconMap: { [key: string]: any } = {
    index: Home,
    bookings: Calendar,
    chat: MessageCircle,
    payments: DollarSign,
    profile: User,
};

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.tabBar,
                {
                    paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
                    height: insets.bottom > 0 ? 70 + insets.bottom : 70,
                },
            ]}
        >
            <View style={styles.floatingContainer}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const Icon = iconMap[route.name] || Home;

                    return (
                        <TouchableOpacity
                            key={route.key}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            onPress={onPress}
                            style={styles.tabButton}
                            activeOpacity={0.7}
                        >
                            <View style={styles.iconContainer}>
                                {isFocused && (
                                    <View style={styles.activeBackground}>
                                        <View style={styles.activeDot} />
                                    </View>
                                )}
                                <Icon
                                    size={24}
                                    color={isFocused ? '#3b82f6' : '#9ca3af'}
                                    strokeWidth={isFocused ? 2.5 : 2}
                                />
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        paddingHorizontal: 16,
    },
    floatingContainer: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 28,
        marginHorizontal: 8,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 10,
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
    },
    iconContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        width: 48,
        height: 48,
    },
    activeBackground: {
        position: 'absolute',
        width: 48,
        height: 48,
        backgroundColor: '#eff6ff',
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeDot: {
        width: 4,
        height: 4,
        backgroundColor: '#3b82f6',
        borderRadius: 2,
        position: 'absolute',
        bottom: 4,
    },
});