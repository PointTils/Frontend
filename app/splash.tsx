import { useEffect, useRef, useState } from 'react';
import { View } from '@/src/components/ui/view';
import LottieView from 'lottie-react-native';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function CustomSplashScreen({ onFinish }: SplashScreenProps) {
  const animationRef = useRef<LottieView>(null);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [animationCompleted, setAnimationCompleted] = useState(false);

  useEffect(() => {
    // Tempo mínimo de 2 segundos
    const minTimer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 2000);

    // Fallback de segurança após 5 segundos
    const fallbackTimer = setTimeout(() => {
      onFinish();
    }, 5000);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(fallbackTimer);
    };
  }, [onFinish]);

  useEffect(() => {
    if (minTimeElapsed && animationCompleted) {
      onFinish();
    }
  }, [minTimeElapsed, animationCompleted, onFinish]);

  const handleAnimationFinish = () => {
    setAnimationCompleted(true);
  };

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <LottieView
        ref={animationRef}
        source={require('@/src/assets/animations/splash-hands.json')}
        autoPlay={false}
        loop={false}
        style={{
          width: 250,
          height: 250,
        }}
        onAnimationFinish={handleAnimationFinish}
        resizeMode="contain"
      />
    </View>
  );
}
