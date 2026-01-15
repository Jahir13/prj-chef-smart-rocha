// TheMealDB API Service
// Modern API client with enhanced error handling, retry logic, and caching

import {
  Category,
  CategoryResponse,
  Meal,
  MealPreview,
  MealPreviewResponse,
  MealResponse,
  ParsedIngredient,
} from "../types";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

// Configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const REQUEST_TIMEOUT = 10000;

// Simple in-memory cache
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public isNetworkError: boolean = false
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Fallback mock data for when API fails
const FALLBACK_MEAL: Meal = {
  idMeal: "52772",
  strMeal: "Teriyaki Chicken Casserole",
  strCategory: "Chicken",
  strArea: "Japanese",
  strInstructions:
    "Preheat oven to 350° F. Spray a 9x13-inch baking pan with non-stick spray.\n\nCombine soy sauce, ½ cup water, brown sugar, ginger and garlic in a small saucepan and cover. Bring to a boil over medium heat. Remove lid and cook for one minute once boiling.\n\nMeanwhile, stir together the cornstarch and 2 tablespoons of water in a separate dish until smooth. Once sauce is boiling, add cornstarch mixture to the saucepan and stir to combine. Cook until the sauce starts to thicken then remove from heat.\n\nPlace the chicken breasts in the prepared pan. Pour one cup of the sauce over top of chicken. Place chicken in oven and bake 35 minutes or until cooked through. Remove from oven and shred the chicken in the pan using two forks.\n\n*Meanwhile,ثcook the rice according to package directions.\n\nAdd the rice and remaining sauce to the casserole and stir to combine. Sprinkle the remaining 1/2 cup cheese over the top of the casserole. Return the casserole to the oven and bake an additional 15 minutes or until cheese is melted and bubbly. Garnish with green onions, if desired.",
  strMealThumb:
    "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
  strTags: "Meat,Casserole",
  strYoutube: "https://www.youtube.com/watch?v=4aZr5hZXP_s",
  strIngredient1: "soy sauce",
  strIngredient2: "water",
  strIngredient3: "brown sugar",
  strIngredient4: "ground ginger",
  strIngredient5: "minced garlic",
  strIngredient6: "cornstarch",
  strIngredient7: "chicken breasts",
  strIngredient8: "stir-fry vegetables",
  strIngredient9: "brown rice",
  strMeasure1: "3/4 cup",
  strMeasure2: "1/2 cup",
  strMeasure3: "1/4 cup",
  strMeasure4: "1/2 teaspoon",
  strMeasure5: "1/2 teaspoon",
  strMeasure6: "4 Tablespoons",
  strMeasure7: "2",
  strMeasure8: "1 (12 oz.)",
  strMeasure9: "3 cups",
};

// Helper function to delay execution
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to create a timeout promise
const createTimeout = (ms: number): Promise<never> =>
  new Promise((_, reject) =>
    setTimeout(
      () => reject(new ApiError("Request timeout", undefined, true)),
      ms
    )
  );

// Get cached data if valid
function getCached<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }
  cache.delete(key);
  return null;
}

// Set cache data
function setCache(key: string, data: unknown): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// Helper function to make API calls with retry logic and caching
async function fetchWithRetry<T>(
  url: string,
  fallback: T,
  options: { useCache?: boolean; cacheKey?: string } = {}
): Promise<T> {
  const { useCache = true, cacheKey = url } = options;

  // Check cache first
  if (useCache) {
    const cached = getCached<T>(cacheKey);
    if (cached) return cached;
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await Promise.race([
        fetch(url),
        createTimeout(REQUEST_TIMEOUT),
      ]);

      if (!response.ok) {
        throw new ApiError(
          `HTTP error! status: ${response.status}`,
          response.status
        );
      }

      const data = await response.json();

      // Cache successful response
      if (useCache) {
        setCache(cacheKey, data);
      }

      return data;
    } catch (error) {
      lastError = error as Error;
      console.warn(`API attempt ${attempt + 1}/${MAX_RETRIES} failed:`, error);

      if (attempt < MAX_RETRIES - 1) {
        await delay(RETRY_DELAY * (attempt + 1)); // Exponential backoff
      }
    }
  }

  console.error(`All ${MAX_RETRIES} attempts failed for ${url}:`, lastError);
  return fallback;
}

// Get a random meal for "Recipe of the Day"
export async function getRandomMeal(): Promise<Meal | null> {
  const data = await fetchWithRetry<MealResponse>(
    `${BASE_URL}/random.php`,
    { meals: [FALLBACK_MEAL] },
    { useCache: false } // Don't cache random results
  );
  return data.meals?.[0] ?? FALLBACK_MEAL;
}

// Search meals by name
export async function searchMealByName(name: string): Promise<MealPreview[]> {
  if (!name.trim()) return [];

  const data = await fetchWithRetry<MealResponse>(
    `${BASE_URL}/search.php?s=${encodeURIComponent(name)}`,
    { meals: null },
    { cacheKey: `search_${name.toLowerCase()}` }
  );

  return (data.meals ?? []).map((meal) => ({
    idMeal: meal.idMeal,
    strMeal: meal.strMeal,
    strMealThumb: meal.strMealThumb,
  }));
}

// Filter meals by ingredient (core Pantry feature)
export async function filterByIngredient(
  ingredient: string
): Promise<MealPreview[]> {
  const data = await fetchWithRetry<MealPreviewResponse>(
    `${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`,
    { meals: null },
    { cacheKey: `ingredient_${ingredient.toLowerCase()}` }
  );
  return data.meals ?? [];
}

// Filter meals by category
export async function filterByCategory(
  category: string
): Promise<MealPreview[]> {
  const data = await fetchWithRetry<MealPreviewResponse>(
    `${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`,
    { meals: null },
    { cacheKey: `category_${category.toLowerCase()}` }
  );
  return data.meals ?? [];
}

// Get full meal details by ID
export async function getMealDetails(id: string): Promise<Meal | null> {
  const data = await fetchWithRetry<MealResponse>(
    `${BASE_URL}/lookup.php?i=${id}`,
    { meals: null },
    { cacheKey: `meal_${id}` }
  );
  return data.meals?.[0] ?? null;
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
  const data = await fetchWithRetry<CategoryResponse>(
    `${BASE_URL}/categories.php`,
    { categories: [] },
    { cacheKey: "categories" }
  );
  return data.categories;
}

// Clear the API cache
export function clearApiCache(): void {
  cache.clear();
}

// Helper function to parse ingredients from a meal object
export function parseIngredients(meal: Meal): ParsedIngredient[] {
  const ingredients: ParsedIngredient[] = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}` as keyof Meal] as
      | string
      | undefined;
    const measure = meal[`strMeasure${i}` as keyof Meal] as string | undefined;

    if (ingredient && ingredient.trim()) {
      ingredients.push({
        name: ingredient.trim(),
        measure: measure?.trim() || "",
      });
    }
  }

  return ingredients;
}
