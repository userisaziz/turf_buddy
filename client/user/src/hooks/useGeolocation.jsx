import { useState, useEffect } from "react";

const CITY_COORDINATES = {
  bangalore: { lat: 12.9716, lng: 77.5946 },
  gulbarga: { lat: 17.3297, lng: 76.4304 },
  hyderabad: { lat: 17.3850, lng: 78.4867 },
  pune: { lat: 18.5204, lng: 73.8567 },
  mumbai: { lat: 19.076, lng: 72.8777 },
  delhi: { lat: 28.7041, lng: 77.1025 },
  kolkata: { lat: 22.5726, lng: 88.3639 },
  chennai: { lat: 13.0827, lng: 80.2707 },
};

export const useGeolocation = () => {
  const [location, setLocation] = useState({
    city: "",
    latitude: null,
    longitude: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const city = getCityFromCoordinates(latitude, longitude);
          setLocation({
            city,
            latitude,
            longitude,
            loading: false,
            error: null,
          });
        },
        (error) => {
          setLocation((prev) => ({
            ...prev,
            loading: false,
            error: error.message,
            city: "Bangalore", // Default city
          }));
        }
      );
    } else {
      setLocation((prev) => ({
        ...prev,
        loading: false,
        error: "Geolocation is not supported",
        city: "Bangalore", // Default city
      }));
    }
  }, []);

  const getCityFromCoordinates = (lat, lng) => {
    let closestCity = "Bangalore";
    let minDistance = Infinity;

    Object.entries(CITY_COORDINATES).forEach(([city, coords]) => {
      const distance = Math.sqrt(
        Math.pow(lat - coords.lat, 2) + Math.pow(lng - coords.lng, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestCity = city.charAt(0).toUpperCase() + city.slice(1);
      }
    });

    return closestCity;
  };

  return location;
};

export default useGeolocation;
