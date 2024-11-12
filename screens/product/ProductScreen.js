import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import ProductFloatingWriteButton from './ProductFloatingWirteButton';
import ProductList from './ProductList';
import ProductSearchFrame from './ProductSearchFrame';

function ProductScreen() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [productList, setProductList] = useState([]);

  const handleSearch = keyword => {
    setSearchKeyword(keyword);
  };

  return (
    <View style={styles.block}>
      <ProductSearchFrame onSearch={handleSearch} />
      <ProductList searchKeyword={searchKeyword} />
      <ProductFloatingWriteButton />
    </View>
  );
}

const styles = StyleSheet.create({
  block: {flex: 1, backgroundColor: '#ffffff'},
});

export default ProductScreen;
