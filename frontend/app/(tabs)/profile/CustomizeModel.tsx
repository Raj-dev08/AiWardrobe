import React, { useEffect, useState } from "react";
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

export default function CustomizeModel() {
  const insets = useSafeAreaInsets();
  const { previewModel, fetchPreviewModel, customizePreviewModel, loading } = usePreviewStore();
  const router = useRouter();

  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
  const [chest, setChest] = useState("");
  const [waist, setWaist] = useState("");
  const [hips, setHips] = useState("");
  const [color, setColor] = useState("#E8B88A");

  useEffect(() => {
    if (!previewModel) fetchPreviewModel();
  }, []);

  useEffect(() => {
    if (previewModel) {
      setWeight(String(previewModel.weight));
      setHeight(String(previewModel.height));
      setAge(String(previewModel.age));
      setGender(previewModel.gender);
      setColor(previewModel.skinColor);
      setChest(String(previewModel.measurement?.chest ?? ""));
      setWaist(String(previewModel.measurement?.waist ?? ""));
      setHips(String(previewModel.measurement?.hips ?? ""));
    }
  }, [previewModel]);

  const handleSubmit = async () => {
    if (!previewModel) return;
    const payload: any = {};
    if (weight) payload.weight = Number(weight);
    if (height) payload.height = Number(height);
    if (age) payload.age = Number(age);
    if (gender) payload.gender = gender;
    if (color) payload.skinColor = color;
    if (chest) payload.chest = Number(chest);
    if (waist) payload.waist = Number(waist);
    if (hips) payload.hips = Number(hips);

    const success = await customizePreviewModel(payload);
    if (success) router.back();
  };

  if (!previewModel && loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{
        paddingTop: insets.top + 20,
        paddingBottom: insets.bottom + 40,
        paddingHorizontal: 20,
      }}
    >
      <Text className="text-2xl font-bold mb-6">Customize Preview Model</Text>

      <Text className="mb-1 font-semibold">Age</Text>
      <TextInput
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        className="border border-gray-300 rounded-lg p-3 mb-4"
      />

      <Text className="mb-1 font-semibold">Height (cm)</Text>
      <TextInput
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
        className="border border-gray-300 rounded-lg p-3 mb-4"
      />

      <Text className="mb-1 font-semibold">Weight (kg)</Text>
      <TextInput
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
        className="border border-gray-300 rounded-lg p-3 mb-4"
      />

      <Text className="mb-2 font-semibold">Measurements (cm)</Text>
      <TextInput
        value={chest}
        onChangeText={setChest}
        keyboardType="numeric"
        placeholder="Chest"
        className="border border-gray-300 rounded-lg p-3 mb-3"
      />
      <TextInput
        value={waist}
        onChangeText={setWaist}
        keyboardType="numeric"
        placeholder="Waist"
        className="border border-gray-300 rounded-lg p-3 mb-3"
      />
      <TextInput
        value={hips}
        onChangeText={setHips}
        keyboardType="numeric"
        placeholder="Hips"
        className="border border-gray-300 rounded-lg p-3 mb-6"
      />

      <Text className="mb-2 font-semibold">Gender</Text>
      <View className="flex-row mb-6">
        {["male", "female", "other"].map((g) => (
          <TouchableOpacity
            key={g}
            onPress={() => setGender(g as any)}
            className={`mr-3 px-4 py-2 rounded-lg ${gender === g ? "bg-black" : "bg-gray-200"}`}
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
            className="w-12 h-12 rounded-full mr-3 mb-3 items-center justify-center"
          >
            {color === tone.color && (
              <Text className="text-white font-bold text-lg">✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <Text className="mb-4 text-gray-500">
        Selected: {SKIN_TONES.find((t) => t.color === color)?.label ?? "Custom"}
      </Text>

      <Text className="mb-1 font-semibold">Custom Hex Color</Text>
      <TextInput
        value={color}
        onChangeText={setColor}
        placeholder="#E8B88A"
        className="border border-gray-300 rounded-lg p-3 mb-4"
      />

      <View style={{ backgroundColor: color }} className="h-16 rounded-lg mb-6" />

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        className="bg-black py-4 rounded-lg items-center"
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-semibold text-lg">Update Model</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}