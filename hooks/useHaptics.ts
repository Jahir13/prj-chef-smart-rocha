import { useCallback } from "react";
import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

type HapticStyle =
  | "light"
  | "medium"
  | "heavy"
  | "success"
  | "warning"
  | "error"
  | "selection";

/**
 * Modern haptic feedback hook for enhanced user experience
 * Provides tactile feedback for various interactions
 */
export function useHaptics() {
  const trigger = useCallback(async (style: HapticStyle = "light") => {
    if (Platform.OS === "web") return;

    try {
      switch (style) {
        case "light":
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case "medium":
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case "heavy":
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case "success":
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
          );
          break;
        case "warning":
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Warning
          );
          break;
        case "error":
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Error
          );
          break;
        case "selection":
          await Haptics.selectionAsync();
          break;
      }
    } catch (error) {
      // Silently fail if haptics aren't available
      console.debug("Haptics not available:", error);
    }
  }, []);

  return { trigger };
}
