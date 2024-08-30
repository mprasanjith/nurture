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
import type { Plant } from "~/services/types";

interface PlantItemProps {
	plant: Plant;
}

const PlantItem = ({ plant }: PlantItemProps) => {
	const nextReminder = useMemo(() => {
		if (plant.reminders.length === 0) return null;

		return plant.reminders.reduce((closest, current) =>
			new Date(current.nextDue) < new Date(closest.nextDue) ? current : closest,
		);
	}, [plant.reminders]);

	return (
		<Link href={`/plant/${plant._id}`} asChild>
			<Card className="mb-4">
				<CardContent className="flex-row items-center p-4">
					<Image
						source={{ uri: plant.info?.thumbnail || "/assets/images/icon.png" }}
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
							{plant.info?.commonName}
						</Text>
						{nextReminder ? (
							<Text className="mt-2 text-sm">
								Next reminder: {nextReminder.nextDue}
							</Text>
						) : null}
					</View>
				</CardContent>
			</Card>
		</Link>
	);
};

const PlantsListScreen = () => {
	const { data } = usePlants();

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
				renderItem={({ item }) => <PlantItem plant={item} />}
				keyExtractor={(item) => item._id}
				ListEmptyComponent={
					<View className="flex-col justify-center items-center mt-4 w-full h-96 text-center text-gray-500">
						<View className="mb-2">
							<Text className="font-light text-xl">Welcome to Nurture</Text>
						</View>
						<View>
							Add a plant to get started.
							<Link href="/add-plant" asChild>
								<Button
									variant="default"
									className="flex flex-row items-center gap-2 mt-4 px-12 py-6 text-background"
									size="lg"
								>
									<Plus />
									Add plant
								</Button>
							</Link>
						</View>
					</View>
				}
			/>
		</View>
	);
};

export default PlantsListScreen;
