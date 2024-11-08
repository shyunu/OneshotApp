import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  FlatList,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';

function ProductWriteEditor() {
  // 공급업체
  const [openSupplier, setOpenSupplier] = useState(false);
  const [valueSupplier, setValueSupplier] = useState(null);
  const [supplierItems, setSupplierItems] = useState([]);

  // 공급업체 정보
  const [supplierBusinessNo, setSupplierBusinessNo] = useState('');
  const [managerName, setManagerName] = useState('');
  const [managerPhone, setManagerPhone] = useState('');

  // 카테고리
  const [openCategory, setOpenCategory] = useState(false);
  const [valueCategory, setValueCategory] = useState(null);
  const [categoryItems, setCategoryItems] = useState([]);

  // 상품
  const [openProduct, setOpenProduct] = useState(false);
  const [valueProduct, setValueProduct] = useState(null);
  const [productItems, setProductItems] = useState([]);

  const [purchaseStatus, setPurchaseStatus] = useState(''); // 판매상태
  const [purchasePrice, setPurchasePrice] = useState(''); // 판매가격
  const [safetyQuantity, setSafeQuantity] = useState(''); // 안전재고수량

  const [loading, setLoading] = useState(true); // 로딩 상태 관리

  // 로딩
  // if (loading) {
  //   return (
  //     <View style={styles.loader}>
  //       <ActivityIndicator size="large" color="#0000ff" />
  //       <Text>데이터를 로드 중입니다</Text>
  //     </View>
  //   );
  // }

  // 천단위 콤마
  const formatNumber = value => {
    if (!value) return 0;
    return parseInt(value, 10).toLocaleString('ko-KR');
  };

  // 공급업체
  useEffect(() => {
    const fetchSupplierList = async () => {
      try {
        const supplierListResponse = await axios.get(
          'http://172.30.1.17:8181/productApp/getSupplierList',
        );
        setSupplierItems(
          supplierListResponse.data.map(supplier => ({
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
    fetchSupplierList();
  }, []);

  // 공급업체 관련 정보
  useEffect(() => {
    const fetchSupplierInfo = async () => {
      if (valueSupplier) {
        try {
          const supplierInfoResponse = await axios.get(
            `http://172.30.1.17:8181/productApp/getSupplierContent/${valueSupplier}`,
          );
          setSupplierBusinessNo(supplierInfoResponse.data.supplierBusinessNo);
          setManagerName(supplierInfoResponse.data.managerName);
          setManagerPhone(supplierInfoResponse.data.managerPhone);
        } catch (error) {
          console.log('공급업체 정보 로드 실패: ', error);
          Alert.alert('Error', '공급업체 정보 로드 실패');
        }
      } else {
        setSupplierBusinessNo('');
        setManagerName('');
        setManagerPhone('');
      }
    };
    fetchSupplierInfo();
  }, [valueSupplier]);

  // 카테고리
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryResponse = await axios.get(
          `http://172.30.1.17:8181/productApp/getCategoryList`,
        );
        setCategoryItems(
          categoryResponse.data.map(category => ({
            label: category.categoryName,
            value: category.categoryNo,
          })),
        );
      } catch (error) {
        console.log('카테고리 오류:', error);
        Alert.alert('Error', '카테고리 로드 실패');
      }
    };
    fetchCategories();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}
      keyboardVerticalOffset={Platform.OS === 'android' ? 100 : 0}>
      <ScrollView>
        <View style={styles.block}>
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
          <Text style={styles.text}>사업자번호</Text>
          <TextInput
            style={[styles.input, styles.disable]}
            editable={false}
            value={supplierBusinessNo}
            onChangeText={setSupplierBusinessNo}
          />
          <Text style={styles.text}>담당자</Text>
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
          <Text style={styles.text}>판매상태</Text>
          <TextInput
            style={[styles.input, styles.disable]}
            editable={false}
            value={purchaseStatus}
            onChangeText={setPurchaseStatus}
          />
          <Text style={styles.text}>상품명</Text>
          <TextInput
            placeholder="상품을 입력해주세요"
            style={styles.input}
            value={valueProduct}
            onChangeText={setValueProduct}
          />
          <Text style={styles.text}>판매가격</Text>
          <TextInput
            placeholder="판매가격을 입력해주세요"
            style={styles.input}
            // value={displayPrice}
            // onChangeText={setDisplayPrice}
            keyboardType="number-pad"
          />
          <Text style={styles.text}>안전재고수량</Text>
          <TextInput
            placeholder="안전재고수량을 입력해주세요"
            style={styles.input}
            // value={displayPrice}
            // onChangeText={setDisplayPrice}
            keyboardType="number-pad"
          />
          <Text style={styles.purchaseTitle}>상품내역</Text>

          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>카테고리</Text>
              <Text style={styles.tableHeaderText}>상품명</Text>
              <Text style={styles.tableHeaderText}>수량</Text>
              <Text style={styles.tableHeaderText}>가격</Text>
            </View>

            {/* <FlatList
            data={productItems}
            keyExtractor={item => item.id.toString()} // item의 고유 ID 사용
            renderItem={({item}) => (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.category}</Text>
                <Text style={styles.tableCell}>{item.productName}</Text>
                <Text style={styles.tableCell}>{item.quantity}</Text>
                <Text style={styles.tableCell}>{item.price}</Text>
              </View>
            )}
            style={styles.tableBody}
          /> */}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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

export default ProductWriteEditor;
