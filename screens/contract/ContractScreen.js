import React from 'react';
import {StyleSheet, View} from 'react-native';
import ContractSearchFrame from './ContractSearchFrame';
import ContractList from './ContractList';
import ContractFloatingWriteButton from './ContractFloatingWriteButton';

function ContractScreen() {
  return (
    <View style={styles.block}>
      <ContractSearchFrame />
      <ContractList />
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
