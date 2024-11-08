import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';

function InventoryItem({modalVisible, closeModal, addItem, supplierNo}) {
  const [items, setItems] = useState([]); // 구매 상품

  // 공급업체
  const [openSupplier, setOpenSupplier] = useState(false);
  // const [valueSupplier, setValueSupplier] = useState(null);
  const [valueSupplier, setValueSupplier] = useState(supplierNo); // supplierNo를 초기값으로 설정
  const [supplierItems, setSupplierItems] = useState([]);

  // 카테고리
  const [openCategory, setOpenCategory] = useState(false);
  const [valueCategory, setValueCategory] = useState(null);
  const [categoryItems, setCategoryItems] = useState([]);

  // 상품
  const [openProduct, setOpenProduct] = useState(false);
  const [valueProduct, setValueProduct] = useState(null);
  const [productItems, setProductItems] = useState([]);

  // 가격과 수량
  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchaseQuantity, setPurchaseQuantity] = useState('');
  const [subTotal, setSubTotal] = useState('');

  // 화면 표시용
  const [displayPrice, setDisplayPrice] = useState('');
  const [displayQuantity, setDisplayQuantity] = useState('');
  const [displaySubTotal, setDisplaySubTotal] = useState('');

  // supplierNo가 있을 때 카테고리 데이터 불러오기
  const fetchCategories = async supplierNo => {
    if (!supplierNo) return; // supplierNo가 없으면 실행X
    try {
      const categoryResponse = await axios.get(
        // `http://192.168.0.10:8181/inventoryApp/getCategories?supplierNo=${supplierNo}`,
        `http://localhost:8181/inventoryApp/getCategories?supplierNo=${supplierNo}`,
      );
      setCategoryItems(
        categoryResponse.data.map(category => ({
          label: category.categoryName,
          value: category.categoryNo,
        })),
      );
      console.log('카테고리:', categoryResponse.data);
    } catch (error) {
      console.error('카테고리 로드 오류: ', error);
      Alert.alert('Error', '카테고리 로드 실패');
    }
  };

  // 해당 supplierNo로 카테고리 호출
  useEffect(() => {
    if (supplierNo) {
      fetchCategories(supplierNo); // supplierNo가 변경될 때마다 카테고리 로드
    }
  }, [supplierNo]);

  // 카테고리별 상품 드롭다운
  const fetchProducts = async () => {
    if (!valueCategory) return;
    try {
      const productResponse = await axios.get(
        // `http://192.168.0.10:8181/inventoryApp/getProductsByCategory?categoryNo=${valueCategory}`,
        `http://localhost:8181/inventoryApp/getProductsByCategory?categoryNo=${valueCategory}`,
      );
      const productItems = productResponse.data.map(product => ({
        label: product.productName,
        value: product.productNo,
      }));
      setProductItems(productItems);
    } catch (error) {
      console.log('상품 로드 오류: ', error);
      Alert.alert('Error', '상품 로드 실패');
    }
  };

  useEffect(() => {
    if (valueCategory) {
      fetchProducts(valueCategory);
    }
  }, [valueCategory]);

  // 천단위 콤마
  const formatNumber = value => {
    if (!value) return '';
    return parseInt(value, 10).toLocaleString('ko-KR');
  };

  // 원, 개
  const handleInputChange = (type, value) => {
    const formatValue = value.replace(/[^0-9]/g, '');
    if (type === 'purchaseQuantity') {
      setPurchaseQuantity(formatValue);
      setDisplayQuantity(formatValue ? formatNumber(formatValue) + '개' : '');
    } else if (type === 'purchasePrice') {
      setPurchasePrice(formatValue);
      setDisplayPrice(formatValue ? formatNumber(formatValue) + '원' : '');
    }
  };

  // 소계
  useEffect(() => {
    if (purchasePrice && purchaseQuantity) {
      setSubTotal(
        (parseFloat(purchasePrice) * parseInt(purchaseQuantity)).toFixed(2),
      );
    } else {
      setSubTotal('');
    }
  }, [purchasePrice, purchaseQuantity]);

  // 상품 추가
  const handleAddItem = () => {
    if (valueCategory && valueProduct && purchaseQuantity && purchasePrice) {
      const newItem = {
        category: categoryItems.find(c => c.value === valueCategory)?.label,
        product: productItems.find(p => p.value === valueProduct)?.label,
        productNo: valueProduct,
        purchaseQuantity: purchaseQuantity.replace(/[^0-9]/g, ''),
        purchasePrice: purchasePrice.replace(/[^0-9]/g, ''),
        displayQuantity: purchaseQuantity + '개',
        displayPrice: purchasePrice + '원',
        displaySubTotal: formatNumber(subTotal) + '원',
      };
      console.log(addItem);
      addItem(newItem);
      resetModal();
      closeModal();
    } else {
      Alert.alert('Warning', '모든 필드를 입력해주세요.');
    }
  };

  // 모달창 리셋
  function resetModal() {
    setValueCategory(null);
    setValueProduct(null);
    setPurchaseQuantity('');
    setPurchasePrice('');
    setDisplayPrice('');
    setDisplayQuantity('');
    setSubTotal('');
  }

  return (
    // {/* 모달팝업 */}
    <Modal
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}>
      <View style={styles.modalContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
          {/* 안드보다 아이폰에 offset을 줘야 버튼 바가 가려지지 않음 */}
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>상품 추가</Text>

            <Text style={styles.text}>카테고리</Text>
            <DropDownPicker
              open={openCategory}
              value={valueCategory}
              items={categoryItems}
              setOpen={setOpenCategory}
              setValue={setValueCategory}
              setItems={setCategoryItems}
              style={styles.dropdown}
              placeholder="카테고리를 선택하세요"
              zIndex={300}
              dropDownContainerStyle={styles.dropdownContainer}
            />

            <Text style={styles.text}>상품명</Text>
            <DropDownPicker
              open={openProduct}
              value={valueProduct}
              items={productItems}
              setOpen={setOpenProduct}
              setValue={setValueProduct}
              setItems={setProductItems}
              zIndex={200}
              style={styles.dropdown}
              placeholder="상품을 선택하세요"
              dropDownContainerStyle={styles.dropdownContainer}
            />

            <Text style={styles.text}>구매수량</Text>
            <TextInput
              placeholder="구매수량을 입력하세요"
              style={styles.input}
              // value={purchaseQuantity}
              value={displayQuantity}
              // onChangeText={setPurchaseQuantity}
              onChangeText={value =>
                handleInputChange('purchaseQuantity', value)
              }
              keyboardType="number-pad"
            />

            <Text style={styles.text}>구매가격</Text>
            <TextInput
              placeholder="구매가격을 입력하세요"
              style={styles.input}
              // value={purchasePrice}
              value={displayPrice}
              // onChangeText={setPurchasePrice}
              onChangeText={value => handleInputChange('purchasePrice', value)}
              keyboardType="number-pad"
            />

            <Text style={styles.text}>소계</Text>
            <TextInput
              style={[styles.input, styles.disable]}
              editable={false}
              value={subTotal ? formatNumber(subTotal) + '원' : ''}
              onChangeText={setSubTotal}
            />

            <FlatList
              data={items}
              keyExtractor={item => index.toString()}
              renderItem={({item}) => (
                <View style={styles.itemContainer}>
                  <Text>
                    {item.category} - {item.product}
                  </Text>
                  <Text>
                    {item.displayQuantity} | {item.displayPrice}
                  </Text>
                  <Text>소계: {item.displaySubTotal}</Text>
                </View>
              )}
              style={styles.itemList}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  // setModalVisible(false);
                  closeModal();
                  resetModal();
                }}>
                <Text style={styles.modalButtonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleAddItem}>
                <Text style={styles.modalButtonText}>추가</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ced4da',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
    overflow: Platform.select({android: 'hidden'}),
  },
  disable: {
    backgroundColor: '#f0f0f0',
    color: '#000',
    elevation: 0,
    shadowOpacity: 0,
    height: 40,
  },
  dropdown: {
    minHeight: 40,
    borderRadius: 4,
    borderColor: '#ced4da',
    marginBottom: 15,
  },
  dropdownContainer: {
    borderColor: '#ced4da',
    borderRadius: 4,
  },
  // 모달창 화면
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    maxHeight: '80%',
    margin: 20,
    // marginVertical: 'auto',
    marginTop: 150,
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
    marginHorizontal: 5,
    paddingVertical: 10,
  },
  cancelButton: {
    backgroundColor: '#d0d6e3',
  },
  confirmButton: {
    backgroundColor: '#00569A',
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 5,
    marginLeft: 6,
  },
  itemList: {
    maxHeight: 200, // 스크롤 가능한 영역 높이
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    paddingVertical: 10,
  },
});

export default InventoryItem;
