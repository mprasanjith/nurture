import React, { useMemo, useState } from "react";
import { View, FlatList, Image, Animated } from "react-native";
import { Link, useRouter } from "expo-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import Stack from "expo-router/stack";
import { Plus } from "~/lib/icons/Plus";
import { PlantsService, usePlants } from "~/services/plants";
import type { Plant } from "~/services/types";
import {
	GestureHandlerRootView,
	Swipeable,
} from "react-native-gesture-handler";
import { useAuth } from "@clerk/clerk-expo";

interface PlantItemProps {
	plant: Plant;
	onDelete: (id: string) => void;
}

const PlantItem = ({ plant, onDelete }: PlantItemProps) => {
	const nextReminder = useMemo(() => {
		if (plant.reminders.length === 0) return null;

		return plant.reminders.reduce((closest, current) =>
			new Date(current.nextDue) < new Date(closest.nextDue) ? current : closest,
		);
	}, [plant.reminders]);

	const renderRightActions = (progress, dragX) => {
		const trans = dragX.interpolate({
			inputRange: [-100, 0],
			outputRange: [1, 0],
			extrapolate: "clamp",
		});
		return (
			<View className="w-[100px] h-full">
				<Animated.View
					style={{
						transform: [{ translateX: trans }],
						height: "100%",
						width: "100%",
					}}
				>
					<Button
						onPress={() => onDelete(plant._id)}
						className="justify-center bg-red-500 rounded-none h-full"
					>
						<Text className="text-white">Delete</Text>
					</Button>
				</Animated.View>
			</View>
		);
	};

	return (
		<View className="mb-4">
			<Link href={`/plant/${plant._id}`} asChild>
				<Swipeable renderRightActions={renderRightActions}>
					<Card>
						<CardContent className="flex-row items-center p-4">
							<Image
								source={{
									uri: plant.info?.thumbnail || "/assets/images/icon.png",
								}}
								style={{
									width: 100,
									height: 100,
									borderRadius: 8,
									marginRight: 16,
								}}
							/>
							<View className="flex-1">
								<Text className="font-bold text-lg">{plant.name}</Text>
								<Text className="text-gray-500 text-sm">
									{plant.info?.scientificNames?.join(", ")}
								</Text>
								{nextReminder ? (
									<Text className="mt-2 text-sm">
										Next reminder:{" "}
										{new Date(nextReminder.nextDue).toLocaleDateString()}
									</Text>
								) : null}
							</View>
						</CardContent>
					</Card>
				</Swipeable>
			</Link>
		</View>
	);
};

const PlantsListScreen = () => {
	const { data, mutate } = usePlants();
	const [searchQuery, setSearchQuery] = useState("");

	const filteredPlants = useMemo(
		() =>
			data?.filter(
				(plant) =>
					plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					plant.info?.commonName
						?.toLowerCase()
						.includes(searchQuery.toLowerCase()),
			),
		[data, searchQuery],
	);

	const { getToken } = useAuth();
	const handleDelete = async (id: string) => {
		const plantService = new PlantsService(getToken);
		await plantService.removePlant(id);
		mutate();
	};

	return (
		<GestureHandlerRootView className="flex-1">
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
					renderItem={({ item }) => (
						<PlantItem plant={item} onDelete={handleDelete} />
					)}
					keyExtractor={(item) => item._id}
					ListEmptyComponent={
						<View className="flex-col justify-center items-center mt-4 w-full h-96 text-center text-gray-500">
							<View className="mb-2">
								<Text className="font-light text-xl">Welcome to Nurture</Text>
							</View>
							<View>
								<Text>Add a plant to get started.</Text>
								<Link href="/add-plant" asChild>
									<Button
										variant="default"
										className="flex flex-row items-center gap-2 my-6 mt-4"
										size="lg"
									>
										<Plus className="text-primary-foreground" />
										<Text>Add plant</Text>
									</Button>
								</Link>
							</View>
						</View>
					}
				/>
			</View>
		</GestureHandlerRootView>
	);
};

export default PlantsListScreen;
