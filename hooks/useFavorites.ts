import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "chef_smart_favorites";

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load favorites from storage on mount
    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            const stored = await AsyncStorage.getItem(FAVORITES_KEY);
            if (stored) {
                setFavorites(JSON.parse(stored));
            }
        } catch (error) {
            console.warn("Failed to load favorites:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveFavorites = async (newFavorites: string[]) => {
        try {
            await AsyncStorage.setItem(
                FAVORITES_KEY,
                JSON.stringify(newFavorites),
            );
        } catch (error) {
            console.warn("Failed to save favorites:", error);
        }
    };

    const toggleFavorite = useCallback((mealId: string) => {
        setFavorites((prev) => {
            const newFavorites = prev.includes(mealId)
                ? prev.filter((id) => id !== mealId)
                : [...prev, mealId];

            saveFavorites(newFavorites);
            return newFavorites;
        });
    }, []);

    const isFavorite = useCallback((mealId: string) => {
        return favorites.includes(mealId);
    }, [favorites]);

    return {
        favorites,
        isLoading,
        toggleFavorite,
        isFavorite,
    };
}
