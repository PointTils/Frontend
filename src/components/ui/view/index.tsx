import React from 'react';
import { View as RNView } from 'react-native';

type IViewProps = React.ComponentProps<typeof RNView> & { className?: string };

export const View = React.forwardRef<React.ComponentRef<typeof RNView>, IViewProps>(
  (props, ref) => <RNView ref={ref} {...props} />
);
View.displayName = 'View';

export default View;
