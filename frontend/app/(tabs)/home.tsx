import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSuggestionStore } from "@/store/useSuggestionStore";

export default function SuggestionsPage() {
  const insets = useSafeAreaInsets();
  const {
    suggestion,
    loading,
    generateSuggestion,
    clearSuggestion,
  } = useSuggestionStore();

  const [eventDescription, setEventDescription] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const handleGenerate = async () => {
    await generateSuggestion(eventDescription);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    clearSuggestion();
    setRefreshing(false);
  };


  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{
        paddingTop: insets.top + 20,
        paddingBottom: insets.bottom + 40,
        paddingHorizontal: 20,
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text className="text-2xl font-bold mb-4">
        AI Outfit Suggestions
      </Text>

      {/* Input */}
      <TextInput
        value={eventDescription}
        onChangeText={setEventDescription}
        placeholder="Describe your event (e.g. wedding, beach party, office meeting...)"
        multiline
        className="border border-gray-300 rounded-lg p-4 mb-4 text-base"
      />

      {/* Button */}
      <TouchableOpacity
        onPress={handleGenerate}
        disabled={loading}
        className="bg-black py-4 rounded-lg items-center mb-6"
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-semibold text-lg">
            Generate Suggestion
          </Text>
        )}
      </TouchableOpacity>

      {/* Suggestions */}
      {suggestion && (
        <View className="space-y-6">

          {/* TOP */}
          {suggestion.top && suggestion.top.length > 0 && (
            <View>
              <Text className="text-lg font-semibold mb-2">Top</Text>
              <View className="flex-row flex-wrap -mx-2">
                {suggestion.top.map((item: any) => (
                  <View key={item._id} className="p-2 w-1/2">
                    <View className="border rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        source={{ uri: item.imageUrl }}
                        style={{ width: "100%", height: 160 }}
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* BOTTOM */}
          {suggestion.bottom && suggestion.bottom.length > 0 && (
            <View>
              <Text className="text-lg font-semibold mb-2">Bottom</Text>
              <View className="flex-row flex-wrap -mx-2">
                {suggestion.bottom.map((item: any) => (
                  <View key={item._id} className="p-2 w-1/2">
                    <View className="border rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        source={{ uri: item.imageUrl }}
                        style={{ width: "100%", height: 160 }}
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* SHOES */}
          {suggestion.shoes && suggestion.shoes.length > 0 && (
            <View>
              <Text className="text-lg font-semibold mb-2">Shoes</Text>
              <View className="flex-row flex-wrap -mx-2">
                {suggestion.shoes.map((item: any) => (
                  <View key={item._id} className="p-2 w-1/2">
                    <View className="border rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        source={{ uri: item.imageUrl }}
                        style={{ width: "100%", height: 160 }}
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ACCESSORIES */}
          {suggestion.accessories && (
            <View className="mt-4">
              <Text className="text-lg font-semibold mb-2">
                Accessories
              </Text>
              <View className="bg-gray-100 p-4 rounded-lg">
                <Text className="text-gray-700">
                  {suggestion.accessories}
                </Text>
              </View>
            </View>
          )}
        </View>
      )}

      { ( !suggestion?.bottom?.length && !suggestion?.top?.length && !suggestion?.shoes?.length) && eventDescription && (
        <Text className="text-center text-gray-500 mt-6">
          No matching dress in wardrobe. Try adding more items to your wardrobe or be more specific in your description (e.g. "casual beach party" instead of just "beach party").
        </Text>
      ) }

      {!loading && suggestion && Object.keys(suggestion).length === 0 && (
        <Text className="text-center text-gray-500 mt-6">
          No matching items found in your wardrobe.
        </Text>
      )}
    </ScrollView>
  );
}