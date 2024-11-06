import React from 'react';
import {StyleSheet, View} from 'react-native';
import ProductFloatingWriteButton from './ProductFloatingWirteButton';
import ProductList from './ProductList';
import ProductSearchFrame from './ProductSearchFrame';

function ProductScreen() {
  return (
    <View style={styles.block}>
      <ProductSearchFrame />
      <ProductList />
      <ProductFloatingWriteButton />
    </View>
  );
}

const styles = StyleSheet.create({
  block: {flex: 1, backgroundColor: '#ffffff'},
});

export default ProductScreen;
