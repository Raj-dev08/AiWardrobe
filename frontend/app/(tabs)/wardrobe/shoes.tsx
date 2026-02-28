import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Linking,
  ToastAndroid,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useWardrobeStore } from "@/store/useWardrobeStore";
import { Ionicons } from "@expo/vector-icons";

export default function ShoesPage() {
  const { wardrobe, loading, fetchWardrobe, addClothingItem, removeClothingItem } = useWardrobeStore();
  const [refreshing, setRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchWardrobe();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchWardrobe();
    setRefreshing(false);
  }, []);

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
    await addClothingItem("Shoes", image);
    setImage(null);
    setShowForm(false);
  };

  const handleDelete = async (shoeId: string) => {
    await removeClothingItem("Shoes", shoeId);
  };

  const openShoeLink = (url: string) => {
    if (url) Linking.openURL(url);
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
        <Text className="text-2xl font-bold mb-4">Your Shoes</Text>

        {/* Add New Shoe Form */}
        {!showForm && (
          <TouchableOpacity
            onPress={() => setShowForm(true)}
            className="bg-black py-3 px-4 rounded-lg mb-4 items-center"
          >
            <Text className="text-white font-semibold text-lg">Add New Shoe</Text>
          </TouchableOpacity>
        )}

        {showForm && (
          <View className="mb-4 border p-4 rounded-lg bg-gray-100">
            <Text className="text-md font-semibold mb-2">
              Upload a clean photo of your shoe for best results.
            </Text>

            {image && (
              <Image
                source={{ uri: image }}
                style={{ width: 150, height: 160, resizeMode: "contain", marginBottom: 10 }}
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

        {/* Grid of Shoes with Delete */}
        <View className="flex-row flex-wrap -mx-2">
          {wardrobe.shoes.map((shoe) => (
            <View key={shoe._id} className="p-2 w-1/2 md:w-1/3">
              <View className="border-2 rounded-lg overflow-hidden border-gray-300">
                <TouchableOpacity onPress={() => openShoeLink(shoe.imageUrl)}>
                  <Image
                    source={{ uri: shoe.imageUrl }}
                    style={{ width: "100%", height: 160, resizeMode: "contain" }}
                  />
                </TouchableOpacity>

                {/* Delete Button */}
                <TouchableOpacity
                  onPress={() => handleDelete(shoe._id)}
                  className="absolute top-1 right-1 bg-white rounded-full p-1"
                >
                  <Ionicons name="trash" size={20} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {wardrobe.shoes.length === 0 && (
          <Text className="text-center text-gray-500 mt-4">No shoes added yet.</Text>
        )}
      </View>
    </ScrollView>
  );
}