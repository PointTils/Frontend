import React from 'react';
import { Image as RNImage, ImageProps as RNImageProps } from 'react-native';

type IAvatarImageProps = RNImageProps;

const AvatarImage = React.forwardRef<
  React.ComponentRef<typeof RNImage>,
  IAvatarImageProps
>(function AvatarImage(props, ref) {
  return (
    <RNImage className="h-full w-full object-cover" {...props} ref={ref} />
  );
});

AvatarImage.displayName = 'AvatarImage';

export { AvatarImage };
