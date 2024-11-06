import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

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

function ProductWriteEditor() {
  return (
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
        style={[styles.text, styles.disable]}
        editable={false}
        value={supplierBusinessNo}
        onChangeText={setSupplierBusinessNo}
      />
      <Text style={styles.text}>담당자</Text>
      <TextInput
        style={[styles.text, styles.disable]}
        editable={false}
        value={managerName}
        onChangeText={setManagerName}
      />
      <Text style={styles.text}>담당자연락처</Text>
      <TextInput
        style={[styles.text, styles.disable]}
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
        dropDownContainerStyle={styles.dropdownContainer}
      />
      <Text style={styles.text}>판매상태</Text>
      <TextInput
        style={[styles.text, styles.disable]}
        editable={false}
        value={purchaseStatus}
        onChangeText={setPurchaseStatus}
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
      <Text style={styles.text}>판매가격</Text>
      <TextInput
        placeholder="판매가격을 입력해주세요"
        style={styles.input}
        value={displayPrice}
        onChangeText={setDisplayPrice}
        keyboardType="number-pad"
      />
      <Text style={styles.text}>안전재고수량</Text>
      <TextInput
        placeholder="안전재고수량을 입력해주세요"
        style={styles.input}
        value={displayPrice}
        onChangeText={setDisplayPrice}
        keyboardType="number-pad"
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
  selectedRow: {
    backgroundColor: '#f0f0f0',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
});

export default ProductWriteEditor;
