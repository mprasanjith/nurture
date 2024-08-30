import { useAuth } from "@clerk/clerk-expo";
import { useCallback } from "react";
import { ApiClient } from "~/lib/api";
import type { Plant, PlantInfo, SearchResult } from "./types";
import useSWR, { mutate } from "swr";

export class PlantsService {
	apiClient: ApiClient;

	constructor(getApiToken: () => Promise<string | null>) {
		this.apiClient = new ApiClient(getApiToken);
	}

	async getPlants() {
		return (await this.apiClient.get<{ data: Plant[] }>("/plants")).data;
	}

	async getPlant(id: string) {
		return (await this.apiClient.get<{ data: Plant }>(`/plants/${id}`)).data;
	}

	async addPlant(id: string) {
		return (
			await this.apiClient.post<{ data: Plant }, { id: string }>("/plants", {
				id,
			})
		).data;
	}

	async removePlant(id: string) {
		return (await this.apiClient.delete<{ data: Plant }>(`/plants/${id}`)).data;
	}

	async getSearchResults(query: string) {
		return (
			await this.apiClient.get<{ data: SearchResult[] }>(`/search?q=${query}`)
		).data;
	}

	async getPlantInfo(id: string) {
		return (await this.apiClient.get<{ data: PlantInfo }>(`/info/${id}`)).data;
	}
}

export const usePlants = () => {
	const { getToken } = useAuth();
	const asyncFunction = useCallback(async () => {
		const plantsService = new PlantsService(getToken);
		return await plantsService.getPlants();
	}, [getToken]);

	return useSWR("/plants", asyncFunction);
};

export const usePlant = (id: string) => {
	const { getToken } = useAuth();
	const asyncFunction = useCallback(async () => {
		const plantsService = new PlantsService(getToken);
		return await plantsService.getPlant(id);
	}, [getToken, id]);

	return useSWR(`/plants/${id}`, asyncFunction);
};

export const usePlantInfo = (id: string) => {
	const { getToken } = useAuth();
	const asyncFunction = useCallback(async () => {
		const plantsService = new PlantsService(getToken);
		return await plantsService.getPlantInfo(id);
	}, [getToken, id]);

	return useSWR(`/info/${id}`, asyncFunction);
};

export const useSearchResults = (query: string) => {
	const { getToken } = useAuth();
	const asyncFunction = useCallback(async () => {
		if (query.length < 3) {
			return [];
		}

		const searchResultsService = new PlantsService(getToken);
		return await searchResultsService.getSearchResults(query);
	}, [getToken, query]);

	return useSWR(`/search?q=${query}`, asyncFunction);
};
