import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { Strings } from '@/constants/Strings';

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
