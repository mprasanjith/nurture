import React from "react";
import { View, ScrollView, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import Stack from "expo-router/stack";
import { usePlant } from "~/services/plants";

const PlantCareScreen = () => {
	const { id } = useLocalSearchParams();
	const { data: plant, isLoading, error } = usePlant(id.toString());

	if (isLoading) {
		return <Text>Loading...</Text>;
	}

	if (error) {
		return <Text>Error loading plant</Text>;
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString();
	};

	const getNextReminder = () => {
		if (plant.reminders.length === 0) return null;
		return plant.reminders.reduce((closest, current) =>
			new Date(current.nextDue) < new Date(closest.nextDue) ? current : closest,
		);
	};

	const nextReminder = getNextReminder();

	return (
		<ScrollView className="flex-1 p-4">
			<Stack.Screen
				options={{
					title: "Plant care",
				}}
			/>

			<Card className="mb-4">
				<CardContent className="items-center p-4">
					<Image
						source={{ uri: plant.info?.thumbnail }}
						style={{ width: 150, height: 150, borderRadius: 75 }}
					/>
					<Text className="mt-4 font-bold text-2xl">{plant.name}</Text>
					<Text className="text-gray-500">{plant.info?.commonName}</Text>
				</CardContent>
			</Card>

			<Card className="mb-4">
				<CardHeader>
					<CardTitle>Care Instructions</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
					<View className="flex-row justify-between">
						<Text>Watering:</Text>
						<Text>{plant.info?.watering.frequency}</Text>
					</View>
					<View className="flex-row justify-between">
						<Text>Sunlight:</Text>
						<Text>{plant.info?.sunlight.join(", ")}</Text>
					</View>
					<View className="flex-row justify-between">
						<Text>Care Level:</Text>
						<Text>{plant.info?.care.level}</Text>
					</View>
					<View className="flex-row justify-between">
						<Text>Maintenance:</Text>
						<Text>{plant.info?.care.maintenance}</Text>
					</View>
				</CardContent>
			</Card>

			<Card className="mb-4">
				<CardHeader>
					<CardTitle>Reminders</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
					{nextReminder ? (
						<>
							<Text>Next reminder: {nextReminder.type}</Text>
							<Text>Due on: {formatDate(nextReminder.nextDue)}</Text>
							<Button onPress={() => console.log("Mark as completed")}>
								Mark as Completed
							</Button>
						</>
					) : (
						<Text>No upcoming reminders</Text>
					)}
				</CardContent>
			</Card>

			<Card className="mb-4">
				<CardHeader>
					<CardTitle>Reminder History</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
					{plant.reminders.map((reminder) => (
						<View key={reminder._id} className="flex-row justify-between">
							<Text>{reminder.type}</Text>
							<Text>Last done: {formatDate(reminder.lastCompleted)}</Text>
						</View>
					))}
				</CardContent>
			</Card>
		</ScrollView>
	);
};

export default PlantCareScreen;
