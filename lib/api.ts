if (!process.env.EXPO_PUBLIC_API_BASE_URL) {
	throw new Error(
		"Missing EXPO_PUBLIC_API_BASE_URL environment variable. Please set it in your .env file.",
	);
}
const EXPO_PUBLIC_API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export class ApiClient {
	private baseUrl: string;
	private getAuthToken: () => Promise<string | null>;

	constructor(getAuthToken: () => Promise<string | null>) {
		this.baseUrl = EXPO_PUBLIC_API_BASE_URL;
		this.getAuthToken = getAuthToken;
	}

	private async request<T, U = null>(
		endpoint: string,
		method: HttpMethod = "GET",
		data: U = null,
	): Promise<T> {
		const token = await this.getAuthToken();
		const url = this.baseUrl + endpoint;

		const headers: HeadersInit = {
			"Content-Type": "application/json",
		};

		if (token) {
			headers["Authorization"] = `Bearer ${token}`;
		}

		const config: RequestInit = {
			method,
			headers,
		};

		if (data) {
			config.body = JSON.stringify(data);
		}

		try {
			const response = await fetch(url, config);
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "An error occurred");
			}
			return await response.json();
		} catch (error) {
			console.error("API request failed:", error);
			throw error;
		}
	}

	async get<T>(endpoint: string): Promise<T> {
		return this.request<T>(endpoint);
	}

	async post<T, U>(endpoint: string, data: U): Promise<T> {
		return this.request<T, U>(endpoint, "POST", data);
	}

	async put<T, U>(endpoint: string, data: U): Promise<T> {
		return this.request<T, U>(endpoint, "PUT", data);
	}

	async delete<T>(endpoint: string): Promise<T> {
		return this.request<T>(endpoint, "DELETE");
	}
}
