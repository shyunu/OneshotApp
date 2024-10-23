import React from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import ContractWriteEditor from './ContractWriteEditor';
import ContractWriteHeader from './ContractWriteHeader';

function ContractWriteScreen() {
  return (
    <SafeAreaView style={styles.block}>
      <ContractWriteHeader />
      <ContractWriteEditor />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  block: {flex: 1, backgroundColor: 'white'},
});

export default ContractWriteScreen;
