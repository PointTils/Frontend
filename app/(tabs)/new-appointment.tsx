import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { Strings } from '@/src/constants/Strings';

export default function NewAppointmentScreen() {
  return (
    <View
      className="flex-1 items-center justify-center"
      accessibilityLabel={Strings.newAppointment.title}
    >
      <Text>{Strings.newAppointment.title}</Text>
    </View>
  );
}
