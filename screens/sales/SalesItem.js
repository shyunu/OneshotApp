import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  Button,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

function SalesItem({isVisible, onClose, onAddItem}) {
  const [disable, setDisabled] = useState(false); //textinput disabled처리
  const [modalIsVisible, setModalIsVisible] = useState(false); //modal창

  // 상품
  const [valueProduct, setValueProduct] = useState(null); //상품
  const [contractPrice, setContractPrice] = useState('');
  const [inventoryQuantity, setInventoryQuantity] = useState('');
  const [quantity, setQuantity] = useState('');
  const [amount, setAmount] = useState('');

  const [openProduct, setOpenProduct] = useState(false);
  const [products, setProducts] = useState([
    {label: '상품1', value: 'product1'},
    {label: '상품2', value: 'product2'},
    {label: '상품3', value: 'product3'},
    {label: '상품4', value: 'product4'},
  ]);

  const onSave = () => {
    onAddItem({
      valueProduct,
      contractPrice,
      inventoryQuantity,
      quantity,
      amount,
    });
    setValueProduct('');
    setContractPrice('');
    setInventoryQuantity('');
    setQuantity('');
    setAmount('');
    onClose();
  };

  return (
    <Modal transparent={true} visible={isVisible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.header}>상품 등록하기</Text>

            <Text style={styles.text}>상품명</Text>
            <DropDownPicker
              open={openProduct}
              value={valueProduct}
              items={products}
              setOpen={setOpenProduct}
              setValue={setValueProduct}
              setItems={setProducts}
              placeholder="상품을 선택하세요"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
            <Text style={styles.text}>책정거래가</Text>
            <TextInput
              // editable={disable}
              value={contractPrice}
              onChangeText={setContractPrice}
              style={[styles.input, styles.inputDisabled]}
            />
            <Text style={styles.text}>재고</Text>
            <TextInput
              // editable={disable}
              value={inventoryQuantity}
              onChangeText={setInventoryQuantity}
              style={[styles.input, styles.inputDisabled]}
            />
            <Text style={styles.text}>개수</Text>
            <TextInput
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
              style={styles.input}
              onSubmitEditing={Keyboard.dismiss}
            />
            <Text style={styles.text}>금액</Text>
            <TextInput
              // editable={disable}
              value={amount}
              onChangeText={setAmount}
              style={[styles.input, styles.inputDisabled]}
            />

            <View style={styles.buttonContainer}>
              <View style={styles.buttons}>
                <Button title="저장" onPress={onSave} />
                <Button title="닫기" onPress={onClose} />
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  header: {
    width: '100%',
    fontSize: 18,
    marginBottom: 20,
    // backgroundColor: '#e3e3e3',
    borderBottomColor: '#e3e3e3',
    borderBottomWidth: 5,
  },
  modalContainer: {
    width: 300,
    padding: 30,
    backgroundColor: 'white',
    borderRadius: 10,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  text: {
    marginBottom: 7,
  },
  dropdown: {
    borderColor: '#ced4da',
    borderRadius: 4,
    marginBottom: 10,
    minHeight: 30,
  },
  input: {
    width: '100%',
    height: 30,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#495057',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  inputDisabled: {
    backgroundColor: '#f0f0f0',
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  buttons: {
    flexDirection: 'row', // Arrange buttons in a row
    justifyContent: 'space-between', // Space buttons evenly
  },
});

export default SalesItem;
