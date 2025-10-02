import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { Strings } from '@/src/constants/Strings';
import { Button } from '@/src/components/ui/button';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <View
      className="flex-1 items-center justify-center py-8"
      accessibilityLabel={Strings.home.tabBar}
    >
      <Text className="font-ifood-regular">{Strings.home.tabBar}</Text>
    </View>
  );
}
