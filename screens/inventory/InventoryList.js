import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

function InventoryList() {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.text}>안녕?</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  text: {
    borderColor: '#e3e3e3',
    borderWidth: 1,
    marginHorizontal: 16,
    marginTop: 16,
  },
});

export default InventoryList;
