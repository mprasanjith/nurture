import React, { useState } from 'react';
import { View, FlatList, Image } from 'react-native';
import { useRouter } from "expo-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";

const PlantSearchResult = ({ plant, onSelect }) => (
  <Card className="mb-4">
    <CardContent className="flex-row p-4">
      <Image
        source={{ uri: plant.image || '/api/placeholder/80/80' }}
        style={{ width: 80, height: 80, borderRadius: 8, marginRight: 16 }}
      />
      <View className="flex-1">
        <Text className="font-bold text-lg">{plant.name}</Text>
        <Text className="text-gray-500 text-sm">{plant.scientificName}</Text>
      </View>
    </CardContent>
    <CardFooter>
      <Button onPress={() => onSelect(plant)}>
        <Text>Select</Text>
      </Button>
    </CardFooter>
  </Card>
);

const AddPlantScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Here you would typically make an API call to search for plants
    // For now, we'll use some mock data
    const mockResults = [
      { id: '1', name: 'Monstera', scientificName: 'Monstera deliciosa', image: '/api/placeholder/80/80' },
      { id: '2', name: 'Snake Plant', scientificName: 'Sansevieria trifasciata', image: '/api/placeholder/80/80' },
      // Add more mock data as needed
    ];
    setSearchResults(mockResults.filter(plant => 
      plant.name.toLowerCase().includes(query.toLowerCase()) ||
      plant.scientificName.toLowerCase().includes(query.toLowerCase())
    ));
  };

  const handleCameraPress = () => {
    // You'll implement the camera functionality here
    console.log('Open camera for plant identification');
  };

  const handlePlantSelect = (plant) => {
    // Navigate to a screen to add details for the selected plant
    router.push({ pathname: '/add-plant-details', params: { plantId: plant.id } });
  };

  return (
    <View className="flex-1 p-4">
      <Text className="mb-4 font-bold text-2xl">Add a New Plant</Text>
      <View className="flex-row space-x-2 mb-4">
        <Input
          placeholder="Search for a plant..."
          value={searchQuery}
          onChangeText={handleSearch}
          className="flex-1"
        />
        <Button onPress={handleCameraPress} variant="outline">
          <Text>Camera</Text>
        </Button>
      </View>
      <FlatList
        data={searchResults}
        renderItem={({ item }) => (
          <PlantSearchResult plant={item} onSelect={handlePlantSelect} />
        )}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text className="mt-4 text-center text-gray-500">
            {searchQuery ? "No plants found. Try a different search or use the camera to identify your plant." : "Search for a plant or use the camera to identify it."}
          </Text>
        }
      />
    </View>
  );
};

export default AddPlantScreen;