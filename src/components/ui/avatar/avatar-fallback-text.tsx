import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';

type IAvatarFallbackTextProps = RNTextProps;

const AvatarFallbackText = React.forwardRef<React.ComponentRef<typeof RNText>, IAvatarFallbackTextProps>(
  function AvatarFallbackText(props, ref) {
    return (
      <RNText
        className="text-gray-600 font-medium text-center"
        {...props}
        ref={ref}
      />
    );
  },
);

AvatarFallbackText.displayName = 'AvatarFallbackText';

export { AvatarFallbackText };
