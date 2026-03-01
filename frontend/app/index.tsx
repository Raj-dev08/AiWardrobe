import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Easing } from "react-native";
import "../global.css";

export default function Index() {
  const spinValue = useRef(new Animated.Value(0)).current;
  const floatValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Continuous rotation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatValue, {
          toValue: -15,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatValue, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View className="flex-1 bg-black items-center justify-center px-6">
      
      {/* Animated Logo */}
      <Animated.View
        style={{
          transform: [
            { rotate: spin },
            { translateY: floatValue }
          ],
        }}
        className="w-28 h-28 rounded-full bg-white items-center justify-center shadow-2xl"
      >
        <Text className="text-4xl font-bold text-black">AI</Text>
      </Animated.View>

      {/* Title */}
      <Text className="text-white text-2xl font-bold mt-10 tracking-wide">
        Hold tight...
      </Text>

      <Text className="text-gray-400 text-center mt-3 text-base">
        Your app is cooking something powerful.
      </Text>

      {/* Pulsing Dots */}
      <View className="flex-row mt-6">
        {[0, 1, 2].map((i) => (
          <AnimatedDot key={i} delay={i * 300} />
        ))}
      </View>
    </View>
  );
}

function AnimatedDot({ delay }: { delay: number }) {
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 500,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.5,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        transform: [{ scale }],
      }}
      className="w-3 h-3 bg-white rounded-full mx-1"
    />
  );
}