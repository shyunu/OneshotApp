import React, {useEffect, useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
// import {RefreshControl} from 'react-native';

function InventoryList({searchKeyword}) {
  const [purchaseList, setPurchaseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 천단위 콤마
  const formatNumber = value => {
    if (!value) return '0';
    return parseInt(value, 10).toLocaleString('ko-KR');
  };

  // 구매 목록 조회
  const fetchPurchaseList = async () => {
    try {
      const purchaseListResponse = await axios.get(
        // `http://192.168.0.10:8181/inventoryApp/purchaseList`,
        'http://localhost:8181/inventoryApp/purchaseList',
        {
          params: {searchKeyword},
          // amount: 10,
        },
        console.log('searchKeyword: ', searchKeyword),
      );
      console.log('목록: ', purchaseListResponse.data);
      setPurchaseList(purchaseListResponse.data);
    } catch (error) {
      console.log('목록 조회 오류: ', error);
      Alert.alert('오류', '데이터를 가져오지 못했습니다');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPurchaseList();
    }, [fetchPurchaseList]),
  );

  // 초기 로딩 및 검색어 변경 시 목록 조회
  useEffect(() => {
    fetchPurchaseList();
  }, [searchKeyword]);

  // 새로고침
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchPurchaseList(searchKeyword).then(() => setRefreshing(false));
  }, [searchKeyword]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#00569A" />
        <Text>데이터를 로드 중입니다</Text>
      </View>
    );
  }

  return (
    <ScrollView
    // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.wrapper}>
        {purchaseList.length > 0 ? (
          purchaseList.map(item => (
            <View key={item.purchaseNo} style={styles.purchaseItem}>
              <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoText}>
                    No. <Text style={styles.infoText}>{item.purchaseNo}</Text>
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoText}>공급업체명</Text>
                  <Text style={styles.infoText}>{item.supplierName}</Text>
                  <Text style={styles.infoText}>카테고리</Text>
                  <Text style={styles.infoText}>{item.categoryName}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoText}>상품명</Text>
                  <Text style={styles.infoText}>{item.productName}</Text>

                  <Text style={styles.infoText}>구매수량</Text>
                  <Text style={styles.infoText}>
                    {formatNumber(item.purchaseQuantity)}개
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoText}>구매단가</Text>
                  <Text style={styles.infoText}>
                    {formatNumber(item.purchasePrice)}원
                  </Text>
                  <Text style={styles.infoText}>총가격</Text>
                  <Text style={styles.infoText}>
                    {formatNumber(item.purchasePrice * item.purchaseQuantity)}원
                  </Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <TouchableOpacity style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>구매내역이 없습니다</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginTop: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    borderColor: '#e3e3e3',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginHorizontal: 16,
    marginTop: 10,
    bottom: 20,
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
  // dataText: {
  //   fontSize: 13,
  //   color: '#333',
  //   textAlign: 'left',
  //   right: 15,
  //   width: '45%',
  // },
});

export default InventoryList;
