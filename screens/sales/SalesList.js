import React, {useState, useEffect} from 'react';
import {Text, StyleSheet, View, TouchableOpacity, FlatList} from 'react-native';
import SalesSearchFrame from './SalesSearchFrame';
import SalesDetail from './SalesDetail';
import axios from 'axios';

function SalesList({searchKeyword}) {
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [orderList, setOrderList] = useState([]); // 주문 데이터
  const [selectedOrder, setSelectedOrder] = useState(null); //선택한 주문건
  const [filteredOrderList, setFilteredOrderList] = useState([]);

  useEffect(() => {
    fetchOrderList();
  }, []);

  useEffect(() => {
    setFilteredOrderList(
      orderList.filter(order => {
        const lowerCaseKeyword = searchKeyword.toLowerCase();
        return (
          order.clientName.toLowerCase().includes(lowerCaseKeyword) ||
          order.employeeName.toLowerCase().includes(lowerCaseKeyword) ||
          order.productNames.toLowerCase().includes(lowerCaseKeyword)
        );
      }),
    );
  }, [searchKeyword, orderList]);

  const fetchOrderList = () => {
    axios
      .get('http://localhost:8181/salesApp/order')
      .then(response => {
        setOrderList(response.data);
        setFilteredOrderList(response.data); // 초기 목록 설정
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
        <Text style={styles.infoText}>No.</Text>
        <Text style={[styles.dataText, {right: 145}]}>
          {item.orderHeaderNo}
        </Text>
      </View>
      <View style={styles.infoRow}>
        <View style={styles.infoColumn}>
          <Text style={styles.infoText}>판매등록일자</Text>
          <Text style={styles.dataText}>{formatDate(item.orderSdate)}</Text>
        </View>
        <View style={styles.infoColumn}>
          <Text style={styles.infoText}>판매담당자명</Text>
          <Text style={styles.dataText}>{item.employeeName}</Text>
        </View>
      </View>
      <View style={styles.infoRow}>
        <View style={styles.infoColumn}>
          <Text style={styles.infoText}>고객사명</Text>
          <Text style={styles.dataText}>{item.clientName}</Text>
        </View>
        <View style={styles.infoColumn}>
          <Text style={styles.infoText}>총거래가</Text>
          <Text style={styles.dataText}>
            {formatCurrency(item.totalAmount)}
          </Text>
        </View>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>상품리스트</Text>
        <Text style={[styles.dataText, {right: 90}]}>{item.productNames}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={filteredOrderList}
        renderItem={renderItem}
        keyExtractor={item => item.orderHeaderNo.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <TouchableOpacity style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>판매내역이 없습니다</Text>
            </View>
          </TouchableOpacity>
        }
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
    bottom: 10,
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
    //justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e3',
  },
  infoColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '50%',
  },
  infoText: {
    fontSize: 13,
    color: '#333',
    // flex: 0.8,
    textAlign: 'left',
    width: '50%',
  },
  dataText: {
    fontSize: 13,
    color: '#333',
    textAlign: 'left',
    right: 15,
    width: '45%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
});

export default SalesList;
