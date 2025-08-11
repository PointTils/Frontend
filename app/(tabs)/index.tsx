import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { Strings } from '@/src/constants/Strings';

export default function MyAppointmentsScreen() {
  return (
    <View
      className="flex-1 items-center justify-center"
      accessibilityLabel={Strings.myAppointments.title}
    >
      <Text>{Strings.myAppointments.title}</Text>
    </View>
  );
}
