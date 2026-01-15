import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";

interface FavoritesContextType {
  favorites: string[];
  isLoading: boolean;
  toggleFavorite: (mealId: string) => void;
  isFavorite: (mealId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  isLoading: true,
  toggleFavorite: () => {},
  isFavorite: () => false,
});

export function FavoritesProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Clave única por usuario (o genérica si no hay usuario)
  const getFavoritesKey = useCallback(() => {
    return user
      ? `chef_smart_favorites_${user.uid}`
      : "chef_smart_favorites_guest";
  }, [user]);

  // Cargar favoritos cuando cambia el usuario
  useEffect(() => {
    const loadFavorites = async () => {
      setIsLoading(true);
      try {
        const key = getFavoritesKey();
        const stored = await AsyncStorage.getItem(key);
        if (stored) {
          setFavorites(JSON.parse(stored));
        } else {
          setFavorites([]);
        }
      } catch (error) {
        console.warn("Failed to load favorites:", error);
        setFavorites([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [getFavoritesKey, user]);

  const saveFavorites = useCallback(
    async (newFavorites: string[]) => {
      try {
        const key = getFavoritesKey();
        await AsyncStorage.setItem(key, JSON.stringify(newFavorites));
      } catch (error) {
        console.warn("Failed to save favorites:", error);
      }
    },
    [getFavoritesKey],
  );

  const toggleFavorite = useCallback(
    (mealId: string) => {
      setFavorites((prev) => {
        const newFavorites = prev.includes(mealId)
          ? prev.filter((id) => id !== mealId)
          : [...prev, mealId];

        saveFavorites(newFavorites);
        return newFavorites;
      });
    },
    [saveFavorites],
  );

  const isFavorite = useCallback(
    (mealId: string) => {
      return favorites.includes(mealId);
    },
    [favorites],
  );

  // Memoizar el valor del contexto para evitar re-renders innecesarios
  const value = useMemo(
    () => ({
      favorites,
      isLoading,
      toggleFavorite,
      isFavorite,
    }),
    [favorites, isLoading, toggleFavorite, isFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

// Hook para usar el contexto
export const useFavorites = () => useContext(FavoritesContext);
