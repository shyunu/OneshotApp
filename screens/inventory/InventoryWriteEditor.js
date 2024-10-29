import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';

function InventoryWriteEditor() {
  const [modalVisible, setModalVisible] = useState(false); // 모달창
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [purchaseNo, setPurchaseNo] = useState('');

  // 공급업체
  const [openSupplier, setOpenSupplier] = useState(false);
  const [valueSupplier, setValueSupplier] = useState(null);
  const [supplierItems, setSupplierItems] = useState([]);

  // 공급업체 정보
  const [managerName, setManagerName] = useState('');
  const [managerPhone, setManagerPhone] = useState('');

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

  const [data, setData] = useState('');

  // 공급업체 선택
  const fetchSupplier = async () => {
    try {
      const supplierResponse = await axios.get(
        'http://172.30.1.48:8181/inventoryApp/getSuppliers',
      );

      setSupplierItems(
        supplierResponse.data.map(supplier => ({
          label: supplier.supplierName,
          value: supplier.supplierNo,
        })),
      );
    } catch (error) {
      console.log('데이터 로드 오류: ', error);
      Alert.alert('Error', '데이터 로드 실패');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplier();
  }, []); // 빈 배열을 넣어 컴포넌트가 처음 마운트될 때만 실행하도록 설정

  // 공급업체 관련 정보 가져오기
  useEffect(() => {
    const fetchSupplierList = async () => {
      if (valueSupplier) {
        try {
          const supplierListResponse = await axios.get(
            `http://172.30.1.48:8181/inventoryApp/getSupplierInfo/${valueSupplier}`,
          );
          setManagerName(supplierListResponse.data.managerName || '');
          setManagerPhone(supplierListResponse.data.managerPhone || '');
        } catch (error) {
          console.log(error);
          Alert.alert('Error', '데이터 로드 실패');
        }
      } else {
        setManagerName('');
        setManagerPhone('');
      }
    };
    fetchSupplierList();
  }, [valueSupplier]);

  // supplierNo가 있을 때 데이터 불러오기
  const fetchCategories = async supplierNo => {
    if (!supplierNo) return; // supplierNo가 없으면 실행X
    try {
      const categoryResponse = await axios.get(
        `http://172.30.1.48:8181/inventoryApp/getCategories?supplierNo=${supplierNo}`,
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

  const fetchProducts = async () => {
    if (!valueCategory) return;

    try {
      const productResponse = await axios.get(
        `http://172.30.1.48:8181/inventoryApp/getProductsByCategory?categoryNo=${valueCategory}`,
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

  useEffect(() => {
    if (purchasePrice && purchaseQuantity) {
      setSubTotal(
        (parseFloat(purchasePrice) * parseInt(purchaseQuantity)).toFixed(2),
      );
    } else {
      setSubTotal('');
    }
  }, [purchasePrice, purchaseQuantity]);

  const handleAddItem = () => {
    if (valueCategory && valueProduct && purchaseQuantity && purchasePrice) {
      const newItem = {
        category: category.find(c => c.value === valueCategory)?.label,
        product: product.find(p => p.value === valueProduct)?.label,
        purchaseQuantity: purchaseQuantity,
        purchasePrice: purchasePrice,
      };
      setItems([...items, newItem]);
      resetModal();
      setModalVisible(false);
    } else {
      Alert.alert('Warning', '모든 필드를 입력해주세요.');
      return;
    }
  };

  const formatNumber = value => {
    if (!value) return '';
    return parseInt(value, 10).toLocaleString('ko-KR');
  };

  // const handleInputChange = {type,value} => {
  //   const formatValue = formatNumber(value);
  //   if(type === 'price') {
  //     setPrice
  //   }
  // }

  function resetModal() {
    setValueCategory(null);
    setValueProduct(null);
    setPurchaseQuantity('');
    setPurchasePrice('');
    setSubTotal('');
  }

  function ResetDelete() {
    Alert.alert('경고', '정말로 초기화하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {
        text: '확인',
        onPress: () => {},
      },
    ]);
  }

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>데이터를 로드 중입니다</Text>
      </View>
    );
  }

  return (
    <View style={styles.block}>
      <Text style={styles.text}>구매내역번호</Text>
      <TextInput
        style={[styles.input, styles.disable]}
        editable={false}
        onChangeText={setPurchaseNo}
      />
      <Text style={styles.text}>공급업체명</Text>
      <DropDownPicker
        open={openSupplier}
        value={valueSupplier}
        items={supplierItems}
        setOpen={setOpenSupplier}
        setValue={setValueSupplier}
        setItems={setSupplierItems}
        style={styles.dropdown}
        placeholder="공급업체를 선택하세요"
        dropdownContainerStyle={styles.dropdownContainer}
      />
      <Text style={styles.text}>담당자명</Text>
      <TextInput
        style={[styles.input, styles.disable]}
        editable={false}
        value={managerName}
        onChangeText={setManagerName}
      />
      <Text style={styles.text}>담당자연락처</Text>
      <TextInput
        style={[styles.input, styles.disable]}
        editable={false}
        value={managerPhone}
        onChangeText={setManagerPhone}
      />
      <View style={styles.purchaseProduct}>
        <Text style={styles.purchaseTitle}>상품구매</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.addButton}
          onPress={() => setModalVisible(true)}>
          <Image source={require('../../assets/add_white.png')} />
        </TouchableOpacity>
      </View>
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>카테고리</Text>
          <Text style={styles.tableHeaderText}>상품명</Text>
          <Text style={styles.tableHeaderText}>수량</Text>
          <Text style={styles.tableHeaderText}>가격</Text>
          {/* <Text style={styles.tableHeaderText}>소계</Text> */}
        </View>
        <ScrollView style={styles.tableBody}>
          {items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.category}</Text>
              <Text style={styles.tableCell}>{item.product}</Text>
              <Text style={styles.tableCell}>{item.purchaseQuantity}</Text>
              <Text style={styles.tableCell}>{item.purchasePrice}</Text>
              {/* <Text style={styles.tableCell}>{item.subTotal}</Text> */}
            </View>
          ))}
        </ScrollView>
      </View>
      {/* 모달팝업 */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
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
                  // onChangeValue={handleCategoryChange}
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
                  value={purchaseQuantity}
                  onChangeText={setPurchaseQuantity}
                  keyboardType="number-pad"
                />

                <Text style={styles.text}>구매가격</Text>
                <TextInput
                  placeholder="구매가격을 입력하세요"
                  style={styles.input}
                  value={purchasePrice}
                  onChangeText={setPurchasePrice}
                  keyboardType="number-pad"
                />

                <Text style={styles.text}>소계</Text>
                <TextInput
                  style={[styles.input, styles.disable]}
                  editable={false}
                  onChangeText={setSubTotal}
                />

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => {
                      setModalVisible(false);
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
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    padding: 16,
  },
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
  purchaseProduct: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 5,
  },
  purchaseTitle: {
    fontSize: 16,
    marginTop: 10,
    marginLeft: 5,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#00569A',
    padding: 12,
    borderRadius: 4,
    marginTop: 3,
    alignItems: 'center',
    justifyContent: 'center',
    width: 33,
    height: 33,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  // 테이블 화면
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e3e3e3',
    padding: 10,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#ced4da',
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableBody: {
    maxHeight: 150,
  },
  tableRow: {
    flexDirection: 'row',
    textAlign: 'center',
    height: 40,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ced4da',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },

  // 모달창 화면
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

export default InventoryWriteEditor;
