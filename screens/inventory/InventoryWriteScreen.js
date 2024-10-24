import React from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import InventoryWriteHeader from './InventoryWriteHeader';
import InventoryWriteEditor from './InventoryWriteEditor';

function InventoryWriteScreen() {
  return (
    <SafeAreaView style={styles.block}>
      <InventoryWriteHeader />
      <InventoryWriteEditor />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default InventoryWriteScreen;
