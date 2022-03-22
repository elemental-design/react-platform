import React, { CSSProperties } from 'react';

// @ts-ignore
import { Text as _Text, View as _View } from '@react-platform/core';
import { getInjectedStyles } from '../../context';



const typographyProps = ['fontFamily', 'fontSize', 'lineHeight', 'bold'];
const colorProps = ['color'];

// FIXME: Clean up or use styled-system internals ???? Or extract to React Platform stylesheet util library
const textStyleKeys = [...colorProps, ...typographyProps];

type CSSKeys = keyof CSSProperties;

const getSplitStyles = (style: CSSProperties) => {
  const { containerStyle, textStyle }: any = Object.keys(style).reduce((acc: any, k: any) => {
    if (textStyleKeys.includes(k)) { // @ts-ignore
      acc.textStyle[k] = style[k];
    } else { // @ts-ignore
      acc.containerStyle[k] = style[k];
    }
    return acc;
  }, { containerStyle: {}, textStyle: {} });

  return {
    containerStyle,
    textStyle,
  };
};


// TODO: Style injection system with middleware

const _TextInput = React.forwardRef(({
  onChangeText,
  onChange,
  components = {},
  multiline,
  value,
  placeholder,
  placeholderTextColor = 'gray',
  overrides: { style: styleOverride } = { style: {} },
  style,
  containerProps,
  ...props
}: {
  style: CSSProperties,
  onChangeText?: Function,
  onChange?: Function,
  components?: { [key: string]: any },
  overrides?: { style?: CSSProperties },
  value?: string,
  placeholder?: string,
  placeholderTextColor?: string,
  multiline?: boolean,
  containerProps?: any,
}, ref) => {
  // const { View = 'input' } = components || {};
  const { View, Text } = { View: components?.View, Text: components?.Text || _Text };
  const { containerStyle, textStyle } = getSplitStyles(style);
  // console.log({ containerStyle, textStyle });
  const containerStyleProps = getInjectedStyles(containerStyle);
  const showPlaceholder = Boolean(!value && placeholder);
  const textStyleProps = getInjectedStyles({  ...textStyle, color: showPlaceholder && placeholderTextColor, });

  // React.useEffect(() => {
  //   if (multiline) {
  //     setView(components?.TextArea || 'textarea');
  //   } else {
  //     setView(components?.Input || 'input');
  //   }
  // }, [multiline]);

  return (
    <View {...containerStyleProps} {...containerProps} >
      <Text
        ref={ref}
        // style={textStyle}
        {...textStyleProps}

        // onChange={onChange || (onChangeText
        //     ? ({ target: { value: targetValue }}: { target: { value: string }}) => onChangeText(targetValue)
        //     : undefined)}
        {...props}
      >
        {value ? value : placeholder}
      </Text>
    </View>
  );
});

_TextInput.defaultProps = {
  style: { fontSize: 14, outline: 'none', borderWidth: 0 },
};

export default _TextInput;
