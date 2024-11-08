import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import InventoryFloatingWriteButton from './InventoryFloatingWriteButton';
import InventoryList from './InventoryList';
import InventorySearchFrame from './InventorySearchFrame';

function InventoryScreen() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [purchaseList, setPurchaseList] = useState([]); // 구매 목록 상태 추가

  // 검색어 변경 시 호출
  const handleSearch = keyword => {
    setSearchKeyword(keyword);
  };

  return (
    <View style={styles.block}>
      <InventorySearchFrame onSearch={handleSearch} />
      <InventoryList searchKeyword={searchKeyword} />
      <InventoryFloatingWriteButton />
    </View>
  );
}

const styles = StyleSheet.create({
  block: {flex: 1, backgroundColor: '#ffffff'},
});

export default InventoryScreen;
