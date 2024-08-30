import { useAuth } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { ApiClient } from "~/lib/api";

interface Plant {
	id: string;
	name: string;
	scientificName: string;
	image: string;
}

class PlantsService {
	apiClient: ApiClient;

	constructor(getApiToken: () => Promise<string | null>) {
		this.apiClient = new ApiClient(getApiToken);
	}

	async getPlants() {
		return await this.apiClient.get<Plant[]>("/plants");
	}

	async getPlant(id: string) {
		return await this.apiClient.get<Plant>(`/plants/${id}`);
	}
}

export const usePlants = () => {
	const [plants, setPlants] = useState([]);
	const { getToken } = useAuth();

	useEffect(() => {
		const getPlants = async () => {
			const plantsService = new PlantsService(getToken);
			const plants = await plantsService.getPlants();
			setPlants(plants);
		};

		getPlants();
	}, [getToken]);

	return plants;
};

export const usePlant = (id: string) => {
	const [plant, setPlant] = useState<Plant | null>(null);
	const { getToken } = useAuth();

	useEffect(() => {
		const getPlant = async () => {
			const plantsService = new PlantsService(getToken);
			const plant = await plantsService.getPlant(id);
			setPlant(plant);
		};

		getPlant();
	}, [getToken, id]);

	return {
		plant,
	};
};
