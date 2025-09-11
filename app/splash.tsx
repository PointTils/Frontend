import { useEffect, useRef } from 'react';
import { View } from '@/src/components/ui/view';
import LottieView from 'lottie-react-native';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function CustomSplashScreen({ onFinish }: SplashScreenProps) {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    const timer = setTimeout(onFinish, 2500); // Fallback após 2.5s
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <LottieView
        ref={animationRef}
        source={require('@/src/assets/animations/splash-hands.json')}
        autoPlay
        loop={false}
        style={{ width: 250, height: 250 }}
        onAnimationFinish={onFinish}
        resizeMode="contain"
      />
    </View>
  );
}
