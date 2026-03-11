import { Stack, useRouter, useRootNavigationState } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

export default function RootLayout() {
  const { checkAuth } = useAuthStore();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key) return; // wait for navigation to be ready

    const verifyAuth = async () => {
      const user = await checkAuth();

      if (!user) {
        router.replace("/(auth)/signup");
      } else {
        router.replace("/(tabs)/home");
      }
    };

    verifyAuth();
  }, [navigationState]);

  return <Stack screenOptions={{ headerShown: false }} />;
}