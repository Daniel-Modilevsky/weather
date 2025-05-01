import { useState, useEffect } from "react";

type Location = {
  latitude: number;
  longitude: number;
  city?: string;
};

const DEFAULT_LOCATION: Location = {
  latitude: 32.0853,
  longitude: 34.7818,
  city: "Tel Aviv",
};

export function useUserLocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("user_location");
    if (saved) {
      setLocation(JSON.parse(saved));
      setLoading(false);
      return;
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };
          setLocation(coords);
          localStorage.setItem("user_location", JSON.stringify(coords));
          setLoading(false);
        },
        () => {
          setLocation(DEFAULT_LOCATION);
          localStorage.setItem(
            "user_location",
            JSON.stringify(DEFAULT_LOCATION)
          );
          setLoading(false);
        }
      );
    } else {
      setLocation(DEFAULT_LOCATION);
      localStorage.setItem("user_location", JSON.stringify(DEFAULT_LOCATION));
      setLoading(false);
    }
  }, []);

  return { location, loading };
}
