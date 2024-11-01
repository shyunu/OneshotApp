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
import Icon from 'react-native-vector-icons/MaterialIcons';
import InventoryItem from './InventoryItem';

function InventoryWriteEditor() {
  const [modalVisible, setModalVisible] = useState(false); // 모달창
  const [items, setItems] = useState([]); // 구매 상품
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [purchaseNo, setPurchaseNo] = useState('');

  // 공급업체
  const [openSupplier, setOpenSupplier] = useState(false);
  const [valueSupplier, setValueSupplier] = useState(null);
  const [supplierItems, setSupplierItems] = useState([]);

  // 공급업체 정보
  const [managerName, setManagerName] = useState('');
  const [managerPhone, setManagerPhone] = useState('');

  // 공급업체 선택
  const fetchSupplier = async () => {
    try {
      const supplierResponse = await axios.get(
        'http://localhost:8181/inventoryApp/getSuppliers',
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

  // 공급업체 관련 정보 가져오기 (담당자명, 연락처)
  useEffect(() => {
    const fetchSupplierList = async () => {
      if (valueSupplier) {
        try {
          const supplierListResponse = await axios.get(
            `http://localhost:8181/inventoryApp/getSupplierInfo/${valueSupplier}`,
          );
          setManagerName(supplierListResponse.data.managerName || '');
          setManagerPhone(supplierListResponse.data.managerPhone || '');
        } catch (error) {
          console.log(error);
          Alert.alert('Error', '공급업체 정보 불러오기에 실패했습니다.');
        }
      } else {
        setManagerName('');
        setManagerPhone('');
      }
    };
    fetchSupplierList();
  }, [valueSupplier]);

  // const calculateSubTotal = (quantity, price) => {
  //   const subtotal = (Number(quantity) || 0) * (Number(price) || 0);
  //   setSubTotal(subtotal);
  // };

  // 상품 추가
  // const handleAddItem = () => {
  //   if (valueCategory && valueProduct && purchaseQuantity && purchasePrice) {
  //     const newItem = {
  //       category: category.find(c => c.value === valueCategory)?.label,
  //       product: product.find(p => p.value === valueProduct)?.label,
  //       productNo: valueProduct, // productNo 추가
  //       purchaseQuantity: displayQuantity,
  //       purchasePrice: displayPrice,
  //       subTotal: formatNumber(subTotal) + '원',
  //     };
  //     setItems([...items, newItem]);
  //     resetModal();
  //     setModalVisible(false);
  //   } else {
  //     Alert.alert('Warning', '모든 필드를 입력해주세요.');
  //     return;
  //   }
  // };

  // const handleAddItem = () => {
  //   if (valueCategory && valueProduct && purchaseQuantity && purchasePrice) {
  //     const newItem = {
  //       category: category.find(c => c.value === valueCategory)?.label,
  //       product: product.find(p => p.value === valueProduct)?.label,
  //       productNo: valueProduct,
  //       // 숫자만 추출하여 저장
  //       purchaseQuantity: purchaseQuantity, // 원래 숫자값 사용
  //       purchasePrice: purchasePrice, // 원래 숫자값 사용
  //       // 화면 표시용 형식화된 값들
  //       displayQuantity: displayQuantity,
  //       displayPrice: displayPrice,
  //       displaySubTotal: formatNumber(subTotal) + '원',
  //     };
  //     console.log('Adding new item:', newItem); // 디버깅용
  //     setItems([...items, newItem]);
  //     resetModal();
  //     setModalVisible(false);
  //   } else {
  //     Alert.alert('Warning', '모든 필드를 입력해주세요.');
  //     return;
  //   }
  // };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  // 상품 추가 함수
  const addItem = item => {
    // setItems(prevItems => {
    //   const updatedItems = [...prevItems, item];
    //   console.log('Updated items:', updatedItems);
    //   return updatedItems;
    // });
    setItems([...items, item]);
    console.log('items: ', items);
  };

  // 로딩
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
        value={purchaseNo}
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
          // onPress={() => setModalVisible(true)}
          onPress={openModal}>
          <Image source={require('../../assets/add_white.png')} />
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8}>
          <View style={styles.deleteButtonStyle}>
            <Icon name="horizontal-rule" size={24} color="white" />
          </View>
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
              <Text style={styles.tableCell}>{item.displayQuantity}</Text>
              <Text style={styles.tableCell}>{item.displayPrice}</Text>
              {/* <Text style={styles.tableCell}>{item.purchaseQuantity}</Text>
              <Text style={styles.tableCell}>{item.purchasePrice}</Text> */}
              {/* <Text style={styles.tableCell}>{item.subTotal}</Text> */}
            </View>
          ))}
        </ScrollView>
      </View>

      <InventoryItem
        modalVisible={modalVisible}
        closeModal={closeModal}
        addItem={item => setItems([...items, item])}
        style={styles.modalContainer}
      />
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
    marginLeft: 210,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButtonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 33,
    height: 33,
    backgroundColor: '#00569A',
    borderRadius: 4,
    marginTop: 3,
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

  // 모달화면
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
});

export default InventoryWriteEditor;
