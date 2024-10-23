import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import ContractFloatingWriteButton from './ContractFloatingWriteButton';

function ContractScreen() {
  return (
    <View style={styles.block}>
      <ContractFloatingWriteButton />
    </View>
  );
}

const styles = StyleSheet.create({
  block: {flex: 1, backgroundColor: '#ffffff'},
});

export default ContractScreen;
