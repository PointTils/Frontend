import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';

/**
 * A wrapper component for buttons that adds haptic feedback when pressed.
 * Provides a light impact feedback when users interact with tab navigation.
 *
 * @param props - All standard BottomTabBarButtonProps from React Navigation
 * @returns A PlatformPressable component with haptic feedback
 *
 * @example
 * // In your tab navigator configuration:
 * <Tab.Screen
 *   name="Home"
 *   component={HomeScreen}
 *   options={{
 *     tabBarButton: (props) => <HapticTab {...props} />,
 *   }}
 * />
 */

export default function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        // Add a soft haptic feedback when pressing down on the tabs.
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        props.onPressIn?.(ev);
      }}
    />
  );
}
