import type { VariantProps } from '@gluestack-ui/nativewind-utils';
import React from 'react';
import { View as RNView } from 'react-native';

import { AvatarFallbackText } from './avatar-fallback-text';
import { AvatarImage } from './avatar-image';
import { avatarStyle } from './styles';

type IAvatarProps = React.ComponentProps<typeof RNView> &
  VariantProps<typeof avatarStyle>;

const Avatar = React.forwardRef<
  React.ComponentRef<typeof RNView>,
  IAvatarProps
>(function Avatar(
  { className, size = 'md', borderRadius = 'full', ...props },
  ref,
) {
  return (
    <RNView
      className={avatarStyle({
        size,
        borderRadius,
        class: className,
      })}
      {...props}
      ref={ref}
    />
  );
});

Avatar.displayName = 'Avatar';

export { Avatar, AvatarFallbackText, AvatarImage };
