import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { Strings } from '@/constants/Strings';

export default function ProfileScreen() {
  return (
    <View
      className="flex-1 items-center justify-center"
      accessibilityLabel={Strings.profile.title}
    >
      <Text>{Strings.profile.title}</Text>
    </View>
  );
}
