import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import SalesSearchFrame from './SalesSearchFrame';

function SalesList() {
import React, {useState, useEffect} from 'react';
import {Text, StyleSheet, View, TouchableOpacity, FlatList} from 'react-native';
import SalesSearchFrame from './SalesSearchFrame';
import SalesDetail from './SalesDetail';
import axios from 'axios';

function SalesList() {
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [orderList, setOrderList] = useState([]); // 주문 데이터
  const [selectedOrder, setSelectedOrder] = useState(null); //선택한 주문건

  useEffect(() => {
    fetchOrderList();
  }, []);

  const fetchOrderList = () => {
    axios
      .get('http://localhost:8181/salesApp/order')
      .then(response => {
        setOrderList(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching order data:', error);
      });
  };

  function startAddItem() {
    setModalIsVisible(true);
  }

  function endAddItem() {
    setModalIsVisible(false);
  }

  // 날짜포맷
  const formatDate = orderSdate => {
    const date = new Date(orderSdate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  //원화 + 천원단위(,)
  const formatCurrency = totalAmount => {
    const amount = totalAmount || 0;
    return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원`;
  };

  // 렌더링할 아이템 구성
  const renderItem = ({item}) => (
    <TouchableOpacity
      key={item.ORDER_HEADER_NO}
      style={styles.infoContainer}
      onPress={() => {
        setSelectedOrder(item);
        startAddItem();
      }}>
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>
          no. <Text style={styles.dataText}>{item.orderHeaderNo}</Text>
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>
          판매등록일자:{' '}
          <Text style={styles.dataText}>{formatDate(item.orderSdate)}</Text>
        </Text>
        <Text style={styles.infoText}>
          판매담당자명: <Text style={styles.dataText}>{item.employeeName}</Text>
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>
          고객사명: <Text style={styles.dataText}>{item.clientName}</Text>
        </Text>
        <Text style={styles.infoText}>
          총거래가:{' '}
          <Text style={styles.dataText}>
            {formatCurrency(item.totalAmount)}
          </Text>
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>
          상품리스트: <Text style={styles.dataText}>{item.productNames}</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.wrapper}>


      <FlatList
        data={orderList}
        renderItem={renderItem}
        keyExtractor={item => item.orderHeaderNo.toString()}
        contentContainerStyle={styles.listContent}
        style={styles.listWrap}
      />

      {modalIsVisible && (
        <SalesDetail
          isVisible={modalIsVisible}
          onClose={endAddItem}
          selectedOrder={selectedOrder}
          style={styles.modalContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    // marginTop: 10,
  },
  listContent: {
    // top: 5,
  },
  listWrap: {
    // 스크롤했을 때 리스트가 검색란에 가려지는 부분 방지용으로 margin했음
    // marginTop: 15,
  },
  infoContainer: {
    borderColor: '#e3e3e3',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e3',
  },
  infoText: {
    fontSize: 13,
    color: '#333',
    flex: 1,
    textAlign: 'left',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  dataText: {
    fontWeight: 'bold', // 데이터 텍스트를 강조
    color: '#333', // 텍스트 색상
  },
});

export default SalesList;
