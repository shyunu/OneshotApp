import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SalesFloatingWriteButton from './SalesFloatingWriteButton';
import SalesList from './SalesList';

function SalesScreen() {
  

  return (
    <SafeAreaView style={styles.block}>
      <SalesList />
      <SalesFloatingWriteButton />
    </SafeAreaView>
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
