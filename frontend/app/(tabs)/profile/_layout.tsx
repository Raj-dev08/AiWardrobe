import { Stack } from "expo-router";

export default function UserProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "none"
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}