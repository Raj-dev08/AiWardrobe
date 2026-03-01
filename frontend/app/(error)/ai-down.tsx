import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AiServiceDown() {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Slow rotation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View className="flex-1 bg-black justify-center items-center px-6">
      
      {/* Animated AI Icon */}
      <Animated.View
        style={{
          transform: [{ scale: pulseAnim }, { rotate }],
        }}
        className="bg-white/10 p-8 rounded-full mb-8"
      >
        <Ionicons name="hardware-chip-outline" size={60} color="#fff" />
      </Animated.View>

      {/* Title */}
      <Text className="text-white text-2xl font-bold text-center mb-3">
        AI Helper is Taking a Break
      </Text>

      {/* Subtitle */}
      <Text className="text-gray-400 text-center text-base mb-6">
        We’re unable to generate outfit suggestions right now.
        Our AI service is temporarily unavailable.
      </Text>

      {/* Status Badge */}
      <View className="bg-red-500/20 px-4 py-2 rounded-full">
        <Text className="text-red-400 font-semibold">
          Service Unavailable
        </Text>
      </View>

      {/* Footer Note */}
      <Text className="text-gray-500 text-xs text-center mt-8">
        Please come back after a few minutes and try again.
      </Text>
    </View>
  );
}