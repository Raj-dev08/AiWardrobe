import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Image,
  TouchableOpacity,
  ToastAndroid,
  useWindowDimensions
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useWardrobeStore } from "@/store/useWardrobeStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Canvas, Image as SkiaImage, useImage } from "@shopify/react-native-skia";
import { Ionicons } from "@expo/vector-icons";

export default function BottomsPage() {
  const { wardrobe, loading, fetchWardrobe, addClothingItem, removeClothingItem } = useWardrobeStore();
  const [selectedBottom, setSelectedBottom] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  useEffect(() => {
    fetchWardrobe();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchWardrobe();
    setRefreshing(false);
  }, []);

  const mannequin = useImage(require('../../../assets/images/bottomMan.png'));
  const bottomImg = useImage(selectedBottom || require('../../../assets/images/bottom.png'));

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 0.6,
    });

    if (!result.canceled) {
      setImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      ToastAndroid.show("Pick an image first", ToastAndroid.SHORT);
      return;
    }
    await addClothingItem("Bottom", image);
    setImage(null);
    setShowForm(false);
  };

  const handleDelete = async (bottomId: string) => {
    await removeClothingItem("Bottom", bottomId);
  };

  if (loading || !wardrobe) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className="px-4">
        <Text className="text-2xl font-bold mb-4">Your Bottoms</Text>

        {/* Skia Preview */}
        <View style={{ flex: 1, backgroundColor: "white", alignItems: "center", justifyContent: "center" }}>
          <Canvas style={{ width: width * 0.7, height: width * 1.4 }}>
            <SkiaImage image={mannequin} x={10} y={0} width={width * 0.7} height={width * 1.4} />
            <SkiaImage image={bottomImg} x={0} y={0} width={width * 0.7} height={width * 1.4} />
          </Canvas>
        </View>

        {/* Add New Bottom Form */}
        {!showForm && (
          <TouchableOpacity
            onPress={() => setShowForm(true)}
            className="bg-black py-3 px-4 rounded-lg mb-4 items-center"
          >
            <Text className="text-white font-semibold text-lg">Add New Bottom</Text>
          </TouchableOpacity>
        )}

        {showForm && (
          <View className="mb-4 border p-4 rounded-lg bg-gray-100">
            <Text className="text-md font-semibold mb-2">
              Upload a clean centered photo of your bottom on a plain background for best results.
            </Text>
            <Text className="text-xs font-semibold mb-2">
              Upload can take up to 30 seconds as we process the image and update your wardrobe.
            </Text>

            {image && (
              <Image
                source={{ uri: image }}
                style={{ width: 150, height: 200, resizeMode: "contain", marginBottom: 10 }}
              />
            )}

            <TouchableOpacity
              onPress={pickImage}
              className="bg-gray-800 py-2 px-4 rounded mb-2 items-center"
            >
              <Text className="text-white">Pick Image</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-blue-600 py-2 px-4 rounded mb-2 items-center"
            >
              <Text className="text-white">Submit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setShowForm(false);
                setImage(null);
              }}
              className="bg-red-500 py-2 px-4 rounded items-center"
            >
              <Text className="text-white">Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Grid of Bottoms with Delete */}
        <View className="flex-row flex-wrap -mx-2">
          {wardrobe.bottom.map((bottom) => {
            const isSelected = selectedBottom === bottom.imageUrl;
            return (
              <View key={bottom._id} className="p-2 w-1/2 md:w-1/3">
                <View className={`border-2 rounded-lg overflow-hidden ${isSelected ? "border-blue-500" : "border-gray-300"}`}>
                  <TouchableOpacity
                    onPress={() => setSelectedBottom(bottom.imageUrl)}
                  >
                    <Image
                      source={{ uri: bottom.imageUrl }}
                      style={{ width: "100%", height: 160, resizeMode: "contain" }}
                    />
                  </TouchableOpacity>

                  {/* Delete Button */}
                  <TouchableOpacity
                    onPress={() => handleDelete(bottom._id)}
                    className="absolute top-1 right-1 bg-white rounded-full p-1"
                  >
                    <Ionicons name="trash" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {wardrobe.bottom.length === 0 && (
          <Text className="text-center text-gray-500 mt-4">No bottoms added yet.</Text>
        )}
      </View>
    </ScrollView>
  );
}