export interface LocationSuggestion {
  name: string;
  latitude: number;
  longitude: number;
}

export type LocationResult = {
  name: string;
  place: {
    lat: number;
    lon: number;
  };
};
