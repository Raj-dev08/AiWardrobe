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

export default function Signup() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signup, loading } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [noNameError, setNoNameError] = useState(false);
  const [noEmailError, setNoEmailError] = useState(false);
  const [noPasswordError, setNoPasswordError] = useState(false);

  const handleSignup = async () => {
    if (!name) {
      setNoNameError(true);
      return;
    } else {
      setNoNameError(false);
    }

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

    const success = await signup({
      name,
      email,
      password,
      fcmToken: "", // pass actual token later
    });

    if (success) {
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
            Create Account
          </Text>

          <Text className="text-md font-bold text-semibold text-gray-500 mb-2 text-center">
            Sign up to get started!
          </Text>
        </View>

        {/* Name */}
        <View className="mb-5">
          <Text className="text-gray-700 mb-2 font-medium">Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="John Doe"
            placeholderTextColor="#9CA3AF"
            className={`border ${noNameError ? "border-red-500 border-2" : "border-gray-300"} rounded-xl px-4 py-3 text-black`}
          />
          {noNameError && (
            <Ionicons name="alert-circle-outline" size={20} color="red" className="absolute right-4 top-10" />
          )}
        </View>

        {/* Email */}
        <View className="mb-5">
          <Text className="text-gray-700 mb-2 font-medium">Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="john@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#9CA3AF"
            className={`border ${noEmailError ? "border-red-500 border-2" : "border-gray-300"} rounded-xl px-4 py-3 text-black`}
          />
          {noEmailError && (
            <Ionicons name="alert-circle-outline" size={20} color="red" className="absolute right-4 top-10" />
          )}
        </View>

        {/* Password */}
        <View className="mb-8">
          <Text className="text-gray-700 mb-2 font-medium">Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            placeholderTextColor="#9CA3AF"
            className={`border ${noPasswordError ? "border-red-500 border-2" : "border-gray-300"} rounded-xl px-4 py-3 text-black`}
          />
          {noPasswordError && (
            <Ionicons name="alert-circle-outline" size={20} color="red" className="absolute right-4 top-10" />
          )}
        </View>

        {/* Signup Button */}
        <TouchableOpacity
          onPress={handleSignup}
          disabled={loading}
          className="bg-black py-4 rounded-xl items-center"
        >
          <Text className="text-white font-semibold text-base">
            Create Account
          </Text>
        </TouchableOpacity>

        {/* Login Redirect */}
        <TouchableOpacity
          onPress={() => router.push("/(auth)/login")}
          className="mt-6 items-center"
        >
          <Text className="text-gray-500">
            Already have an account?{" "}
            <Text className="text-black font-semibold">Login</Text>
          </Text>
        </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Loader Overlay */}
      {loading && (
        <View className="absolute inset-0 bg-black/30 justify-center items-center">
          <ActivityIndicator size="large" color="#000" />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}