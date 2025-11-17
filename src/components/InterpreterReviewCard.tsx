import StarRating from '@/src/components/Rating';
import { formatDate } from '@/src/utils/masks';
import { View, Text } from 'react-native';

import { Avatar, AvatarImage } from './ui/avatar';
import { getSafeAvatarUri } from '../utils/helpers';

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
    <View className="flex-col py-4 gap-4 w-full">
      <View className="flex-row justify-between">
        <View className="flex-row items-center gap-4">
          <Avatar size="md" borderRadius="full">
            <AvatarImage
              source={{
                uri: getSafeAvatarUri({
                  remoteUrl: userPhoto,
                }),
              }}
            />
          </Avatar>

          <View className="flex-col justify-start">
            <Text
              className="font-ifood-medium max-w-[120]"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {userName}
            </Text>
            <StarRating rating={rating} size={14} />
          </View>
        </View>

        <Text className="font-ifood-regular text-sm">
          {formatDate(reviewDate)}
        </Text>
      </View>
      <Text className="font-ifood-regular text-typography-600 text-justify text-sm">
        {reviewText}
      </Text>
    </View>
  );
}
