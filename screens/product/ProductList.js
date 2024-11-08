import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

function ProductList({}) {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatNumber = value => {
    if (!value) return 0;
    return parseInt(value, 10).toLocaleString('ko-KR');
  };

  useEffect(() => {
    const fetchProductList = async () => {
      try {
        const productListResponse = await axios.get(
          `http://172.30.1.17:8181/productApp/productList`,
        );
        console.log('상품목록:', productListResponse.data);
        setProductList(productListResponse.data);
      } catch (error) {
        console.log('목록 조회 오류:', error);
        Alert.alert('오류', '데이터를 가져오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchProductList();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#00569A" />
        <Text>데이터를 로드 중입니다</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.wrapper}>
        {productList.length > 0 ? (
          productList.map(item => (
            <View key={item.productNo}>
              <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoText}>
                    No. <Text style={styles.infoText}>{item.productNo}</Text>
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
                  <Text style={styles.infoText}>총재고수량 </Text>
                  <Text style={styles.infoText}>
                    {formatNumber(item.inventoryQuantity)}개
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoText}>안전재고수량</Text>
                  <Text style={styles.infoText}>
                    {formatNumber(item.safetyQuantity)}개
                  </Text>
                  <Text style={styles.infoText}>판매가격</Text>
                  <Text style={styles.infoText}>
                    {formatNumber(item.productPrice)}원
                  </Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <TouchableOpacity stlye={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>상품 목록이 없습니다</Text>
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
    // justifyContent: 'space-between',
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
});
export default ProductList;
