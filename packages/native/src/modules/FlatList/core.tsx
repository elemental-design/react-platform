/*
 * This file contains source-code copied from https://github.com/facebook/react-native/blob/master/Libraries/Components/Button.js
 * React Native's source code is licensed under the MIT license: https://github.com/facebook/react-native/blob/master/LICENSE
*/
import * as React from 'react';
import { View, StyleSheet } from '@react-platform/core';

const FlatList = ({
  ListItemComponent,
  renderItem,
  columnWrapperStyle,
  items,
 }: any) => {

  const renderer = React.useCallback((props: any): React.ReactNode => {
    if (ListItemComponent) {
      // $FlowFixMe Component isn't valid
      return <ListItemComponent {...props} />;
    } else if (renderItem) {
      return renderItem(props);
    } else {
      return null;
    }
  }, [ListItemComponent, renderItem]);

  return (
    <View style={StyleSheet.compose(styles.row, columnWrapperStyle)}>
      {items.map((item: any, index: number) => {
        const element = renderer({
          item,
          index,
          // index: index * numColumns + kk,
          // separators: info.separators,
        });
        return element != null ? (
          <React.Fragment key={index}>{element}</React.Fragment>
        ) : null;
      })}
    </View>
  )
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row'
  }
});

export default FlatList;
