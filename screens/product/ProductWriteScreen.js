import React from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import ProductWriteHeader from './ProductWriteHeader';
import ProductWriteEditor from './ProductWriteEditor';

function ProductWriteScreen() {
  return (
    <SafeAreaView style={styles.block}>
      <ProductWriteHeader />
      <ProductWriteEditor />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default ProductWriteScreen;
