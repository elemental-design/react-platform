import React, { CSSProperties, Ref } from 'react';

// TODO: Style injection system with middleware

const _TextInput = React.forwardRef(({
  onChangeText,
  onChange,
  components,
  multiline,
  overrides: { style: styleOverride } = { style: {} },
  style,
  ...props
}: {
  style?: CSSProperties,
  onChangeText?: Function,
  onChange?: Function,
  components?: { [key: string]: any },
  overrides?: { style?: CSSProperties },
  multiline?: boolean,
}, ref: Ref<any>) => {
  // const { View = 'input' } = components || {};
  const [View, setView] = React.useState(components?.View || 'input');

  React.useEffect(() => {
    if (multiline) {
      setView(components?.TextArea || 'textarea');
    } else {
      setView(components?.Input || 'input');
    }
  }, [multiline]);

  return (
    <View
      ref={ref}
      style={style}
      onChange={onChange || (onChangeText
          ? ({ target: { value }}: { target: { value: string }}) => onChangeText(value)
          : undefined)}
      {...props}
    />
  );
});

_TextInput.defaultProps = {
  style: { fontSize: 14, outline: 'none', borderWidth: 0 },
};

export default _TextInput;
