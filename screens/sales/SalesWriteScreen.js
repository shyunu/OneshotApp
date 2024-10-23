import React from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import SalesWriteEditor from './SalesWriteEditor';
import SalesWriteHeader from './SalesWriteHeader';

function SalesWriteScreen() {
  return (
    <SafeAreaView style={styles.block}>
      <SalesWriteHeader />
      <SalesWriteEditor />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  block: {flex: 1, backgroundColor: 'white'},
});

export default SalesWriteScreen;
