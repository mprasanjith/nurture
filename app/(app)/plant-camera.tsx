import React, { useState, useRef, useEffect } from "react";
import { CameraView, type CameraType, useCameraPermissions } from "expo-camera";
import Stack from "expo-router/stack";
import { TouchableOpacity, View, Image } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { ScanEye } from "~/lib/icons/ScanEye";
import { SwitchCamera } from "~/lib/icons/SwitchCamera";
import { Loader } from "~/lib/icons/Loader";
import { PlantsService } from "~/services/plants";
import { useAuth } from "@clerk/clerk-expo";
import Toast from "react-native-root-toast";
import { router } from "expo-router";

const PlantCameraScreen = () => {
	const [facing, setFacing] = useState<CameraType>("back");
	const [permission, requestPermission] = useCameraPermissions();
	const [capturedImage, setCapturedImage] = useState<string | null>(null);

	const cameraRef = useRef<CameraView>(null);

	const { getToken } = useAuth();

	if (!permission) {
		// Camera permissions are still loading.
		return <View />;
	}

	if (!permission.granted) {
		// Camera permissions are not granted yet.
		return (
			<View className="flex-col flex-1 justify-center items-center gap-4 p-4">
				<Text className="inline px-12 text-center">
					We need your permission to show the camera.
				</Text>
				<Button className="w-full" onPress={requestPermission}>
					<Text>Grant permission</Text>
				</Button>
			</View>
		);
	}

	function toggleCameraFacing() {
		setFacing((current) => (current === "back" ? "front" : "back"));
	}

	async function identifyPlant(capturedImage: string) {
		if (!capturedImage) {
			return;
		}

		try {
			const service = new PlantsService(getToken);
			const plant = await service.identifyPlant(capturedImage);
			router.replace(`/plant-info/${plant.id}`);
		} catch (error) {
			console.error("Failed to identify plant:", error);
			Toast.show("Failed to identify plant. Please try again.", {
				duration: Toast.durations.LONG,
			});
			setCapturedImage(null);
		}
	}

	async function captureImage() {
		if (cameraRef.current) {
			try {
				const photo = await cameraRef.current.takePictureAsync();
				setCapturedImage(photo.uri);
				identifyPlant(photo.uri);
			} catch (error) {
				console.error("Failed to take picture:", error);
			}
		}
	}

	return (
		<View className="flex-1">
			<Stack.Screen
				options={{
					title: "Capture plant",
				}}
			/>

			{capturedImage ? (
				<View className="flex-1">
					<Image source={{ uri: capturedImage }} className="flex-1" />
					<View className="right-0 bottom-6 left-0 absolute flex items-center">
						<View className="bg-secondary/50 p-4 rounded-full text-secondary-foreground animate-spin">
							<Loader className="w-8 h-8 animate-pulse" />
						</View>
					</View>
				</View>
			) : (
				<CameraView ref={cameraRef} facing={facing} focusable mirror>
					<View className="right-0 bottom-6 left-0 absolute flex items-center">
						<TouchableOpacity
							className="bg-secondary/50 p-4 rounded-full text-secondary-foreground"
							onPress={captureImage}
						>
							<ScanEye className="w-8 h-8" />
						</TouchableOpacity>
					</View>

					<View className="right-8 bottom-9 absolute">
						<TouchableOpacity
							className="bg-secondary/40 p-2 rounded-full text-secondary-foreground"
							onPress={toggleCameraFacing}
						>
							<SwitchCamera />
						</TouchableOpacity>
					</View>
				</CameraView>
			)}
		</View>
	);
};

export default PlantCameraScreen;
