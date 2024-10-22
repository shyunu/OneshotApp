import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import FloatingWriteButton from './ContractFloatingWriteButton';

function ContractScreen() {
  return (
    <View style={styles.block}>
      <FloatingWriteButton />
    </View>
  );
}

const styles = StyleSheet.create({
  block: {flex: 1, backgroundColor: '#ffffff'},
});

export default ContractScreen;
