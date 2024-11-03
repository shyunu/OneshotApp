import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import SalesSearchFrame from './SalesSearchFrame';
import SalesFloatingWriteButton from './SalesFloatingWriteButton';
import SalesList from './SalesList';

function SalesScreen() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filteredKeyword, setFilteredKeyword] = useState('');

  function onSearch() {
    setFilteredKeyword(searchKeyword);
  }
  return (
    <View style={styles.block}>
      <SalesSearchFrame
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        onSearch={onSearch}
      />
      <SalesList searchKeyword={filteredKeyword} />
      <SalesFloatingWriteButton />
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: 16,
    paddingRight: 16,
  },
});

export default SalesScreen;
