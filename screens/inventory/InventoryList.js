import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

function InventoryList() {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.block}>
        <Text style={styles.text}>카테고리</Text>
        <Text style={styles.text}>공급업체명</Text>
        <Text style={styles.text}>상품명</Text>
        {/* <Text style={styles.text}>총재고수량</Text>
        <Text style={styles.text}>안전재고수량</Text> */}
        <Text style={styles.text}>판매가격</Text>
        <Text style={styles.text}>판매중</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  block: {
    borderColor: '#e3e3e3',
    borderWidth: 1,
    marginHorizontal: 16,
    marginTop: 16,
    height: 100,
  },
  text: {},
});

export default InventoryList;
