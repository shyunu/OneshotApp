import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import InventoryFloatingWriteButton from './InventoryFloatingWriteButton';
import InventoryList from './InventoryList';

function InventoryScreen() {
  return (
    <View style={styles.block}>
      <InventoryList />
      <InventoryFloatingWriteButton />
    </View>
  );
}

const styles = StyleSheet.create({
  block: {flex: 1, backgroundColor: '#ffffff'},
});

export default InventoryScreen;
