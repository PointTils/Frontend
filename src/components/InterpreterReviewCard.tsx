import { Avatar, AvatarImage } from './ui/avatar';
import { StarRating } from '@/src/components/Rating';
import { formatDate } from '@/src/utils/masks';
import { View, Text } from 'react-native';

interface InterpreterReviewCardProps {
  userName: string;
  userPhoto: string | null;
  rating: number;
  reviewDate: string;
  reviewText?: string;
}

export default function InterpreterReviewCard({
  userName,
  userPhoto,
  rating,
  reviewDate,
  reviewText,
}: InterpreterReviewCardProps) {
  return (
    <View className="flex-col py-4 gap-4 w-full mt-4">
      <View className="flex-row justify-between">
        <View className="flex-row items-center gap-4">
          <Avatar size="md" borderRadius="full">
            <AvatarImage
              source={{
                uri:
                  userPhoto ||
                  'https://gravatar.com/avatar/ff18d48bfe44336236f01212d96c67f0?s=400&d=mp&r=x',
              }}
            />
          </Avatar>

          <View className="flex-col justify-start">
            <Text className="font-ifood-bold">{userName}</Text>
            <StarRating rating={rating} size={12} />
          </View>
        </View>

        <Text className="font-ifood-medium text-sm">
          {formatDate(reviewDate)}
        </Text>
      </View>
      <Text className="font-ifood-regular text-typography-600 text-justify text-md">
        {reviewText}
      </Text>
    </View>
  );
}
