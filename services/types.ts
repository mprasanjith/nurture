export interface Plant {
	_id: string;
	name: string;
	addedAt: string;
	userId: string;
	info?: PlantInfo;
	reminders: PlantReminder[];
}

export interface PlantReminder {
	id: string;
	type: "water" | "fertilize" | "prune" | "repot";
	frequency: number; // in days
	lastCompleted: string; // ISO date string
	nextDue: string; // ISO date string
	history: string[];
}

export type PlantUpdateInput = {
	name?: string;
	reminders?: {
		add?: Pick<PlantReminder, "type" | "frequency">[];
		remove?: string[];
		update?: Pick<PlantReminder, "id" | "type" | "frequency">[];
	};
};

export interface SearchResult {
	id: number;
	commonName: string;
	scientificNames: string[];
	otherNames: string[];
	thumbnail: string;
}

export interface PlantInfo {
	id: number;
	commonName: string;
	scientificNames: string[];
	otherNames: string[];
	type: string;
	cycle: string;
	watering: {
		frequency: string;
		benchmark: string;
	};
	sunlight: string[];
	care: {
		level: string;
		maintenance: string;
	};
	dimensions: {
		minHeight: number;
		maxHeight: number;
		unit: string;
	};
	indoor: boolean;
	flowering: {
		hasFlowers: boolean;
		season: string | null;
	};
	hardiness: {
		min: string;
		max: string;
	};
	propagation: string[];
	description: string;
	thumbnail: string;
	image: string;
}

export interface ReminderInput {
	type: string;
	frequency: number;
}

export interface Reminder extends ReminderInput {
	id: string;
	lastCompleted: string;
	nextDue: string;
	history: string[];
}
