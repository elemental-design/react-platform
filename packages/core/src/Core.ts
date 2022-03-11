import * as Platform from './modules/Platform';

interface API {
  StyleSheet: any,
  View: any,
  Text: any,
  Image: any,
  Touchable: any,
  Easing: any,
  Animated: any,
  Dimensions: any,
  Platform: any,
};

const Core: {
  StyleSheet: any,
  View: any,
  Text: any,
  Image: any,
  Touchable: any,
  Easing: any,
  Animated: any,
  Dimensions: any,
  PixelRatio: any,
  Platform: any,
  inject: (api: API) => void,
} = {
  StyleSheet: null,
  View: null,
  Text: null,
  Image: null,
  Touchable: null,
  Easing: null,
  Animated: null,
  Dimensions: null,
  // PixelRatio: require('./modules/PixelRatio'),
  PixelRatio: null,
  Platform,
  inject: (api: API) => {
    if (api.StyleSheet) {
      Core.StyleSheet = api.StyleSheet;
    }
    if (api.View) {
      Core.View = api.View;
    }
    if (api.Text) {
      Core.Text = api.Text;
    }
    if (api.Image) {
      Core.Image = api.Image;
    }
    if (api.Touchable) {
      Core.Touchable = api.Touchable;
    }
    if (api.Easing) {
      Core.Easing = api.Easing;
    }
    if (api.Animated) {
      Core.Animated = api.Animated;
    }
    if (api.Dimensions) {
      Core.Dimensions = api.Dimensions;
    }
    if (api.Platform) {
      Core.Platform.inject(api.Platform);
    }
  },
};

export = Core;
