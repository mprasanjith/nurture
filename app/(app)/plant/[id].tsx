import React, { useMemo, useState } from "react";
import { View, ScrollView, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import Stack from "expo-router/stack";
import { PlantsService, usePlant } from "~/services/plants";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import Animated, { FadeIn } from "react-native-reanimated";
import { Input } from "~/components/ui/input";
import { useAuth } from "@clerk/clerk-expo";
import { Trash } from "~/lib/icons/Trash";

const PlantCareScreen = () => {
	const { id } = useLocalSearchParams();
	const { data: plant, isLoading, error, mutate } = usePlant(id.toString());

	const { getToken } = useAuth();
	const [newReminderType, setNewReminderType] = useState("");
	const [newReminderFrequency, setNewReminderFrequency] = useState(1);

	const reminders = useMemo(() => {
		if (!plant?.reminders) return [];
		return plant.reminders
			.reduce(
				(acc, reminder) => {
					acc.push({
						...reminder,
						completions:
							reminder.history.length > 0 ? reminder.history.slice(-5) : [],
					});
					return acc;
				},
				[] as { type: string; frequency: number; completions: string[] }[],
			)
			.reverse();
	}, [plant]);

	if (isLoading) {
		return <Text>Loading...</Text>;
	}

	if (error) {
		return <Text>Error loading plant</Text>;
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString();
	};

	const handleMarkAsCompleted = async (reminderId) => {
		try {
			const plantsService = new PlantsService(getToken);
			await plantsService.markReminderAsCompleted(plant._id, reminderId);
			mutate();
		} catch (error) {
			console.error("Error marking reminder as completed:", error);
		}
	};

	const handleAddReminder = async () => {
		if (!newReminderType) {
			console.error("Please select a reminder type");
			return;
		}
		try {
			const plantsService = new PlantsService(getToken);
			await plantsService.addReminder(plant._id, {
				type: newReminderType,
				frequency: newReminderFrequency,
			});
			setNewReminderType("");
			setNewReminderFrequency(1);
			mutate();
		} catch (error) {
			console.error("Error adding new reminder:", error);
		}
	};

	const deleteReminder = async (reminderId) => {
		try {
			const plantsService = new PlantsService(getToken);
			await plantsService.deleteReminder(plant._id, reminderId);
			mutate();
		} catch (error) {
			console.error("Error deleting reminder:", error);
		}
	};

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
					<Text className="text-gray-500">
						{plant.info?.scientificNames?.join(", ")}
					</Text>
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
				<CardContent className="mb-4">
					{plant.reminders && plant.reminders.length > 0 ? (
						plant.reminders.map((reminder) => (
							<View
								key={reminder.id}
								className="flex flex-row justify-between items-center"
							>
								<View>
									<Text className="font-semibold">{reminder.type}</Text>
									<Text className="text-gray-500 text-sm">
										Next due: {formatDate(reminder.nextDue)}
									</Text>
								</View>
								<View className="flex flex-row items-center gap-2">
									<Button
										variant="outline"
										onPress={() => handleMarkAsCompleted(reminder.id)}
									>
										Complete
									</Button>
									<Button
										variant="ghost"
										size="icon"
										onPress={() => deleteReminder(reminder.id)}
									>
										<Trash className="w-4 h-4" />
									</Button>
								</View>
							</View>
						))
					) : (
						<Text>No reminders set</Text>
					)}

					<View className="mt-4 pt-4">
						<Text className="mb-2 font-semibold">Add New Reminder</Text>
						<View className="flex flex-row items-center gap-2">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline">
										<Text>{newReminderType || "Select Type"}</Text>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-56">
									<Animated.View entering={FadeIn.duration(200)}>
										<DropdownMenuItem
											onPress={() => setNewReminderType("Water")}
										>
											<Text>Water</Text>
										</DropdownMenuItem>
										<DropdownMenuItem
											onPress={() => setNewReminderType("Fertilize")}
										>
											<Text>Fertilize</Text>
										</DropdownMenuItem>
										<DropdownMenuItem
											onPress={() => setNewReminderType("Prune")}
										>
											<Text>Prune</Text>
										</DropdownMenuItem>
									</Animated.View>
								</DropdownMenuContent>
							</DropdownMenu>

							<Text className="text-gray-500">Every</Text>
							<Input
								value={newReminderFrequency.toString()}
								onChangeText={(text) => setNewReminderFrequency(Number(text))}
								placeholder="Frequency (days)"
								keyboardType="numeric"
								className="flex-1"
							/>

							<Text className="text-gray-500">days</Text>

							<Button
								variant="default"
								className="text-primary-foreground"
								onPress={handleAddReminder}
							>
								Add
							</Button>
						</View>
					</View>
				</CardContent>
			</Card>

			<Card className="mb-4">
				<CardHeader>
					<CardTitle>Reminder History</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
					{reminders.map((reminder) =>
						reminder.completions.map((completion) => (
							<View
								key={completion}
								className="flex flex-row justify-between items-center"
							>
								<Text className="font-semibold">{reminder.type}</Text>
								<Text className="text-gray-500 text-sm">
									Last done: {formatDate(completion)}
								</Text>
							</View>
						)),
					)}
				</CardContent>
			</Card>
		</ScrollView>
	);
};

export default PlantCareScreen;
