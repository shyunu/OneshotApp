import React, {useRef, useState} from 'react';
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
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

function InventoryWriteEditor() {
  const [modalVisible, setModalVisible] = useState(false);
  const [items, setItems] = useState([]);

  const [openSupplier, setOpenSupplier] = useState(false);
  const [valueSupplier, setValueSupplier] = useState(null);
  const [supplier, setSupllier] = useState([
    {label: '공급업체1', value: 'supplier1'},
    {label: '공급업체2', value: 'supplier2'},
    {label: '공급업체3', value: 'supplier3'},
  ]);

  const [openCategory, setOpenCategory] = useState(false);
  const [valueCategory, setValueCategory] = useState(null);
  const [category, setCategory] = useState([
    {label: '카테고리1', value: 'category1'},
    {label: '카테고리2', value: 'category2'},
    {label: '카테고리3', value: 'category3'},
  ]);

  const [openProduct, setOpenProduct] = useState(false);
  const [valueProduct, setValueProduct] = useState(null);
  const [product, setProduct] = useState([
    {label: '상품1', value: 'product1'},
    {label: '상품2', value: 'product2'},
  ]);

  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const handleAddItem = () => {
    if (valueCategory && valueProduct && quantity && price) {
      const newItem = {
        category: category.find(c => c.value === valueCategory)?.label,
        product: product.find(p => p.value === valueProduct)?.label,
        quantity: quantity,
        price: price,
      };
      setItems([...items, newItem]);

      // Reset form
      setValueCategory(null);
      setValueProduct(null);
      setQuantity('');
      setPrice('');
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.block}>
      <Text style={styles.text}>구매내역번호</Text>
      <TextInput
        // placeholder="상품구매"
        // value={purchaseNo}
        style={[styles.input, styles.disable]}
        editable={false}
      />
      <Text style={styles.text}>공급업체명</Text>
      <DropDownPicker
        open={openSupplier}
        value={valueSupplier}
        items={supplier}
        setOpen={setOpenSupplier}
        setValue={setValueSupplier}
        setItems={setSupllier}
        style={styles.dropdown}
        placeholder="공급업체를 선택하세요"
        dropdownMenuStyle={styles.dropdownMenu}
      />
      <Text style={styles.text}>담당자명</Text>
      {/* // disable */}
      <TextInput
        // placeholder="담당자명"
        // value={employeeName}
        style={[styles.input, styles.disable]}
        editable={false}
      />
      <Text style={styles.text}>담당자연락처</Text>
      {/* //disable */}
      <TextInput
        // placeholder="담당자연락처"
        // value={employeeNumber}
        style={[styles.input, styles.disable]}
        editable={false}
      />
      <View style={styles.purchaseProduct}>
        <Text style={styles.purchaseTitle}>상품구매</Text>
        <TouchableOpacity
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
        </View>
        <ScrollView style={styles.tableBody}>
          {items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.category}</Text>
              <Text style={styles.tableCell}>{item.product}</Text>
              <Text style={styles.tableCell}>{item.quantity}</Text>
              <Text style={styles.tableCell}>{item.price}</Text>
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
              style={styles.dropdownMenu}
              placeholder="카테고리를 선택하세요"
              zIndex={3000}
            />

            <Text style={styles.text}>상품명</Text>
            <DropDownPicker
              open={openProduct}
              value={valueProduct}
              items={product}
              setOpen={setOpenProduct}
              setValue={setValueProduct}
              setItems={setProduct}
              style={styles.dropdownMenu}
              placeholder="상품을 선택하세요"
              zIndex={2000}
              dropdownMenuContainerStyle={styles.dropdownMenuContainer}
            />

            <Text style={styles.text}>구매수량</Text>
            <TextInput
              placeholder="구매수량"
              style={styles.input}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
            />

            <Text style={styles.text}>구매가격</Text>
            <TextInput
              placeholder="구매가격"
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />

            <Text style={styles.text}>소계</Text>
            {/* //disable */}
            <TextInput
              // value={employeeNumber}
              style={[styles.input, styles.disable]}
              editable={false}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleAddItem}>
                <Text style={styles.modalButtonText}>추가</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ced4da',
    borderWidth: 1,
    marginBottom: 10,
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
    color: '#6c757d',
    elevation: 0,
    shadowOpacity: 0,
  },
  dropdown: {
    borderRadius: 4,
    borderColor: '#ced4da',
    marginBottom: 10,
  },
  dropdownMenu: {
    borderColor: '#ced4da',
    marginBottom: 10,
  },
  purchaseProduct: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e3',
  },
  purchaseTitle: {
    fontSize: 16,
    marginTop: 10,
    marginLeft: 5,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#e3e3e3',
    padding: 12,
    borderRadius: 4,
    marginTop: 3,
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  // 테이블 화면
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    padding: 10,
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  dropdownMenuContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 4,
    maxHeight: 200,
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
    backgroundColor: '#6c757d',
  },
  confirmButton: {
    backgroundColor: '#00569A',
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default InventoryWriteEditor;
