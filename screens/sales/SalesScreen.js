import React from 'react';
import {StyleSheet, View} from 'react-native';
import SalesFloatingWriteButton from './SalesFloatingWriteButton';

function SalesScreen() {
  return (
    <View style={styles.block}>
      <SalesFloatingWriteButton />
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default SalesScreen;
