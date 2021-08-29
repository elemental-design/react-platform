/*
 * This file contains source-code copied from https://github.com/facebook/react-native/blob/master/Libraries/Components/Button.js
 * React Native's source code is licensed under the MIT license: https://github.com/facebook/react-native/blob/master/LICENSE
*/
import * as React from 'react';
import { Platform, Touchable, View, Text, StyleSheet } from '@react-platform/core';

const Button = ({
  accessibilityLabel,
  color,
  onPress,
  touchSoundDisabled,
  title,
  hasTVPreferredFocus,
  nextFocusDown,
  nextFocusForward,
  nextFocusLeft,
  nextFocusRight,
  nextFocusUp,
  disabled,
  testID,
  style,
  textStyle,
 }: any) => {
  const buttonStyles = [styles.button];
  const textStyles = [styles.text];

  if (style) {
    buttonStyles.push(style);
  }
  if (textStyle) {
    textStyles.push(textStyle);
  }

  const accessibilityState: { disabled?: boolean } = {};

  if (disabled) {
    buttonStyles.push(styles.buttonDisabled);
    textStyles.push(styles.textDisabled);
    accessibilityState.disabled = true;
  }

  const formattedTitle =
    Platform.OS === 'android' ? title.toUpperCase() : title;
  
  return (
    <Touchable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={accessibilityState}
      hasTVPreferredFocus={hasTVPreferredFocus}
      nextFocusDown={nextFocusDown}
      nextFocusForward={nextFocusForward}
      nextFocusLeft={nextFocusLeft}
      nextFocusRight={nextFocusRight}
      nextFocusUp={nextFocusUp}
      testID={testID}
      disabled={disabled}
      onPress={onPress}
      touchSoundDisabled={touchSoundDisabled}
    >
      <View style={buttonStyles}>
        <Text style={textStyles} disabled={disabled}>
          {formattedTitle}
        </Text>
      </View>
    </Touchable>
  )
};

const styles = StyleSheet.create({
  button: Platform.select({
    ios: {},
    android: {
      elevation: 4,
      // Material design blue from https://material.google.com/style/color.html#color-color-palette
      backgroundColor: '#2196F3',
      borderRadius: 2,
    },
  }),
  text: {
    textAlign: 'center',
    margin: 8,
    ...Platform.select({
      ios: {
        // iOS blue from https://developer.apple.com/ios/human-interface-guidelines/visual-design/color/
        color: '#007AFF',
        fontSize: 18,
      },
      android: {
        color: 'white',
        fontWeight: '500',
      },
    }),
  },
  buttonDisabled: Platform.select({
    ios: {},
    android: {
      elevation: 0,
      backgroundColor: '#dfdfdf',
    },
  }),
  textDisabled: Platform.select({
    ios: {
      color: '#cdcdcd',
    },
    android: {
      color: '#a1a1a1',
    },
  }),
});

export default Button;
