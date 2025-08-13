import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { Strings } from '@/src/constants/Strings';

export default function HistoryScreen() {
  return (
    <View
      className="flex-1 items-center justify-center"
      accessibilityLabel={Strings.history.title}
    >
      <Text className='font-ifood-regular'>{Strings.history.title}</Text>
    </View>
  );
}
