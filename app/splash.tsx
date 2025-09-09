import { useEffect } from 'react';
import { View } from '@/src/components/ui/view';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function CustomSplashScreen({ onFinish }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2000); // 2 segundos de duração

    return () => clearTimeout(timer);
  }, [onFinish]);

  return <View className="flex-1 items-center justify-center bg-white"></View>;
}
