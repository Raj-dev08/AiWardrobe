import React, { useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { usePreviewStore } from "@/store/usePreviewStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const Profile = () => {
  const { user } = useAuthStore();
  const {
    previewModel,
    loading,
    fetchPreviewModel,
  } = usePreviewStore();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  useEffect(() => {
    fetchPreviewModel();
  }, []);

  if (!user) return null;

  const initial = user.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <ScrollView className="flex-1 bg-white p-6" style={{ paddingTop: insets.top + 20 }}>
      {/* User Badge */}
      <View className="items-center mb-8">
        <View className="w-24 h-24 rounded-full bg-black items-center justify-center mb-4">
          <Text className="text-white text-4xl font-bold">{initial}</Text>
        </View>

        <Text className="text-2xl font-bold">{user.name}</Text>
        <Text className="text-gray-500">{user.email}</Text>
      </View>

      {/* Preview Model Section */}
      <View>
        <Text className="text-xl font-bold mb-4">Preview Model</Text>

        {loading ? (
          <ActivityIndicator size="large" />
        ) : !previewModel ? (
          <TouchableOpacity
            className="bg-black py-3 px-4 rounded-lg items-center"
            onPress={() => {
              router.push("/profile/createmodel");
            }}
          >
            <Text className="text-white font-semibold">
              Create Preview Model
            </Text>
          </TouchableOpacity>
        ) : (
          <View className="bg-gray-100 p-4 rounded-lg">
            <Text className="mb-2">
              <Text className="font-semibold">Gender:</Text>{" "}
              {previewModel.gender}
            </Text>
            <Text className="mb-2">
              <Text className="font-semibold">Age:</Text>{" "}
              {previewModel.age}
            </Text>
            <Text className="mb-2">
              <Text className="font-semibold">Height:</Text>{" "}
              {previewModel.height} cm
            </Text>
            <Text className="mb-2">
              <Text className="font-semibold">Weight:</Text>{" "}
              {previewModel.weight} kg
            </Text>
            <View className="mb-2 flex-row items-center">
              <Text className="font-semibold">Skin Color: </Text>
              <View style={{ backgroundColor: previewModel.skinColor }} className="w-10 h-6 rounded-full" />
            </View>

            <Text className="mt-4 font-semibold">Measurements</Text>
            <Text>Chest: {previewModel.measurement.chest} cm</Text>
            <Text>Waist: {previewModel.measurement.waist} cm</Text>
            <Text>Hips: {previewModel.measurement.hips} cm</Text>

            <TouchableOpacity
              className="bg-blue-600 mt-4 py-2 px-4 rounded items-center"
              onPress={() => {
                router.push("/profile/customizemodel");
              }}
            >
              <Text className="text-white font-semibold">
                Customize Model
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Profile;