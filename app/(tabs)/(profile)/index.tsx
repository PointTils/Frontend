import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { Strings } from '@/src/constants/Strings';
import { Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();

  // Frontend\app\(tabs)\(profile)\edit.tsx
  return (
    <View
      className="flex-1 items-center justify-center"
      accessibilityLabel={Strings.profile.title}
    >
      <Text>Edit</Text>
      <Button
        title="Editar Perfil"
        onPress={() => router.push('/edit')}
      />
    </View>
  );
}
