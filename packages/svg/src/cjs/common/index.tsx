// Stubs to prevent crashes
// @ts-ignore
import { StyleSheet, View } from '@react-platform/core';
import { ReactNode } from 'react';



const Circle = () => null;

const ClipPath = () => null;

const Ellipse = () => null;

const G = () => null;

const Image = () => null;

const LinearGradient = () => null;

const RadialGradient = () => null;

const Line = () => null;

const Path = () => null;

const Pattern = () => null;

const Polygon = () => null;

const Polyline = () => null;

const Rect = () => null;

const SvgSymbol = () => null;

const Text = () => null;

const TextPath = () => null;

const TSpan = () => null;

const Use = () => null;

const Defs = () => null;

const Stop = () => null;

// TODO: Render some warning text that svgs do not work on this platform, or a placeholder coloured rectangle or something
const Svg = ({ children, width = 64, height = 64 }: { children: ReactNode, width?: number, height?: number }) => (
  <View style={StyleSheet.create({ width, height })}>
    {children}
  </View>
);


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
  SvgSymbol as Symbol,
  Text,
  TextPath,
  TSpan,
  Use,
  Defs,
  Stop,
};

export default Svg;