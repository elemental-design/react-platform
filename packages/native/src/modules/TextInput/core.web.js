const React = require('react');

const _TextInput = React.forwardRef(({ components, multiline, style, ...props }, ref) => {
  // const { View = 'input' } = components || {};
  const [View, setView] = useState(components?.View || 'input');

  useEffect(() => {
    if (multiline) {
      setView(components?.TextArea || 'textarea');
    } else {
      setView(components?.Input || 'input');
    }
  }, multiline);
  console.log({ View });

  return (
    <View
      ref={ref}
      style={{ fontSize: 14, outline: 'none', borderWidth: 0, ...style }}
      {...props}
    />
  );
});

module.exports = _TextInput;
