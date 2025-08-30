// app/(tabs)/index.tsx
import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { Strings } from '@/src/constants/Strings';
import { Redirect } from 'expo-router';

export default function HomeScreen() {
  const hasSeenOnboarding = false; // mude para true depois que concluir o onboarding

  if (!hasSeenOnboarding) {
    // antes: "/OnboardingUserScreen"  (não existe mais)
    return <Redirect href="/Onboarding" />;
    // para testar empresa:
    // return <Redirect href={{ pathname: '/Onboarding', params: { type: 'company' } }} />;
  }

  return (
    <View
      className="flex-1 items-center justify-center"
      accessibilityLabel={Strings.home.title}
    >
      <Text className="font-ifood-regular">{Strings.home.title}</Text>
    </View>
  );
}
