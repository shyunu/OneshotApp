import React from 'react';
import {StyleSheet, View, KeyboardAvoidingView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import InventoryWriteHeader from './InventoryWriteHeader';
import InventoryWriteEditor from './InventoryWriteEditor';

function InventoryWriteScreen() {
  return (
    <SafeAreaView style={styles.block}>
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}> */}
      <InventoryWriteHeader />
      <InventoryWriteEditor />
      {/* </KeyboardAvoidingView> */}
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
