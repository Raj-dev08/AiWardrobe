import React, { useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useWardrobeStore } from "@/store/useWardrobeStore";
import WardrobeSkia from "@/components/manequin";
import { useRouter } from "expo-router";


// Example unisex clothes images
const placeholderTop = "https://i.pinimg.com/736x/6d/7f/4c/6d7f4cca86eb50b938bf801fdc622ff2.jpg";
const placeholderBottom = "https://i.pinimg.com/736x/7d/f7/50/7df7504573ba1795baf734e5566c1609.jpg";
const placeholderShoes = "https://media.istockphoto.com/id/182850119/photo/blue-sneakers-on-a-white-background.jpg?s=612x612&w=0&k=20&c=-omJkiZnXMNFeAof2CEzAdo5d4ZgrayWq2ktVDmADCI=";
// const mannequin = "https://static.vecteezy.com/system/resources/thumbnails/046/449/471/small/a-mannequin-in-a-white-body-suit-standing-on-a-transparent-background-free-png.png";

export default function WardrobeScreen() {
  const insets = useSafeAreaInsets();
  const { wardrobe, loading, fetchWardrobe, createWardrobe } = useWardrobeStore();
  const router = useRouter();

  useEffect(() => {
    fetchWardrobe();
  }, []);

  const handleCreate = async () => {
    await createWardrobe();
  };



  const renderClothing = (items: string, placeholder: string, category: string) => {

      return (
        <View className="items-center mb-2 border border-gray-300 rounded-lg p-1 bg-white shadow">
          <Image
            source={{ uri: items || placeholder }}
            className="w-24 h-32"
            style={{ resizeMode: "contain" }}
          />
          <Text className="text-xs font-medium mt-1 text-gray-700 text-center">{category}</Text>
        </View>
      );
  
  };

  return (
    <View
      className="flex-1 bg-white items-center"
      style={{ paddingTop: insets.top + 20 }}
    >
      {loading && (
        <View className="absolute inset-0 bg-black/30 justify-center items-center z-50">
          <ActivityIndicator size="large" color="#000" />
        </View>
      )}

      {!loading && !wardrobe && (
        <View className="flex-1 justify-center items-center">
          <Text className="text-2xl font-semibold mb-6 text-center">
            No wardrobe found
          </Text>
          <TouchableOpacity
            onPress={handleCreate}
            className="bg-black py-4 px-8 rounded-xl"
          >
            <Text className="text-white font-semibold text-lg">
              Create your first wardrobe
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && wardrobe && (
        <View className="w-full h-4/5 relative items-center justify-center z-10">
          {/* Mannequin */}
          {/* <Image
            source={{ uri: mannequin }}
            className="absolute w-full h-full top-4 z-10"
            style={{ resizeMode: "contain" }}
          /> */}

          <WardrobeSkia wardrobe={wardrobe}/>

          {/* Top - torso */}
          <TouchableOpacity className="absolute top-1/4 left-10 z-20" onPress={() => router.push("/wardrobe/tops")}>{renderClothing(wardrobe?.top[0]?.imageUrl || '', placeholderTop,'Top')}</TouchableOpacity>

          {/* Bottom - legs */}
          <TouchableOpacity className="absolute top-2/4 right-10 z-20" onPress={() => router.push("/wardrobe/bottoms")}>{renderClothing(wardrobe?.bottom[0]?.imageUrl || '', placeholderBottom , 'Bottom')}</TouchableOpacity>

          {/* Shoes - feet */}
          <TouchableOpacity className="absolute top-3/4 left-10 z-20" onPress={() => router.push("/wardrobe/shoes")}>{renderClothing(wardrobe?.shoes[0]?.imageUrl || '', placeholderShoes, 'Shoes')}</TouchableOpacity>
        </View>
      )}
    </View>
  );
}