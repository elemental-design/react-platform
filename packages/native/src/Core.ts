type ModuleName = 'AccessibilityInfo' | 'ActivityIndicator' | 'Button' | 'DatePickerIOS' | 'DrawerLayoutAndroid' | 'FlatList' | 'Image' | 'ImageBackground' | 'InputAccessoryView' | 'KeyboardAvoidingView' | 'MaskedViewIOS' | 'Modal' | 'Picker' | 'PickerIOS' | 'Pressable' | 'ProgressBarAndroid' | 'ProgressViewIOS' | 'SafeAreaView' | 'ScrollView' | 'SectionList' | 'SegmentedControlIOS' | 'Slider' | 'Switch' | 'RefreshControl' | 'StatusBar' | 'Text' | 'TextInput' | 'Touchable' | 'TouchableHighlight' | 'TouchableNativeFeedback' | 'TouchableOpacity' | 'TouchableWithoutFeedback' | 'View' | 'VirtualizedList' | 'VirtualizedSectionList' | 'ActionSheetIOS' | 'Alert' | 'Animated' | 'Appearance' | 'AppRegistry' | 'AppState' | 'AsyncStorage' | 'BackHandler' | 'Clipboard' | 'DatePickerAndroid' | 'DeviceInfo' | 'DevSettings' | 'Dimensions' | 'Easing' | 'findNodeHandle' | 'I18nManager' | 'ImagePickerIOS' | 'InteractionManager' | 'Keyboard' | 'LayoutAnimation' | 'Linking' | 'LogBox' | 'NativeDialogManagerAndroid' | 'NativeEventEmitter' | 'Networking' | 'PanResponder' | 'PermissionsAndroid' | 'PixelRatio' | 'PushNotificationIOS' | 'Settings' | 'Share' | 'StatusBarIOS' | 'StyleSheet' | 'Systrace' | 'ToastAndroid' | 'TurboModuleRegistry' | 'TVEventHandler' | 'UIManager' | 'unstable_batchedUpdates' | 'useColorScheme' | 'useWindowDimensions' | 'UTFSequence' | 'Vibration' | 'YellowBox' | 'DeviceEventEmitter' | 'NativeAppEventEmitter' | 'NativeModules' | 'Platform' | 'processColor' | 'PlatformColor' | 'DynamicColorIOS' | 'requireNativeComponent' | 'unstable_RootTagContext' | 'unstable_enableLogBox' | 'ColorPropType' | 'EdgeInsetsPropType' | 'PointPropType' | 'ViewPropTypes';

type Modules = {
  [key in ModuleName]?: any;
};

interface CoreType extends Modules {
  inject: (api: Modules) => void,
};

import KeyboardAvoidingView from './modules/KeyboardAvoidingView';
import ScrollView from './modules/ScrollView';
import SafeAreaView from './modules/SafeAreaView';
import AccessibilityInfo from './modules/AccessibilityInfo';
import Button from './modules/Button';
import FlatList from './modules/FlatList';
import ActivityIndicator from './modules/ActivityIndicator';

const Core: CoreType = {
  // React Native API – https://github.com/facebook/react-native/blob/6de3fffc37af9b301b669ba183a7910bcc432b6e/index.js
  AccessibilityInfo,
  ActivityIndicator,
  Button,
  DatePickerIOS: null,
  DrawerLayoutAndroid: null,
  FlatList,
  Image: null,
  ImageBackground: null,
  InputAccessoryView: null,
  KeyboardAvoidingView,
  MaskedViewIOS: null,
  Modal: null,
  Picker: null,
  PickerIOS: null,
  Pressable: null,
  ProgressBarAndroid: null,
  ProgressViewIOS: null,
  SafeAreaView,
  ScrollView,
  SectionList: null,
  SegmentedControlIOS: null,
  Slider: null,
  Switch: null,
  RefreshControl: null,
  StatusBar: null,
  Text: null,
  TextInput: null,
  Touchable: null,
  TouchableHighlight: null,
  TouchableNativeFeedback: null,
  TouchableOpacity: null,
  TouchableWithoutFeedback: null,
  View: null,
  VirtualizedList: null,
  VirtualizedSectionList: null,
  ActionSheetIOS: null,
  Alert: null,
  Animated: null,
  Appearance: null,
  AppRegistry: null,
  AppState: null,
  AsyncStorage: null,
  BackHandler: null,
  Clipboard: null,
  DatePickerAndroid: null,
  DeviceInfo: null,
  DevSettings: null,
  Dimensions: null,
  Easing: null,
  findNodeHandle: null,
  I18nManager: null,
  ImagePickerIOS: null,
  InteractionManager: null,
  Keyboard: null,
  LayoutAnimation: null,
  Linking: null,
  LogBox: null,
  NativeDialogManagerAndroid: null,
  NativeEventEmitter: null,
  Networking: null,
  PanResponder: null,
  PermissionsAndroid: null,
  PushNotificationIOS: null,
  Settings: null,
  Share: null,
  StatusBarIOS: null,
  StyleSheet: null,
  Systrace: null,
  ToastAndroid: null,
  TurboModuleRegistry: null,
  TVEventHandler: null,
  UIManager: null,
  unstable_batchedUpdates: null,
  useColorScheme: null,
  useWindowDimensions: null,
  UTFSequence: null,
  Vibration: null,
  YellowBox: null,
  DeviceEventEmitter: null,
  NativeAppEventEmitter: null,
  NativeModules: null,
  processColor: null,
  PlatformColor: null,
  DynamicColorIOS: null,
  requireNativeComponent: null,
  unstable_RootTagContext: null,
  unstable_enableLogBox: null,
  ColorPropType: null,
  EdgeInsetsPropType: null,
  PointPropType: null,
  ViewPropTypes: null,

  PixelRatio: require('./modules/PixelRatio'),
  Platform: require('@react-platform/core').Platform,

  inject: (api: Modules) => {

    if (api.Platform) {
      Core.Platform.inject(api.Platform);
    }
    // @ts-ignore
    Object.keys(api).forEach((nativeModule: keyof Modules) => {
      Core[nativeModule] = api[nativeModule];
    })
  },
};

export = Core;

