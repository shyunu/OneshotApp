import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  Alert,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';

function InventoryItem({modalVisible, closeModal, addItem}) {
  // const [modalVisible, setModalVisible] = useState(false); // 모달창
  const [items, setItems] = useState([]); // 구매 상품

  const [openSupplier, setOpenSupplier] = useState(false);
  const [valueSupplier, setValueSupplier] = useState(null);
  const [supplierItems, setSupplierItems] = useState([]);

  // 카테고리
  const [openCategory, setOpenCategory] = useState(false);
  const [valueCategory, setValueCategory] = useState(null);
  const [category, setCategory] = useState([]);

  // 상품
  const [openProduct, setOpenProduct] = useState(false);
  const [valueProduct, setValueProduct] = useState(null);
  const [product, setProduct] = useState([]);

  // 가격과 수량
  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchaseQuantity, setPurchaseQuantity] = useState('');
  const [subTotal, setSubTotal] = useState('');

  // 화면 표시용
  const [displayPrice, setDisplayPrice] = useState('');
  const [displayQuantity, setDisplayQuantity] = useState('');

  // 추가 아이템
  const [purchaseItems, setPurchaseItems] = useState([]);

  // supplierNo가 있을 때 카테고리 데이터 불러오기
  const fetchCategories = async supplierNo => {
    if (!supplierNo) return; // supplierNo가 없으면 실행X
    try {
      const categoryResponse = await axios.get(
        `http://localhost:8181/inventoryApp/getCategories?supplierNo=${supplierNo}`,
      );
      setCategory(
        categoryResponse.data.map(category => ({
          label: category.categoryName,
          value: category.categoryNo,
        })),
      );
    } catch (error) {
      console.error('카테고리 로드 오류: ', error);
      Alert.alert('Error', '카테고리 로드 실패');
    }
  };

  useEffect(() => {
    fetchCategories(valueSupplier);
  }, [valueSupplier]);

  // 카테고리별 상품 드롭다운
  const fetchProducts = async () => {
    if (!valueCategory) return;

    try {
      const productResponse = await axios.get(
        `http://localhost:8181/inventoryApp/getProductsByCategory?categoryNo=${valueCategory}`,
      );
      const productItems = productResponse.data.map(product => ({
        label: product.productName,
        value: product.productNo,
      }));
      setProduct(productItems);
    } catch (error) {
      setError(error.message);
      console.error('Error products:', error);
    }
  };

  useEffect(() => {
    fetchProducts(valueCategory);
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
      // calculateSubTotal(formatValue, purchasePrice);
    } else if (type === 'purchasePrice') {
      setPurchasePrice(formatValue);
      setDisplayPrice(formatValue ? formatNumber(formatValue) + '원' : '');
      // calculateSubTotal(purchaseQuantity, formatValue);
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
  // const addItem = item => {
  //   // setItems(prevItems => {
  //   //   const updatedItems = [...prevItems, item];
  //   //   console.log('업데이트 상품:', updatedItems);
  //   //   return updatedItems;
  //   // });
  //   setItems([...items, item]);
  //   console.log('items: ', items);
  // };

  // 상품구매 +
  const handleAddItem = () => {
    if (valueCategory && valueProduct && purchaseQuantity && purchasePrice) {
      const newItem = {
        category: category.find(c => c.value === valueCategory)?.label,
        product: product.find(p => p.value === valueProduct)?.label,
        productNo: valueProduct,
        purchaseQuantity: purchaseQuantity,
        purchasePrice: purchasePrice,
        displayQuantity: displayQuantity,
        displayPrice: displayPrice,
        displaySubTotal: formatNumber(subTotal) + '원',
      };
      setItems([...items, newItem]);

      addItem(newItem); // props로 전달받은 addItem 함수 사용
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
      // onRequestClose={() => setModalVisible(false)}
      onRequestClose={closeModal}>
      <View style={styles.modalContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
          {/* 안드보다 아이폰에 offset을 줘야 버튼 바가 가려지지 않음 */}
          <ScrollView
            contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
            showsVerticalScrollIndicator={false}>
            {/* keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"> */}
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>상품 추가</Text>

              <Text style={styles.text}>카테고리</Text>
              <DropDownPicker
                open={openCategory}
                value={valueCategory}
                items={category}
                setOpen={setOpenCategory}
                setValue={setValueCategory}
                setItems={setCategory}
                style={styles.dropdown}
                placeholder="카테고리를 선택하세요"
                zIndex={300}
                dropdownContainerStyle={styles.dropdownContainer}
              />

              <Text style={styles.text}>상품명</Text>
              <DropDownPicker
                open={openProduct}
                value={valueProduct}
                items={product}
                setOpen={setOpenProduct}
                setValue={setValueProduct}
                setItems={setProduct}
                style={styles.dropdown}
                placeholder="상품을 선택하세요"
                zIndex={200}
                dropdownContainerStyle={styles.dropdownContainer}
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
                onChangeText={value =>
                  handleInputChange('purchasePrice', value)
                }
                keyboardType="number-pad"
              />

              <Text style={styles.text}>소계</Text>
              <TextInput
                style={[styles.input, styles.disable]}
                editable={false}
                value={subTotal ? formatNumber(subTotal) + '원' : ''}
                onChangeText={setSubTotal}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={
                    // setModalVisible(false);
                    closeModal
                    // resetModal();
                  }>
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
          </ScrollView>
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  // modalContainer: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: 'rgba(0, 0, 0, 0.5)',
  //   padding: 20,
  // },
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
    marginHorizontal: 5,
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
});

export default InventoryItem;
