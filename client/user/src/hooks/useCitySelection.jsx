import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Preferences } from "@capacitor/preferences";

const CITY_STORAGE_KEY = "selectedCity";

export const useCitySelection = () => {
  const { city: urlCity } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCity, setSelectedCity] = useState(urlCity || '');
  const [isLoading, setIsLoading] = useState(true);

  // Sync selectedCity with urlCity
  useEffect(() => {
    if (urlCity) {
      setSelectedCity(urlCity);
    }
  }, [urlCity]);

  // Load saved city on mount if not in URL
  useEffect(() => {
    const loadCity = async () => {
      try {
        const { value } = await Preferences.get({ key: CITY_STORAGE_KEY });
        if (value && !urlCity) {
          // If city in storage but not in URL, redirect to city-prefixed path
          const cleanPath = location.pathname === "/" ? "" : location.pathname;
          navigate(`/${value.toLowerCase()}${cleanPath}`, { replace: true });
        }
        if (!urlCity) setSelectedCity(value);
      } catch (error) {
        console.error("Error loading city:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCity();
  }, [urlCity, navigate, location.pathname]);

  // Update city and navigate
  const updateCity = async (city) => {
    try {
      const citySlug = city.toLowerCase();
      await Preferences.set({
        key: CITY_STORAGE_KEY,
        value: city,
      });

      // Update URL while maintaining current sub-path
      const isAuthPath = location.pathname.includes("/auth/");
      let newPath = "";

      if (isAuthPath) {
        // Path is /auth/:city/... or /auth/...
        if (urlCity) {
          newPath = location.pathname.replace(`/auth/${urlCity.toLowerCase()}`, `/auth/${citySlug}`);
        } else {
          // If for some reason we are in /auth but no city in URL params (unlikely with current router)
          newPath = `/auth/${citySlug}`;
        }
      } else {
        // Path is /:city/... or /...
        if (urlCity) {
          newPath = location.pathname.replace(`/${urlCity.toLowerCase()}`, `/${citySlug}`);
        } else {
          newPath = `/${citySlug}${location.pathname === "/" ? "" : location.pathname}`;
        }
      }

      navigate(newPath, { replace: true });
      setSelectedCity(city);
    } catch (error) {
      console.error("Error saving city:", error);
    }
  };

  // Clear city
  const clearCity = async () => {
    try {
      await Preferences.remove({ key: CITY_STORAGE_KEY });
      setSelectedCity(null);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error clearing city:", error);
    }
  };

  return {
    selectedCity: urlCity || selectedCity,
    isLoading,
    updateCity,
    clearCity,
  };
};