import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/useAuthStore";

export default function Login() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login, loading } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [noEmailError, setNoEmailError] = useState(false);
  const [noPasswordError, setNoPasswordError] = useState(false);

  const handleLogin = async () => {
    if (!email) {
      setNoEmailError(true);
      return;
    } else {
      setNoEmailError(false);
    }

    if (!password) {
      setNoPasswordError(true);
      return;
    } else {
      setNoPasswordError(false);
    }

    const res = await login({ email, password });

    if (res) {
      router.replace("/(tabs)/home");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 40,
          paddingBottom: 40,
          flexGrow: 1,
          justifyContent: "center",
        }}
        className="mx-10"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex justify-center px-4">
          {/* Header */}
          <View className="mb-10">
            <Text className="text-3xl font-bold text-black mb-2 text-center">
              Welcome Back
            </Text>
            <Text className="text-md font-semibold text-gray-500 text-center">
              Login to continue
            </Text>
          </View>

          {/* Email */}
          <View className="mb-5 relative">
            <Text className="text-gray-700 mb-2 font-medium">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="john@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9CA3AF"
              className={`border ${
                noEmailError
                  ? "border-red-500 border-2"
                  : "border-gray-300"
              } rounded-xl px-4 py-3 text-black`}
            />
            {noEmailError && (
              <Ionicons
                name="alert-circle-outline"
                size={20}
                color="red"
                style={{ position: "absolute", right: 15, top: 42 }}
              />
            )}
          </View>

          {/* Password */}
          <View className="mb-8 relative">
            <Text className="text-gray-700 mb-2 font-medium">Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              placeholderTextColor="#9CA3AF"
              className={`border ${
                noPasswordError
                  ? "border-red-500 border-2"
                  : "border-gray-300"
              } rounded-xl px-4 py-3 text-black`}
            />
            {noPasswordError && (
              <Ionicons
                name="alert-circle-outline"
                size={20}
                color="red"
                style={{ position: "absolute", right: 15, top: 42 }}
              />
            )}
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className="bg-black py-4 rounded-xl items-center"
          >
            <Text className="text-white font-semibold text-base">
              Login
            </Text>
          </TouchableOpacity>

          {/* Signup Redirect */}
          <TouchableOpacity
            onPress={() => router.push("/(auth)/signup")}
            className="mt-6 items-center"
          >
            <Text className="text-gray-500">
              Don’t have an account?{" "}
              <Text className="text-black font-semibold">Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Loader */}
      {loading && (
        <View className="absolute inset-0 bg-black/30 justify-center items-center">
          <ActivityIndicator size="large" color="#000" />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}