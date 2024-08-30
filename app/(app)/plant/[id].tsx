import React from "react";
import { View, ScrollView, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import Stack from "expo-router/stack";
import { usePlantInfo } from "~/services/plants";

const PlantDetailsScreen = () => {
	const { id } = useLocalSearchParams();
	const { data: plant } = usePlantInfo(id.toString());

	if (!plant) {
		return <Text>Loading...</Text>;
	}

	return (
		<ScrollView className="flex-1 p-4">
			<Stack.Screen
				options={{
					title: "Plant details",
				}}
			/>

			<Card className="mb-4">
				<CardContent className="items-center p-4">
					<Image
						source={{ uri: plant.image }}
						style={{ width: 300, height: 300, borderRadius: 8 }}
					/>
					<Text className="mt-4 font-bold text-2xl">{plant.commonName}</Text>
					{plant.otherNames?.length ? (
						<Text className="text-gray-500 italic">
							aka {plant.otherNames.join(", ")}
						</Text>
					) : null}
					<Text className="text-gray-500">
						{plant.scientificNames.join(", ")}
					</Text>
				</CardContent>
			</Card>

			<Card className="mb-4">
				<CardHeader>
					<CardTitle>Plant Information</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
					<View className="flex-row justify-between">
						<Text>Type:</Text>
						<Text>{plant.type}</Text>
					</View>
					<View className="flex-row justify-between">
						<Text>Cycle:</Text>
						<Text>{plant.cycle}</Text>
					</View>
					<View className="flex-row justify-between">
						<Text>Indoor:</Text>
						<Text>{plant.indoor ? "Yes" : "No"}</Text>
					</View>
				</CardContent>
			</Card>

			<Card className="mb-4">
				<CardHeader>
					<CardTitle>Care Instructions</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
					{plant.watering.frequency ? <View className="flex-row justify-between">
						<Text>Watering Frequency:</Text>
						<Text>{plant.watering.frequency}</Text>
					</View> : null}
					{plant.watering.benchmark ? (
						<View className="flex-row justify-between">
							<Text>Watering Benchmark:</Text>
							<Text>{plant.watering.benchmark}</Text>
						</View>
					) : null}
					<View className="flex-row justify-between">
						<Text>Sunlight:</Text>
						<Text>{plant.sunlight.join(", ")}</Text>
					</View>
					<View className="flex-row justify-between">
						<Text>Care Level:</Text>
						<Text>{plant.care.level}</Text>
					</View>
					<View className="flex-row justify-between">
						<Text>Maintenance:</Text>
						<Text>{plant.care.maintenance}</Text>
					</View>
				</CardContent>
			</Card>

			<Card className="mb-4">
				<CardHeader>
					<CardTitle>Plant Characteristics</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
					<View className="flex-row justify-between">
						<Text>Height:</Text>
						{plant.dimensions.minHeight !== plant.dimensions.maxHeight ? (
							<Text>{`${plant.dimensions.minHeight} - ${plant.dimensions.maxHeight} ${plant.dimensions.unit}`}</Text>
						) : (
							<Text>{`${plant.dimensions.minHeight} ${plant.dimensions.unit}`}</Text>
						)}
					</View>
					<View className="flex-row justify-between">
						<Text>Flowering:</Text>
						<Text>
							{plant.flowering.hasFlowers
								? `Yes${plant.flowering.season ? ` (${plant.flowering.season})` : ""}`
								: "No"}
						</Text>
					</View>
					<View className="flex-row justify-between">
						<Text>Hardiness:</Text>
						{plant.hardiness.min !== plant.hardiness.max ? (
							<Text>{`${plant.hardiness.min} - ${plant.hardiness.max}`}</Text>
						) : (
							<Text>{`${plant.hardiness.min}`}</Text>
						)}
					</View>
					{plant.propagation?.length ? (
						<View className="flex-col justify-between">
							<Text>Propagation:</Text>
							<Text>{plant.propagation.join(", ")}</Text>
						</View>
					) : null}
				</CardContent>
			</Card>

			<Card className="mb-4">
				<CardHeader>
					<CardTitle>Description</CardTitle>
				</CardHeader>
				<CardContent>
					<Text>{plant.description}</Text>
				</CardContent>
			</Card>
		</ScrollView>
	);
};

export default PlantDetailsScreen;
