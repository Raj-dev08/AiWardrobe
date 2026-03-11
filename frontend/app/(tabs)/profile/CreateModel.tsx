import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePreviewStore } from "@/store/usePreviewStore";
import { useRouter } from "expo-router";

const SKIN_TONES = [
  { label: "Very Fair", color: "#FDDBB4" },
  { label: "Fair", color: "#F5C99A" },
  { label: "Light", color: "#E8B88A" },
  { label: "Medium", color: "#D4956A" },
  { label: "Tan", color: "#C07E50" },
  { label: "Brown", color: "#A0622A" },
  { label: "Dark Brown", color: "#7A4520" },
  { label: "Deep", color: "#4A2510" },
];

export default function CreateModel() {
  const insets = useSafeAreaInsets();
  const { createPreviewModel, loading } = usePreviewStore();

  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
  const [color, setColor] = useState("#E8B88A");

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
            <Text className={`${gender === g ? "text-white" : "text-black"} font-semibold`}>
              {g}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Skin Tone Picker */}
      <Text className="mb-2 font-semibold">Skin Tone</Text>
      <View className="flex-row flex-wrap mb-4">
        {SKIN_TONES.map((tone) => (
          <TouchableOpacity
            key={tone.color}
            onPress={() => setColor(tone.color)}
            style={{ backgroundColor: tone.color }}
            className={`w-12 h-12 rounded-full mr-3 mb-3 items-center justify-center`}
          >
            {color === tone.color && (
              <Text className="text-white font-bold text-lg">✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Selected color label */}
      <Text className="mb-4 text-gray-500">
        Selected: {SKIN_TONES.find(t => t.color === color)?.label ?? "Custom"}
      </Text>

      {/* Manual hex input */}
      <Text className="mb-1 font-semibold">Custom Hex Color</Text>
      <TextInput
        value={color}
        onChangeText={setColor}
        placeholder="#E8B88A"
        className="border border-gray-300 rounded-lg p-3 mb-4"
      />

      {/* Preview */}
      <View style={{ backgroundColor: color }} className="h-16 rounded-lg mb-6" />

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        className="bg-black py-4 rounded-lg items-center"
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-semibold text-lg">Create Model</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}