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

function InventoryWriteEditor({supplierNo, setSupplierNo, items, setItems}) {
  const [modalVisible, setModalVisible] = useState(false); // 모달창
  const [loading, setLoading] = useState(true); // 로딩 상태 관리

  // 구매내역번호
  const [purchaseNo, setPurchaseNo] = useState('');

  // 공급업체
  const [openSupplier, setOpenSupplier] = useState(false);
  // const [valueSupplier, setValueSupplier] = useState(null);
  const [valueSupplier, setValueSupplier] = useState(supplierNo || null);
  const [supplierItems, setSupplierItems] = useState([]);

  // 공급업체 정보
  const [managerName, setManagerName] = useState('');
  const [managerPhone, setManagerPhone] = useState('');

  // 선택된 행 인덱스 저장
  const [selectedRow, setSelectedRow] = useState(null);

  // 공급업체 선택
  const fetchSupplier = async () => {
    try {
      const supplierResponse = await axios.get(
        // 'http://192.168.0.10:8181/inventoryApp/getSuppliers',
        'http://localhost:8181/inventoryApp/getSuppliers',
      );

      setSupplierItems(
        supplierResponse.data.map(supplier => ({
          label: supplier.supplierName,
          value: supplier.supplierNo,
        })),
      );
    } catch (error) {
      console.log('공급업체 로드 오류: ', error);
      Alert.alert('Error', '공급업체 로드 실패');
    } finally {
      setLoading(false);
    }
  };
  console.log('valueSupplier:', valueSupplier);

  useEffect(() => {
    fetchSupplier();
  }, []); // 빈 배열을 넣어 컴포넌트가 처음 마운트될 때만 실행하도록 설정

  // 공급업체 관련 정보 가져오기 (담당자명, 연락처)
  useEffect(() => {
    const fetchSupplierInfo = async () => {
      if (valueSupplier) {
        try {
          const supplierListResponse = await axios.get(
            // `http://192.168.0.10:8181/inventoryApp/getSupplierInfo/${valueSupplier}`,
            `http://localhost:8181/inventoryApp/getSupplierInfo/${valueSupplier}`,
          );
          setManagerName(supplierListResponse.data.managerName || '');
          setManagerPhone(supplierListResponse.data.managerPhone || '');
          setSupplierNo(valueSupplier); // 상위 컴포넌트의 supplierNo도 설정
        } catch (error) {
          console.log(error);
          Alert.alert('Error', '공급업체 정보 불러오기에 실패했습니다.');
        }
      } else {
        setManagerName('');
        setManagerPhone('');
      }
    };
    fetchSupplierInfo();
  }, [valueSupplier, setSupplierNo]);

  // valueSupplier가 변경될 때 items 초기화
  // useEffect(() => {
  //   if (valueSupplier) {
  //     setItems([]);
  //   }
  // }, [valueSupplier]);

  // 모달 열기
  const openModal = () => {
    setModalVisible(true);
  };
  // 모달 닫기
  const closeModal = () => {
    setModalVisible(false);
  };

  // 아이템 추가
  const handleAddItem = newItem => {
    if (items.some(item => item.productNo === newItem.productNo)) {
      Alert.alert('오류', '이미 추가된 상품입니다.');
      return;
    }
    setItems([...items, newItem]);
    setModalVisible(false);
  };

  // 아이템 삭제
  const handleDeleteItem = index => {
    setItems(items.filter((_, itemIndex) => itemIndex !== index));
    setSelectedRow(null); // 삭제 후 선택된 행 인덱스 초기화
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
        dropDownContainerStyle={styles.dropdownContainer}
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
          onPress={openModal}>
          <Image source={require('../../assets/add_white.png')} />
        </TouchableOpacity>

        {items.length >= 0 && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleDeleteItem(selectedRow)}>
            <View style={styles.deleteButtonStyle}>
              <Icon name="horizontal-rule" size={24} color="white" />
            </View>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>카테고리</Text>
          <Text style={styles.tableHeaderText}>상품명</Text>
          <Text style={styles.tableHeaderText}>수량</Text>
          <Text style={styles.tableHeaderText}>가격</Text>
        </View>

        <ScrollView style={styles.tableBody}>
          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.tableRow,
                selectedRow === index && styles.selectedRow,
              ]}
              onPress={() => setSelectedRow(index)} // 행 클릭 시 인덱스 저장
            >
              <Text style={styles.tableCell}>{item.category}</Text>
              <Text style={styles.tableCell}>{item.product}</Text>
              <Text style={styles.tableCell}>{item.displayQuantity}</Text>
              <Text style={styles.tableCell}>{item.displayPrice}</Text>

              {/* </View> */}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <InventoryItem
        modalVisible={modalVisible}
        closeModal={closeModal}
        addItem={handleAddItem}
        supplierNo={valueSupplier}
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
    borderColor: '#ced4da',
    borderRadius: 4,
    marginBottom: 15,
  },
  dropdownContainer: {
    borderColor: '#ced4da',
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
  selectedRow: {
    backgroundColor: '#f0f0f0',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
});

export default InventoryWriteEditor;
