import React, { useState } from "react";
import { View, FlatList, Image } from "react-native";
import { Link, useRouter } from "expo-router";
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
}

const PlantSearchResult = ({ plant }: PlantSearchResultProps) => (
	<Link href={`/plant-info/${plant.id}`} asChild>
		<Card className="mb-4">
			<CardContent className="flex-row p-4">
				<Image
					source={{ uri: plant.thumbnail || "/api/placeholder/80/80" }}
					style={{ width: 80, height: 80, borderRadius: 8, marginRight: 16 }}
				/>
				<View className="flex-1">
					<Text className="font-bold text-lg">{plant.commonName}</Text>
					<Text className="text-gray-500 text-sm">
						{plant.scientificNames?.length > 0 && (
							<Text className="text-gray-500 text-sm">
								{plant.scientificNames.join(", ")}
							</Text>
						)}
					</Text>

					<Text className="text-gray-500 text-sm">
						{plant.otherNames?.length > 0 && (
							<>
								<Text>Also known as: </Text>
								<Text className="text-gray-500 text-sm">
									{plant.otherNames.join(", ")}
								</Text>
							</>
						)}
					</Text>
				</View>
			</CardContent>
		</Card>
	</Link>
);

const AddPlantScreen = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const debouncedSearchQuery = useDebounce(searchQuery, 300);
	const { data: searchResults, isLoading } =
		useSearchResults(debouncedSearchQuery);
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

				<Link href="/plant-camera" asChild>
					<Button variant="outline" className="flex-row items-center gap-2">
						<ScanEye className="text-foreground" />
						<Text>Identify</Text>
					</Button>
				</Link>
			</View>
			<FlatList
				data={searchResults}
				renderItem={({ item }) => <PlantSearchResult plant={item} />}
				keyExtractor={(item) => item.id.toString()}
				ListEmptyComponent={
					<Text className="mt-4 text-center text-gray-500">
						{searchQuery && !isLoading && searchResults?.length === 0
							? "No plants found. Try a different search or use the camera to identify your plant."
							: "Search for a plant or use the camera to identify it."}
					</Text>
				}
			/>
		</View>
	);
};

export default AddPlantScreen;
