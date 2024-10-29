import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Modal} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

function SalesDetail({isVisible, onClose}) {
  const [disable, setDisabled] = useState(false); //textinput disabled처리

  //원화 + 천원단위(,)
  const formatCurrency = amount => {
    return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원`;
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>판매 상세</Text>
          <Text style={styles.text}>고객사명</Text>
          <TextInput editable={false} style={styles.input} />

          <Text style={styles.text}>상품리스트</Text>
          <View style={styles.salesItemContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.headerText}>상품명</Text>
              <Text style={styles.headerText}>가격</Text>
              <Text style={styles.headerText}>개수</Text>
              <Text style={styles.headerText}>금액</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.contentText}></Text>
              <Text style={styles.contentText}></Text>
              <Text style={styles.contentText}></Text>
              <Text style={styles.contentText}></Text>
            </View>
          </View>

          <View style={styles.amountWrap}>
            <Text style={{marginLeft: 25, letterSpacing: 5}}>합계</Text>
            <TextInput style={styles.amount} editable={false}></TextInput>
          </View>

          <View style={styles.modalButtons}>
            {/* <TouchableOpacity style={[styles.modalButton, styles.cancelButton]}>
              <Text style={styles.modalButtonText}>취소</Text>
            </TouchableOpacity> */}
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
  text: {
    marginBottom: 8,
    fontSize: 16,
    color: '#000',
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#ced4da',
  },
  headerText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#ced4da',
    borderBottomWidth: 1,
  },
  contentText: {
    flex: 1,
    textAlign: 'center',
    padding: 10,
    height: 40,
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
  cancelButton: {
    backgroundColor: '#d0d6e3',
    TouchableOpacity: 0.8,
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
  input: {
    height: 40,
    borderColor: '#ced4da',
    borderWidth: 1,
    color: '#000',
    marginBottom: 15,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
    overflow: Platform.select({android: 'hidden'}),
    zIndex: 1,
  },
  amountWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#ced4da',
  },
  amount: {
    height: 30,
    width: 100,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#495057',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
    marginLeft: 140,
    textAlign: 'right',
    paddingRight: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SalesDetail;
