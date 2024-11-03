import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import axios from 'axios';

function SalesDetail({ isVisible, onClose, selectedOrder }) {
  const [orderItems, setOrderItems] = useState([]); // 상품 상세 정보 저장
  const [disable, setDisabled] = useState(false); // textinput disabled 처리

  useEffect(() => {
    if (selectedOrder) {
      fetchOrderItems(selectedOrder.orderHeaderNo);
    }
  }, [selectedOrder]);

  const fetchOrderItems = async orderHeaderNo => {
    try {
      const response = await axios.get(
        `http://localhost:8181/salesApp/items/${orderHeaderNo}`
      );
      setOrderItems(response.data);
    } catch (error) {
      console.error('Error fetching order items:', error);
    }
  };

  // 원화 + 천원단위(,)
  const formatCurrency = value => {
    const formatValue = value || 0;
    return `${formatValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원`;
  };

  // 상품 리스트 아이템 렌더링
  const renderOrderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.contentText}>{item.productName}</Text>
      <Text style={[styles.contentText, styles.priceText]}>{formatCurrency(item.contractPrice)}</Text>
      <Text style={[styles.contentText, styles.quantityText]}>{item.productQuantity}</Text>
      <Text style={[styles.contentText, styles.amountText]}>{formatCurrency(item.amount)}</Text>
    </View>
  );

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
          <TextInput
            value={selectedOrder ? selectedOrder.clientName : ''}
            editable={false}
            style={styles.input}
          />

          <Text style={styles.text}>상품리스트</Text>
          <View style={styles.salesItemContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.headerText}>상품명</Text>
              <Text style={styles.headerText}>가격</Text>
              <Text style={styles.headerText}>개수</Text>
              <Text style={styles.headerText}>금액</Text>
            </View>

            {/* 상품 상세 정보 리스트 */}
            <FlatList
              data={orderItems}
              renderItem={renderOrderItem}
              keyExtractor={item => item.productNo.toString()}
            />
          </View>

          <View style={styles.amountWrap}>
            <Text style={{ marginLeft: 15, letterSpacing: 5 }}>합계</Text>
            <TextInput
              style={styles.amount}
              editable={false}
              value={selectedOrder ? formatCurrency(selectedOrder.totalAmount) : ''}
            />
          </View>

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
    textAlign: 'left',
    padding: 10,
    height: 40,
  },
  priceText: {
    left: 7,
  },
  quantityText: {
    left: 22,
  },
  amountText: {
    right: 5,
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
  input: {
    height: 40,
    borderColor: '#ced4da',
    borderWidth: 1,
    color: '#000',
    marginBottom: 15,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  amountWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    height: 40,
  },
  amount: {
    height: 30,
    width: 100,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: '#fff',
    fontSize: 14,
    color: '#495057',
    textAlign: 'right',
    paddingRight: 8,
    fontWeight: 'bold',
    marginLeft: 150,
  },
});

export default SalesDetail;