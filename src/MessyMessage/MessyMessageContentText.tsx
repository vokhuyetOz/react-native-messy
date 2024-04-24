import React from 'react';
import { Linking } from 'react-native';

//@ts-ignore
import ParsedText from 'react-native-parsed-text';

import { useColors, useSizes } from '../modules';

import type { IMessyMessageProps } from '../Messy';

export function MessyMessageContentText(props: IMessyMessageProps) {
  const Colors = useColors();
  const Sizes = useSizes();

  const { renderMessageText, value, user, parsedShape = [] } = props;
  if (!value?.text) {
    return null;
  }

  if (typeof renderMessageText === 'function') {
    return renderMessageText(props);
  }

  const onUrlPress = (url: string) => {
    // When someone sends a message that includes a website address beginning with "www." (omitting the scheme),
    // react-native-parsed-text recognizes it as a valid url, but Linking fails to open due to the missing scheme.
    if (/^www\./i.test(url)) {
      onUrlPress(`https://${url}`);
      return;
    }
    Linking.openURL(url).catch(() => {});
  };
  const onEmailPress = (email: string) => {
    Linking.openURL(`mailto:${email}`).catch((e) => {
      console.log('e', e);
    });
  };

  const backgroundColor: string = {
    true: Colors.message_right.background,
    false: Colors.message_left.background,
  }[`${user?.id === value?.user?.id}`];

  const textColor: string = {
    true: Colors.message_right.text,
    false: Colors.message_left.text,
  }[`${user?.id === value?.user?.id}`];

  const linkColor: string = {
    true: Colors.message_right.link,
    false: Colors.message_left.link,
  }[`${user?.id === value?.user?.id}`];

  const phoneColor: string = {
    true: Colors.message_right.phone,
    false: Colors.message_left.phone,
  }[`${user?.id === value?.user?.id}`];

  const emailColor: string = {
    true: Colors.message_right.email,
    false: Colors.message_left.email,
  }[`${user?.id === value?.user?.id}`];

  return (
    <ParsedText
      style={{
        color: textColor,
        fontSize: Sizes.message,
        lineHeight: Sizes.message_line_height,
        paddingHorizontal: Sizes.padding,
        paddingVertical: Sizes.padding / 2,
        backgroundColor,
      }}
      parse={[
        {
          type: 'url',
          style: {
            color: linkColor,
            textDecorationLine: 'underline',
          },
          onPress: onUrlPress,
        },
        {
          type: 'phone',
          style: { color: phoneColor, textDecorationLine: 'underline' },
          onPress: () => {},
        },
        {
          type: 'email',
          style: { color: emailColor, textDecorationLine: 'underline' },
          onPress: onEmailPress,
        },
        ...parsedShape,
      ]}
    >
      {value?.text}
    </ParsedText>
  );
}
