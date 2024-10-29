import React from 'react';
import {Modal} from 'react-native';

function SalesDetail() {
  return (
    <Modal style={styles.block}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}></View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
})

export default SalesDetail;
