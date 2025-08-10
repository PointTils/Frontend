import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { Strings } from '@/constants/Strings';

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
