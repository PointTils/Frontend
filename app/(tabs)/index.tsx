import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { Button, ButtonText } from '@/src/components/ui/button';
import { Strings } from '@/src/constants/Strings';
import { router } from 'expo-router';

export default function HomeScreen() {
  const navigateToCardTest = () => {
    router.push('/card-test');
  };

  return (
    <View
      className="flex-1 items-center justify-center p-4"
      accessibilityLabel={Strings.home.title}
    >
      <Text className="font-ifood-regular text-center mb-6">{Strings.home.title}</Text>
      <Button action="primary" onPress={navigateToCardTest}>
        <ButtonText>Testar Componente Card</ButtonText>
      </Button>
    </View>
  );
}
