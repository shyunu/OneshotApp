import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Modal} from 'react-native';
import axios from 'axios';

function ContractDetail({isVisible, onClose, contractPriceNo}) {
  const [imageData, setImageData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        // `http://172.30.1.28:8181/contractApp/getContractFile/${contractPriceNo}`,
        `http://192.168.0.10:8181/contractApp/getContractFile/${contractPriceNo}`,
      );
      if (response.data) {
        const base64Image = `data:image/jpeg;base64,${response.data}`;
        setImageData(base64Image);
      } else {
        console.log('이미지 데이터가 비어 있습니다.');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchData();
    }
  }, [isVisible]);

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>계약 상세</Text>
          {imageData ? (
            <Image
              source={{uri: imageData}}
              style={{width: 300, height: 300}}
            />
          ) : (
            <Text>등록된 계약서가 없습니다</Text>
          )}
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={onClose}>
              <Text style={styles.modalButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 4,
    fontSize: 16,
    letterSpacing: 5,
  },
  confirmButton: {
    backgroundColor: '#00569A',
    TouchableOpacity: 0.8,
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ContractDetail;
