import React, { useState } from "react";
import { View, ScrollView, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PlantDetailsScreen = () => {
	const router = useRouter();
	const { plantId } = useLocalSearchParams();
	const [isEditing, setIsEditing] = useState(false);

	const insets = useSafeAreaInsets();
	const contentInsets = {
		top: insets.top,
		bottom: insets.bottom,
		left: 12,
		right: 12,
	};

	// Mock data - replace with actual data fetching logic
	const [plant, setPlant] = useState({
		id: plantId,
		name: "Monstera",
		scientificName: "Monstera deliciosa",
		image: "/api/placeholder/300/300",
		wateringFrequency: "Every 7 days",
		sunlightNeeds: "Bright indirect light",
		temperature: "65-80°F",
		lastWatered: "2023-08-25",
		nextWatering: "2023-09-01",
		notes: "Likes high humidity. Mist leaves occasionally.",
	});

	const handleEdit = () => {
		setIsEditing(!isEditing);
	};

	const handleSave = () => {
		// Implement save logic here
		setIsEditing(false);
	};

	const handleWater = () => {
		// Implement watering logic here
		console.log("Plant watered");
	};

	return (
		<ScrollView className="flex-1 p-4">
			<Card className="mb-4">
				<CardContent className="items-center p-4">
					<Image
						source={{ uri: plant.image }}
						style={{ width: 300, height: 300, borderRadius: 8 }}
					/>
					{isEditing ? (
						<Input
							value={plant.name}
							onChangeText={(text) => setPlant({ ...plant, name: text })}
							className="mt-4 font-bold text-2xl"
						/>
					) : (
						<Text className="mt-4 font-bold text-2xl">{plant.name}</Text>
					)}
					<Text className="text-gray-500">{plant.scientificName}</Text>
				</CardContent>
			</Card>

			<Card className="mb-4">
				<CardHeader>
					<CardTitle>Care Instructions</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
					<View className="flex-row items-center">
						{/* <Droplet className="mr-2" /> */}
						{isEditing ? (
							<Select
								value={plant.wateringFrequency}
								onValueChange={(value) =>
									setPlant({ ...plant, wateringFrequency: value })
								}
							>
								<SelectTrigger className="w-[250px]">
									<SelectValue
										className="text-foreground text-sm native:text-lg"
										placeholder="Select watering frequency"
									/>
								</SelectTrigger>
								<SelectContent insets={contentInsets} className="w-[250px]">
									<SelectGroup>
										<SelectLabel>Watering Frequency</SelectLabel>
										<SelectItem value="Every 3 days" label="Every 3 days">
											Every 3 days
										</SelectItem>
										<SelectItem value="Every 7 days" label="Every 7 days">
											Every 7 days
										</SelectItem>
										<SelectItem value="Every 14 days" label="Every 14 days">
											Every 14 days
										</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						) : (
							<Text>Water: {plant.wateringFrequency}</Text>
						)}
					</View>
					<View className="flex-row items-center">
						{/* <Sun className="mr-2" /> */}
						{isEditing ? (
							<Input
								value={plant.sunlightNeeds}
								onChangeText={(text) =>
									setPlant({ ...plant, sunlightNeeds: text })
								}
							/>
						) : (
							<Text>Sunlight: {plant.sunlightNeeds}</Text>
						)}
					</View>
					<View className="flex-row items-center">
						{/* <Thermometer className="mr-2" /> */}
						{isEditing ? (
							<Input
								value={plant.temperature}
								onChangeText={(text) =>
									setPlant({ ...plant, temperature: text })
								}
							/>
						) : (
							<Text>Temperature: {plant.temperature}</Text>
						)}
					</View>
				</CardContent>
			</Card>

			<Card className="mb-4">
				<CardHeader>
					<CardTitle>Watering Schedule</CardTitle>
				</CardHeader>
				<CardContent>
					<Text>Last Watered: {plant.lastWatered}</Text>
					<Text>Next Watering: {plant.nextWatering}</Text>
				</CardContent>
				<CardFooter>
					<Button onPress={handleWater}>
						<Text>Water Now</Text>
					</Button>
				</CardFooter>
			</Card>

			<Card className="mb-4">
				<CardHeader>
					<CardTitle>Notes</CardTitle>
				</CardHeader>
				<CardContent>
					{isEditing ? (
						<Input
							value={plant.notes}
							onChangeText={(text) => setPlant({ ...plant, notes: text })}
							multiline
						/>
					) : (
						<Text>{plant.notes}</Text>
					)}
				</CardContent>
			</Card>

			<View className="flex-row justify-between mt-4">
				{isEditing ? (
					<Button onPress={handleSave}>
						<Text>Save Changes</Text>
					</Button>
				) : (
					<Button onPress={handleEdit}>
						<Text>Edit Plant</Text>
					</Button>
				)}
			</View>
		</ScrollView>
	);
};

export default PlantDetailsScreen;
