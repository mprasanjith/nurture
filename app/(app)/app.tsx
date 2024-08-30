import React, { useState } from "react";
import { View, FlatList, Image } from "react-native";
import { Link, useRouter } from "expo-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";

const PlantItem = ({ plant, onPress }) => (
	<Card className="mb-4">
		<CardContent className="flex-row p-4">
			<Image
				source={{ uri: plant.image || "/assets/images/icon.png" }}
				style={{ width: 100, height: 100, borderRadius: 8, marginRight: 16 }}
			/>
			<View className="flex-1">
				<Text className="font-bold text-lg">{plant.name}</Text>
				<Text className="text-gray-500 text-sm">{plant.species}</Text>
				<Text className="text-sm">Next water: {plant.nextWater}</Text>
			</View>
		</CardContent>
		<CardFooter>
			<Button variant="outline" onPress={onPress}>
				<Link href="/plant-details">
					<Text>View Details</Text>
				</Link>
			</Button>
		</CardFooter>
	</Card>
);

const PlantsListScreen = () => {
	const [plants, setPlants] = useState([
		{
			id: "1",
			name: "Monstera",
			species: "Monstera deliciosa",
			nextWater: "2 days",
			image: "/api/placeholder/100/100",
		},
		{
			id: "2",
			name: "Snake Plant",
			species: "Sansevieria trifasciata",
			nextWater: "Today",
			image: "/api/placeholder/100/100",
		},
	]);

	const [searchQuery, setSearchQuery] = useState("");

	const filteredPlants = plants.filter(
		(plant) =>
			plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			plant.species.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<View className="flex-1 p-4">
			<Text className="mb-4 font-bold text-2xl">My Plants</Text>
			<Input
				placeholder="Search plants..."
				value={searchQuery}
				onChangeText={setSearchQuery}
				className="mb-4"
			/>
			<FlatList
				data={filteredPlants}
				renderItem={({ item }) => <PlantItem plant={item} onPress={() => {}} />}
				keyExtractor={(item) => item.id}
			/>
			<Button className="mt-4">
				<Link href="/add-plant">
					<Text>Add New Plant</Text>
				</Link>
			</Button>
		</View>
	);
};

export default PlantsListScreen;
