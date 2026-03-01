import { Stack, Slot, useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {  ActivityIndicator } from "react-native";

export default function RootLayout() {
  const { checkAuth } = useAuthStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const verifyAuth = async () => {
      const user = await checkAuth();
      if (!user) router.replace("/(auth)/signup")
      else router.replace("/(tabs)/home");
    };
    verifyAuth();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <SafeAreaView className="flex-1"
      style={ { paddingBottom: insets.bottom }}>
        <Slot />
        <ActivityIndicator
          className="absolute top-1/2 left-1/2 -ml-15 -mt-15"
          size="large"
        />
      </SafeAreaView>
    </Stack>
  );
}
