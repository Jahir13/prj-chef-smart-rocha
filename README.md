# Chef Smart 👨‍🍳

A modern mobile recipe discovery app built with React Native and Expo, featuring recipe search, favorites management, and pantry-based meal suggestions.

## 📱 Features

- **Recipe Discovery**: Browse and search through thousands of recipes from TheMealDB API
- **Recipe of the Day**: Get daily recipe recommendations with pull-to-refresh
- **Category Browsing**: Explore recipes by cuisine categories (Italian, Chinese, Mexican, etc.)
- **Search Functionality**: Find recipes by name or ingredients
- **Favorites Management**: Save your favorite recipes for quick access
- **Pantry Tracker**: Manage your ingredients and discover recipes based on what you have
- **Detailed Recipe View**: View ingredients, instructions, and cooking videos
- **Clean UI**: Modern design with smooth animations and intuitive navigation

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Routing**: Expo Router (file-based routing)
- **Language**: TypeScript
- **Storage**: AsyncStorage for local data persistence
- **API**: TheMealDB API for recipe data
- **Icons**: Lucide React Native
- **UI**: Custom components with React Native's core components

## 📁 Project Structure

```
mov/
├── app/                      # App screens and routing
│   ├── (tabs)/              # Tab-based navigation screens
│   │   ├── index.tsx        # Home screen (recipe discovery)
│   │   ├── favorites.tsx    # Favorites management
│   │   └── pantry.tsx       # Pantry management
│   ├── recipe/              # Recipe details
│   │   └── [id].tsx         # Dynamic recipe detail screen
│   └── _layout.tsx          # Root layout configuration
├── components/              # Reusable UI components
│   ├── CategoryCard.tsx     # Category display card
│   ├── IngredientChip.tsx   # Ingredient tag component
│   ├── RecipeCard.tsx       # Recipe preview card
│   └── SearchBar.tsx        # Search input component
├── constants/               # App-wide constants
│   ├── data.ts             # Static data (categories, etc.)
│   └── theme.ts            # Design tokens (colors, spacing, etc.)
├── hooks/                   # Custom React hooks
│   └── useFavorites.ts     # Favorites management hook
├── services/                # External services
│   └── api.ts              # TheMealDB API integration
├── types/                   # TypeScript type definitions
│   └── index.ts            # Shared interfaces and types
└── assets/                  # Images and static resources
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for macOS) or Android Studio (for Android development)
- Expo Go app (for testing on physical devices)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mov
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 📱 Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator/device
- `npm run web` - Run in web browser

## 🎨 Key Components

### Home Screen
- Recipe of the day with refresh functionality
- Category quick filters
- Search bar for recipe discovery
- Dynamic recipe grid display

### Favorites Screen
- Persistent storage of favorite recipes
- Quick access to saved recipes
- Easy management with add/remove functionality

### Pantry Screen
- Ingredient inventory management
- Add/remove ingredients from your pantry
- Get recipe suggestions based on available ingredients

### Recipe Detail Screen
- Full recipe information with image
- Complete ingredient list with measurements
- Step-by-step cooking instructions
- Optional YouTube video link
- Favorite toggle button

## 🔌 API Integration

The app uses [TheMealDB API](https://www.themealdb.com/api.php) for recipe data:
- `getRandomMeal()` - Fetch random recipe
- `searchMealByName()` - Search recipes by name
- `filterByCategory()` - Filter recipes by category
- `getMealById()` - Get detailed recipe information
- `searchByIngredient()` - Find recipes by ingredient

## 💾 Data Persistence

Local data is stored using AsyncStorage:
- **Favorites**: User's saved recipes
- **Pantry**: User's ingredient inventory

## 🎨 Design System

The app uses a consistent design system defined in `constants/theme.ts`:
- **Primary Color**: Orange (#F97316)
- **Typography**: Multiple font sizes and weights
- **Spacing**: Consistent spacing scale (xs, sm, md, lg, xl)
- **Border Radius**: Predefined radius values
- **Shadows**: Elevation system for depth

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is part of a university coursework.

## 👨‍💻 Author

João Rocha - University Project

## 🙏 Acknowledgments

- Recipe data provided by [TheMealDB](https://www.themealdb.com)
- Icons by [Lucide](https://lucide.dev)
- Built with [Expo](https://expo.dev)
