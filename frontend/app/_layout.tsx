import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

export default function RootLayout() {
  const { checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      const user = await checkAuth();
      if (!user) router.replace("/(auth)/signup");
      else router.replace("/(tabs)/home");
    };
    verifyAuth();
  }, []);


  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}