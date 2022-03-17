let svg;

if (typeof window !== 'undefined') {
  svg = require('./core.web');
} else {
  svg = require('./common');
}

const {
  Svg,
  Circle,
  ClipPath,
  Ellipse,
  G,
  Image,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Pattern,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Text,
  TextPath,
  TSpan,
  Use,
  Defs,
  Stop,
} = svg;

export {
  Svg,
  Circle,
  ClipPath,
  Ellipse,
  G,
  Image,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Pattern,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Text,
  TextPath,
  TSpan,
  Use,
  Defs,
  Stop,
};

export default svg;
