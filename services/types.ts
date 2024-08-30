export interface SearchResult {
	id: number;
	commonName: string;
	scientificNames: string[];
	otherNames: string[];
	thumbnail: string;
}

export interface PlantPhotoMatch {
	results: {
		score: number;
		species: {
			scientificNameWithoutAuthor: string;
			scientificNameAuthorship: string;
			genus: {
				scientificNameWithoutAuthor: string;
				scientificNameAuthorship: string;
				scientificName: string;
			};
			family: {
				scientificNameWithoutAuthor: string;
				scientificNameAuthorship: string;
				scientificName: string;
			};
			commonNames: string[];
			scientificName: string;
		};
		gbif: {
			id: string;
		};
		powo: {
			id: string;
		};
	}[];
}
