// Type declarations for React 19 compatibility with React Native
import "@react-native/js-polyfills";

declare module "react-native" {
  // Extend the module to ensure proper JSX typing
  export * from "react-native";
}
