import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import ContractSearchFrame from './ContractSearchFrame';
import ContractList from './ContractList';
import ContractFloatingWriteButton from './ContractFloatingWriteButton';

function ContractScreen() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const onSearch = () => {
    setSearch(searchInput);
    console.log(`검색 실행: ${searchInput}`);
  };

  return (
    <View style={styles.block}>
      <ContractSearchFrame
        search={searchInput}
        setSearch={setSearchInput}
        onSearch={onSearch}
      />
      <ContractList search={search} />
      <ContractFloatingWriteButton />
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingLeft: 16,
    paddingRight: 16,
  },
});

export default ContractScreen;
