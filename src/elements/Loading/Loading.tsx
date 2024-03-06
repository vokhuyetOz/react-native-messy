import React from 'react';

import { ActivityIndicator, type ActivityIndicatorProps } from 'react-native';

export function MLoading(props: Readonly<ActivityIndicatorProps>) {
  return <ActivityIndicator {...props} />;
}
