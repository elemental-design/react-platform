interface TransformObject {
  [key: string]: number;
}

function parseTransform(transform: string): TransformObject {
  const transformObject: TransformObject = {};

  const regex = /(\w+)\(([^)]+)\)/g;
  let match;

  while ((match = regex.exec(transform)) !== null) {
      const [, property, values] = match;
      const parsedValues = values.split(',').map(value => parseFloat(value.trim()));

      switch (property) {
          case 'rotate':
              transformObject.rotate = parsedValues[0];
              break;
          case 'translate':
              transformObject.translateX = parsedValues[0];
              transformObject.translateY = parsedValues[1];
              break;
          // Add other cases for other transform types if needed
          default:
              break;
      }
  }

  return transformObject;
}

export const extractConstraintProps = (style) => {
  const { x, y } = style;
  return { x, y }
}

export const extractBlendProps = (style) => {
  const { mixBlendMode, opacity, effect } = style;// mixBlendMode is react-dom/web only
  return {
    blendMode: mixBlendMode, opacity, effect
  }
}

export const extractBaseProps = (style): BaseProps => {
  const { display, position } = style;
  let name: any, onClick: any, key: any, hoverStyle: any, tooltip: any;

  return {
    name,
    hidden: display === 'none' ? true : false,
    onClick, key, hoverStyle, tooltip,
    positioning: position === 'absolute' ? 'absolute' : 'auto',
  }
}

export const extractSizeStyles = (style) => {
  const { width, height, minWidth, minHeight, maxWidth, maxHeight, transform } = style;
  const transformProps = parseTransform(transform);
  const { rotate: rotation } = transformProps;

  return { width, height, minWidth, maxWidth, minHeight, maxHeight, rotation }
}

/*
href?: string
fontFamily?: string
letterSpacing?: number | string
textDecoration?: 'none' | 'strikethrough' | 'underline'
fontSize?: number
italic?: boolean
textCase?: 'upper' | 'lower' | 'title' | 'original' | 'small-caps' | 'small-caps-forced'
fontWeight?: FontWeight # eg. 400, 500 or 'medium', 'bold'.
fill?: HexCode | Color | Paint | (SolidPaint | GradientPaint)[]
paragraphIndent?: number
paragraphSpacing?: number
horizontalAlignText?: 'left' | 'right' | 'center' | 'justified'
verticalAlignText?: 'top' | 'center' | 'bottom'
lineHeight?: number | string | 'auto'
truncate?: boolean | number # ( number of lines)
stroke?: HexCode | Color | SolidPaint | GradientPaint | (SolidPaint | GradientPaint)[]
strokeWidth?: number
strokeAlign?: StrokeAlign
*/

const parseTextDecoration = (style) => {
  const { textDecorationLine } = style;
  if (['none', 'underline', 'line-through'].includes(textDecorationLine)) { // TODO: multiple? ['underline line-through']
    return {
      none: 'none',
      underline: 'underline',
      'line-through': 'strikethrough',
    }[textDecorationLine];
  } 
  return undefined;
}

const parseItalic = (style) => {
  const { fontStyle } = style;
  return fontStyle === 'italic' ? true : false;
}
const parseTextCase = ({ textTransform, fontVariant }) => {
  // style.fontVariant – array of enum('small-caps', 'oldstyle-nums', 'lining-nums', 'tabular-nums', 'proportional-nums') or string	
  // enum('none', 'uppercase', 'lowercase', 'capitalize')	
  if (['uppercase', 'lowercase', 'capitalize'].includes(textTransform)) {
    return {
      none: 'original',
      uppercase: 'upper',
      lowercase: 'lower',
      // | 'title' | 'original' | 'small-caps' | 'small-caps-forced'
    }[textTransform];
  }
  if (['small-caps', 'oldstyle-nums', 'lining-nums', 'tabular-nums', 'proportional-nums'].includes(fontVariant[0])) {
    return {
      'small-caps': 'small-caps',
      'titling-caps': 'title',
    }[fontVariant[0]];
  }
  return undefined;
}

const parseHorizontalAlignText = (style) => {
  const { textAlign } = style;

  return {
    start: 'left',
    end: 'right',
    center: 'center',
    left: 'left',
    right: 'right',
  }[textAlign];
}

// let initialiser as placeholder for future API
export const extractTextStyles = (style) => {
  const { color, fontFamily, lineHeight, fontSize, fontWeight, fontVariant, letterSpacing, textTransform } = style;
  let href: string;


  return {
    href,
    fontFamily,
    letterSpacing,
    textDecoration: parseTextDecoration(style),
    fontSize,
    italic: parseItalic(style),
    textCase: parseTextCase({ textTransform, fontVariant }),
    fontWeight,
    fill: color,
    // paragraphIndent,
    // paragraphSpacing,
    horizontalAlignText: parseHorizontalAlignText(style),
    // verticalAlignText,
    lineHeight,
    // truncate,
    // stroke,
    // strokeWidth,
    // strokeAlign,
  }
}