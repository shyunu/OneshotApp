import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import React, {useState, useEffect, useCallback} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import ProductDetail from './ProductDetail';

function ProductList({searchKeyword}) {
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductNo, setSelectedProductNo] = useState(null); // 선택된 상품의 ID

  // 초기 로딩 여부 확인
  const [hasFetched, setHasFetched] = useState(false);

  const formatNumber = value => {
    if (!value) return 0;
    return parseInt(value, 10).toLocaleString('ko-KR');
  };

  const fetchProductList = async searchKeyword => {
    try {
      const productListResponse = await axios.get(
        // `http://192.168.0.10:8181/productApp/productList`,
        `http://localhost:8181/productApp/productList`,
        {
          params: {searchKeyword},
        },
        console.log('검색: ', searchKeyword),
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

  // useFocusEffect(
  //   useCallback(() => {
  //     if (!hasFetched || searchKeyword) {
  //       fetchProductList();
  //       setHasFetched(true);
  //     }
  //   }, [searchKeyword]),
  // );

  useFocusEffect(
    useCallback(() => {
      fetchProductList(searchKeyword);
    }, [searchKeyword]),
  );

  function onSearch(searchKeyword) {
    setSearchKeyword(searchKeyword);
    fetchProductList(searchKeyword);
  }

  const openModal = product => {
    setSelectedProductNo(product);
    setModalIsVisible(true);
  };

  const closeModal = () => {
    setModalIsVisible(false);
  };

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
                  <TouchableOpacity
                    onPress={() => openModal(item.productNo)} // 클릭 시 해당 상품 번호를 전달
                  >
                    <Text style={styles.infoFileText}>이미지 보기</Text>
                  </TouchableOpacity>
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
          <TouchableOpacity style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>상품 목록이 없습니다</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {modalIsVisible && (
        <ProductDetail
          isVisible={modalIsVisible}
          onClose={closeModal}
          productNo={selectedProductNo}
          style={styles.modalContainer}
        />
      )}
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
  infoFileText: {
    fontSize: 13,
    color: '#333',
    flex: 1,
    textAlign: 'left',
    textDecorationLine: 'underline',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
});
export default ProductList;
