import { Text as WidgetText } from '../figma/widget';
// const { Frame, AutoLayout, Text: _Text, SVG } = widget as WidgetAPI;

import { extractTextStyles, extractSizeStyles, extractBaseProps, extractBlendProps, extractConstraintProps } from '../utils';


/*
name	""
hidden	false
x	0
y	0
blendMode	"pass-through"
opacity	1
effect	[]
width	"hug-contents"
height	"hug-contents"
rotation	0
fontFamily	"Inter"
horizontalAlignText	"left"
verticalAlignText	"top"
leadingTrim	"auto"
letterSpacing	0
lineHeight	"auto"
textDecoration	"none"
textCase	"original"
fontSize	16
italic	false
fill	"#000000"
blendMode	"normal"
fontWeight	400
paragraphIndent	0
paragraphSpacing	0
listSpacing	0
hangingPunctuation	false
hangingList	false
truncate	false
*/



const extractStyles = (style) => {
  return {
    ...extractTextStyles(style),
    ...extractSizeStyles(style),
    ...extractBaseProps(style),
    ...extractBlendProps(style),
    ...extractConstraintProps(style),
  }
}

export default function Text({ href, onClick, children, style, ...props }) {
  return (
    <WidgetText
      {...extractStyles(style)}
      href={href}
      onClick={onClick}
      {...props}
    >
      {children}
    </WidgetText>
  )
}

