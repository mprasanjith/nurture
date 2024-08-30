import React, { useMemo, useState } from "react";
import { View, FlatList, Image } from "react-native";
import { Link, useRouter } from "expo-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import Stack from "expo-router/stack";
import { Plus } from "~/lib/icons/Plus";
import { usePlants } from "~/services/plants";

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
			<Link href="/plant-details" asChild>
				<Button variant="outline" onPress={onPress}>
					<Text>View Details</Text>
				</Button>
			</Link>
		</CardFooter>
	</Card>
);

const PlantsListScreen = () => {
	const { data } = usePlants();

	const [searchQuery, setSearchQuery] = useState("");

	const filteredPlants = useMemo(
		() =>
			data?.filter(
				(plant) =>
					plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					plant.scientificName
						.toLowerCase()
						.includes(searchQuery.toLowerCase()),
			),
		[data, searchQuery],
	);

	return (
		<View className="flex-1 p-4">
			<Stack.Screen
				options={{
					title: "My plants",
					headerRight: () => (
						<Link href="/add-plant" asChild>
							<Button
								size="sm"
								variant="ghost"
								className="flex-row items-center gap-2 p-0"
							>
								<Text>Add plant</Text>
								<Plus />
							</Button>
						</Link>
					),
				}}
			/>

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
		</View>
	);
};

export default PlantsListScreen;
