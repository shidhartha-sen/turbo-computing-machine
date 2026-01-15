import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, Calendar, MessageCircle, DollarSign, User, MessageSquare, ShoppingBag } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useRef } from 'react';

const iconMap: { [key: string]: any } = {
    index: Home,
    message: MessageSquare,
    myItems: ShoppingBag,
    profile: User
};

function AnimatedTabButton({
    route,
    isFocused,
    options,
    onPress
}: {
    route: any;
    isFocused: boolean;
    options: any;
    onPress: () => void;
}) {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const backgroundOpacity = useRef(new Animated.Value(0)).current;
    const iconScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(backgroundOpacity, {
                toValue: isFocused ? 1 : 0,
                useNativeDriver: true,
                friction: 8,
                tension: 100,
            }),
            Animated.spring(iconScale, {
                toValue: isFocused ? 1.1 : 1,
                useNativeDriver: true,
                friction: 8,
                tension: 100,
            }),
        ]).start();
    }, [isFocused]);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.9,
            useNativeDriver: true,
            friction: 8,
            tension: 300,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            friction: 8,
            tension: 300,
        }).start();
    };

    const Icon = iconMap[route.name] || Home;

    return (
        <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={styles.tabButton}
            activeOpacity={1}
        >
            <Animated.View
                style={[
                    styles.iconContainer,
                    { transform: [{ scale: scaleAnim }] }
                ]}
            >
                <Animated.View
                    style={[
                        styles.activeBackground,
                        {
                            opacity: backgroundOpacity,
                            transform: [{ scale: backgroundOpacity }]
                        }
                    ]}
                >
                    <View style={styles.activeDot} />
                </Animated.View>
                <Animated.View style={{ transform: [{ scale: iconScale }] }}>
                    <Icon
                        size={24}
                        color={isFocused ? '#00673e' : '#9ca3af'}
                        strokeWidth={isFocused ? 2.5 : 2}
                    />
                </Animated.View>
            </Animated.View>
        </TouchableOpacity>
    );
}

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();
    const slideAnim = useRef(new Animated.Value(100)).current;

    useEffect(() => {
        Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            friction: 10,
            tension: 80,
        }).start();
    }, []);

    return (
        <Animated.View
            style={[
                styles.tabBar,
                {
                    paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
                    height: insets.bottom > 0 ? 70 + insets.bottom : 70,
                    transform: [{ translateY: slideAnim }]
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

                    return (
                        <AnimatedTabButton
                            key={route.key}
                            route={route}
                            isFocused={isFocused}
                            options={options}
                            onPress={onPress}
                        />
                    );
                })}
            </View>
        </Animated.View>
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
        backgroundColor: '#dff5eb',
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeDot: {
        width: 4,
        height: 4,
        backgroundColor: '#00673e',
        borderRadius: 2,
        position: 'absolute',
        bottom: 4,
    },
});