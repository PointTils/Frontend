import { View } from '@/src/components/ui/view';
import LottieView from 'lottie-react-native';
import { useRef } from 'react';
import { StyleSheet } from 'react-native';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function CustomSplashScreen({ onFinish }: SplashScreenProps) {
  const animationRef = useRef<LottieView>(null);

  return (
    <View className="flex-1 items-center justify-center bg-background-0">
      <LottieView
        ref={animationRef}
        source={require('@/src/assets/animations/splash-hands.json')}
        autoPlay
        loop={false}
        style={styles.lottie}
        onAnimationFinish={onFinish}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  lottie: {
    width: 250,
    height: 250,
  },
});
