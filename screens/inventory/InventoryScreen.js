import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, View, Text, Alert} from 'react-native';
import InventoryFloatingWriteButton from './InventoryFloatingWriteButton';
import InventoryList from './InventoryList';
import axios from 'axios';

function InventoryScreen() {
  const navigation = useNavigation();

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
