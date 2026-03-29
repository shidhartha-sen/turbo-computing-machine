import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useTranslatingState } from "@/context/TranslationContext";

export function TranslatingOverlay() {
  const { isTranslating } = useTranslatingState();
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(isTranslating ? 1 : 0, { duration: 250 });
  }, [isTranslating]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    pointerEvents: isTranslating ? ("auto" as const) : ("none" as const),
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        },
        animatedStyle,
      ]}
    >
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 16,
          padding: 32,
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        <ActivityIndicator size="large" color="#00654E" />
        <Text
          style={{
            marginTop: 16,
            fontSize: 16,
            fontWeight: "600",
            color: "#1A1A1A",
          }}
        >
          Translating...
        </Text>
      </View>
    </Animated.View>
  );
}
