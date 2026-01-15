/**
 * Category-specific assets and styling data for TheMealDB categories.
 * Extracted from CategoryCard to centralize category metadata.
 */

/**
 * Type representing valid gradient color tuples for category overlays.
 */
export type GradientColorTuple = readonly [string, string];

/**
 * Category image URLs from TheMealDB.
 * Keys correspond to category names from the API.
 */
export const CATEGORY_IMAGES: Readonly<Record<string, string>> = {
    Beef: "https://www.themealdb.com/images/category/beef.png",
    Chicken: "https://www.themealdb.com/images/category/chicken.png",
    Dessert: "https://www.themealdb.com/images/category/dessert.png",
    Lamb: "https://www.themealdb.com/images/category/lamb.png",
    Miscellaneous:
        "https://www.themealdb.com/images/category/miscellaneous.png",
    Pasta: "https://www.themealdb.com/images/category/pasta.png",
    Pork: "https://www.themealdb.com/images/category/pork.png",
    Seafood: "https://www.themealdb.com/images/category/seafood.png",
    Side: "https://www.themealdb.com/images/category/side.png",
    Starter: "https://www.themealdb.com/images/category/starter.png",
    Vegan: "https://www.themealdb.com/images/category/vegan.png",
    Vegetarian: "https://www.themealdb.com/images/category/vegetarian.png",
    Breakfast: "https://www.themealdb.com/images/category/breakfast.png",
    Goat: "https://www.themealdb.com/images/category/goat.png",
} as const;

/**
 * Category gradient overlays for visual distinction.
 * Provides a unique color identity per category with fallback default.
 */
export const CATEGORY_GRADIENTS: Readonly<Record<string, GradientColorTuple>> =
    {
        Beef: ["rgba(185, 28, 28, 0.7)", "rgba(153, 27, 27, 0.9)"],
        Chicken: ["rgba(234, 88, 12, 0.7)", "rgba(194, 65, 12, 0.9)"],
        Dessert: ["rgba(219, 39, 119, 0.7)", "rgba(190, 24, 93, 0.9)"],
        Lamb: ["rgba(124, 58, 237, 0.7)", "rgba(109, 40, 217, 0.9)"],
        Pasta: ["rgba(245, 158, 11, 0.7)", "rgba(217, 119, 6, 0.9)"],
        Seafood: ["rgba(6, 182, 212, 0.7)", "rgba(8, 145, 178, 0.9)"],
        Vegan: ["rgba(22, 163, 74, 0.7)", "rgba(21, 128, 61, 0.9)"],
        Vegetarian: ["rgba(34, 197, 94, 0.7)", "rgba(22, 163, 74, 0.9)"],
        Breakfast: ["rgba(249, 115, 22, 0.7)", "rgba(234, 88, 12, 0.9)"],
        default: ["rgba(0, 0, 0, 0.5)", "rgba(0, 0, 0, 0.75)"],
    } as const;

/** Fallback category name for missing images */
export const FALLBACK_CATEGORY = "Miscellaneous";

/**
 * Retrieves the image URL for a given category.
 * Falls back to Miscellaneous if category is unknown.
 */
export const getCategoryImage = (
    categoryName: string,
    customImageUrl?: string,
): string =>
    customImageUrl ??
        CATEGORY_IMAGES[categoryName] ??
        CATEGORY_IMAGES[FALLBACK_CATEGORY];

/**
 * Retrieves the gradient colors for a given category.
 * Falls back to default gradient if category is unknown.
 */
export const getCategoryGradient = (
    categoryName: string,
): GradientColorTuple =>
    CATEGORY_GRADIENTS[categoryName] ?? CATEGORY_GRADIENTS.default;
