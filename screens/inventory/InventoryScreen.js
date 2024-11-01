import React from 'react';
import {StyleSheet, View, Text, Alert} from 'react-native';
import InventoryFloatingWriteButton from './InventoryFloatingWriteButton';
import InventoryList from './InventoryList';
import InventorySearchFrame from './InventorySearchFrame';
import {SafeAreaView} from 'react-native-safe-area-context';

function InventoryScreen() {
  return (
    <View style={styles.block}>
      <InventorySearchFrame />
      <InventoryList />
      <InventoryFloatingWriteButton />
    </View>
  );
}

const styles = StyleSheet.create({
  block: {flex: 1, backgroundColor: '#ffffff'},
});

export default InventoryScreen;
