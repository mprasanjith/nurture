import React, { useState } from "react";
import { View, FlatList, Image } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import Stack from "expo-router/stack";
import { ScanEye } from "~/lib/icons/ScanEye";
import { useSearchResults } from "~/services/plants";
import { useDebounce } from "~/hooks/useDebounce";
import type { SearchResult } from "~/services/types";

interface PlantSearchResultProps {
	plant: SearchResult;
	onSelect: (plant: SearchResult) => void;
}

const PlantSearchResult = ({ plant, onSelect }: PlantSearchResultProps) => (
	<Card className="mb-4">
		<CardContent className="flex-col gap-2 p-4">
			<Text className="font-bold text-lg">
				{plant.scientificNameWithoutAuthor}
			</Text>

			<View>
				{plant.commonNames?.length > 0 && (
					<>
						<Text>Also known as:</Text>
						<Text className="text-gray-500 text-sm">
							{plant.commonNames.join(", ")}
						</Text>
					</>
				)}
			</View>
		</CardContent>
	</Card>
);

const AddPlantScreen = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const debouncedSearchQuery = useDebounce(searchQuery, 300);
	const { data: searchResults, isLoading } =
		useSearchResults(debouncedSearchQuery);

	const handleCameraPress = () => {
		// You'll implement the camera functionality here
		console.log("Open camera for plant identification");
	};

	const handlePlantSelect = (plant) => {
		console.log("Selected plant:", plant.id);
	};

	console.log("Search results:", searchResults);

	return (
		<View className="flex-1 p-4">
			<Stack.Screen
				options={{
					title: "Add a new plant",
				}}
			/>

			<View className="flex-row items-center gap-2 mb-4">
				<Input
					placeholder="Search for a plant..."
					value={searchQuery}
					onChangeText={setSearchQuery}
					className="flex-1"
				/>
				<Button
					variant="outline"
					className="flex-row items-center gap-2"
					onPress={handleCameraPress}
				>
					<ScanEye className="text-foreground" />
					<Text>Identify</Text>
				</Button>
			</View>
			<FlatList
				data={searchResults}
				renderItem={({ item }) => (
					<PlantSearchResult plant={item} onSelect={handlePlantSelect} />
				)}
				keyExtractor={(item) => item.id}
				ListEmptyComponent={
					<Text className="mt-4 text-center text-gray-500">
						{!isLoading && searchResults.length === 0
							? "No plants found. Try a different search or use the camera to identify your plant."
							: "Search for a plant or use the camera to identify it."}
					</Text>
				}
			/>
		</View>
	);
};

export default AddPlantScreen;
