import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import axios from 'axios';
import {launchImageLibrary} from 'react-native-image-picker';

function ProductDetail({isVisible, onClose, productNo}) {
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isVisible && productNo) {
      fetchData();
    }
  }, [isVisible, productNo]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://192.168.0.10:8181/productApp/displayImg/${productNo}`,
      );
      if (response.data && response.data.imageData) {
        const base64Image = `data:image/jpeg;base64,${response.data.imageData}`;
        setImageData(base64Image);
      } else {
        console.log('이미지 데이터가 없습니다.');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>상품 상세</Text>
          {imageData ? (
            <Image
              source={{uri: imageData}}
              style={{width: 300, height: 300}}
            />
          ) : (
            <Text>등록된 이미지가 없습니다</Text>
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

export default ProductDetail;
