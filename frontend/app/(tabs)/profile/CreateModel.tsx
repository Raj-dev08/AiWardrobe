import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ColorPicker from "react-native-wheel-color-picker";
import { usePreviewStore } from "@/store/usePreviewStore";
import { useRouter } from "expo-router";

export default function CreateModel() {
  const insets = useSafeAreaInsets();
  const { createPreviewModel, loading } = usePreviewStore();

  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");

  const [color, setColor] = useState("rgb(255,224,189)");

  const router = useRouter();

  const handleSubmit = async () => {
    if (!weight || !height || !age || !color) return;

    const success = await createPreviewModel({
      weight: Number(weight),
      height: Number(height),
      age: Number(age),
      gender,
      skinColor: color,
    });

    if (success) {
      setWeight("");
      setHeight("");
      setAge("");
      router.back();
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{
        paddingTop: insets.top + 20,
        paddingBottom: insets.bottom + 40,
        paddingHorizontal: 20,
      }}
    >
      <Text className="text-2xl font-bold mb-6">Create Preview Model</Text>

      {/* Basic Inputs */}
      <Text className="mb-1 font-semibold">Age</Text>
      <TextInput
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        placeholder="Enter age"
        className="border border-gray-300 rounded-lg p-3 mb-4"
      />

      <Text className="mb-1 font-semibold">Height (cm)</Text>
      <TextInput
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
        placeholder="Enter height"
        className="border border-gray-300 rounded-lg p-3 mb-4"
      />

      <Text className="mb-1 font-semibold">Weight (kg)</Text>
      <TextInput
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
        placeholder="Enter weight"
        className="border border-gray-300 rounded-lg p-3 mb-4"
      />

      {/* Gender */}
      <Text className="mb-2 font-semibold">Gender</Text>
      <View className="flex-row mb-6">
        {["male", "female", "other"].map((g) => (
          <TouchableOpacity
            key={g}
            onPress={() => setGender(g as any)}
            className={`mr-3 px-4 py-2 rounded-lg ${
              gender === g ? "bg-black" : "bg-gray-200"
            }`}
          >
            <Text
              className={`${
                gender === g ? "text-white" : "text-black"
              } font-semibold`}
            >
              {g}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Color Picker */}
      <Text className="mb-2 font-semibold">Skin Color</Text>

      <View className="items-center mb-4">
        <ColorPicker
          color={color}
          onColorChangeComplete={(c) => setColor(c)}
          thumbSize={30}
          sliderSize={30}
          noSnap={true}
          row={false}
        />
      </View>

      {/* Raw RGB Input */}
      <Text className="mb-1 font-semibold">RGB Value</Text>
      <TextInput
        value={color}
        onChangeText={setColor}
        placeholder="rgb(255,224,189)"
        className="border border-gray-300 rounded-lg p-3 mb-6"
      />

      {/* Preview Box */}
      <View
        style={{ backgroundColor: color }}
        className="h-16 rounded-lg mb-6"
      />

      {/* Submit */}
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        className="bg-black py-4 rounded-lg items-center"
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-semibold text-lg">
            Create Model
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}