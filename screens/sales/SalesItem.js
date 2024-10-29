import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  Text,
  Button,
  StyleSheet,
  Modal,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';

function SalesItem({
  isVisible,
  onClose,
  onAddItem,
  clientNo,
  selectedProducts,
  orderHeaderNo,
}) {
  const [disable, setDisabled] = useState(false); //textinput disabled처리

  // 상품
  const [contractPrice, setContractPrice] = useState(''); // *** contract_price(big int)
  const [inventoryQuantity, setInventoryQuantity] = useState('');
  const [productQuantity, setProductQuantity] = useState(''); // *** product_quantity(int)
  const [amount, setAmount] = useState(0); // *** amount(big int)

  const [product, setProduct] = useState(null); // *** product_no(int)
  const [productName, setProductName] = useState(''); //화면에 보여줄 이름이라서 저장

  const [openProduct, setOpenProduct] = useState(false);
  const [productLists, setProductLists] = useState([]);

  // 상품 등록하기
  function onSave() {
    //재고 이하로만 주문 가능하도록 제어
    if (parseInt(productQuantity) > parseInt(inventoryQuantity)) {
      Alert.alert(`최대 주문가능수량은 ${inventoryQuantity}개입니다.`);
      setProductQuantity('');
      return;
    }

    //모든 필드를 작성하지 않으면 저장할 수 없도록 제어
    if (!product || !contractPrice || !inventoryQuantity || !productQuantity) {
      Alert.alert('상품 정보를 모두 입력해주세요.');
      return;
    }

    onAddItem({
      product,
      productName,
      contractPrice,
      inventoryQuantity,
      productQuantity,
      amount,
    });
    setProduct(null);
    setProductName('');
    setContractPrice('');
    setInventoryQuantity('');
    setProductQuantity('');
    setAmount('');
    onClose();
  }

  //취소버튼 누르면 작성하던 폼 초기화하기
  function cancelForm() {
    setProduct(null);
    setProductName('');
    setContractPrice('');
    setInventoryQuantity('');
    setProductQuantity('');
    setAmount('');
    onClose();
  }

  // clientNo가 변경될 때마다 상품데이터 가져오기
  useEffect(() => {
    if (clientNo) {
      fetchProductList();
    }
  }, [clientNo, selectedProducts]);

  // 상품리스트 가져오기
  const fetchProductList = async () => {
    try {
      const response = await fetch(
        // `http://172.30.1.63:8181/salesApp/getProductList/${clientNo}`,
        `http://localhost:8181/salesApp/getProductList/${clientNo}`,
      );

      const data = await response.json();
      console.log(data); // 반환된 데이터의 형식 확인

      const productOptions = data
        .filter(product => !selectedProducts.includes(product.productNo))
        .map(product => ({
          label: product.productName,
          value: product.productNo,
          productName: product.productName, // 추가로 포함할 값
        }));
      setProductLists(productOptions);
    } catch (error) {
      Alert.alert('Error', '상품 목록 조회 실패!');
    }
  };

  // 상품을 선택하면 계약가격&재고 가져오기
  useEffect(() => {
    const fetchContractPrice = async () => {
      console.log(
        `Fetching contract price for clientNo: ${clientNo}, productNo: ${product}`,
      );

      if (product && clientNo) {
        try {
          const response = await axios.get(
            // `http://172.30.1.63:8181/salesApp/getProductPrice/${clientNo}/${product}`,
            `http://localhost:8181/salesApp/getProductPrice/${clientNo}/${product}`,
          );

          console.log(response.data);
          setContractPrice(response.data.contractPrice);
          setInventoryQuantity(response.data.inventoryQuantity);
        } catch (error) {
          console.error('AxiosError:', error.response?.data || error.message);
          Alert.alert('Error', '계약가격 불러오기 실패!');
        }
      } else {
        setContractPrice('');
        setInventoryQuantity('');
      }
    };
    fetchContractPrice();
  }, [clientNo, product]);

  //원화 + 천원단위(,)
  const formatCurrency = amount => {
    return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원`;
  };

  //총 금액 자동계산
  useEffect(() => {
    const price = parseFloat(contractPrice) || 0; // 계약가격
    const qty = parseFloat(productQuantity) || 0; // 수량
    setAmount(price * qty); // 금액 계산
  }, [contractPrice, productQuantity]); // contractPrice와 quantity가 변경될 때마다 금액 계산

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
      style={styles.block}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>상품 추가</Text>
            <Text style={styles.text}>상품명</Text>
            <DropDownPicker
              open={openProduct}
              value={product}
              items={productLists}
              setOpen={setOpenProduct}
              setValue={value => {
                setProduct(value);
              }}
              setItems={setProductLists}
              placeholder="상품을 선택하세요"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownMenuContainer}
            />
            <Text style={styles.text}>책정거래가</Text>
            <TextInput
              editable={disable}
              value={contractPrice ? formatCurrency(contractPrice) : ''}
              onChangeText={text => setContractPrice(text.replace(/,/g, ''))}
              style={[styles.input, styles.inputDisabled]}
            />
            <Text style={styles.text}>재고</Text>
            <TextInput
              editable={disable}
              value={inventoryQuantity.toString()}
              onChangeText={text => setInventoryQuantity(parseInt(text))}
              style={[styles.input, styles.inputDisabled]}
            />
            <Text style={styles.text}>개수</Text>
            <TextInput
              keyboardType="numeric"
              value={productQuantity}
              onChangeText={setProductQuantity}
              style={styles.input}
              onSubmitEditing={Keyboard.dismiss}
            />
            <Text style={styles.text}>금액</Text>
            <TextInput
              editable={disable}
              value={amount ? formatCurrency(amount) : ''}
              onChangeText={text => setAmount(parseInt(text))}
              style={[styles.input, styles.inputDisabled]}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  onClose();
                  cancelForm();
                }}>
                <Text style={styles.modalButtonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={onSave}>
                <Text style={styles.modalButtonText}>추가</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
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
  text: {
    marginBottom: 8,
    fontSize: 16,
    color: '#000',
  },
  dropdown: {
    minHeight: 40,
    borderColor: '#ced4da',
    borderRadius: 4,
    marginBottom: 15,
  },
  dropdownMenuContainer: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 4,
    maxHeight: 200,
  },
  input: {
    height: 40,
    borderColor: '#ced4da',
    borderWidth: 1,
    color: '#000',
    marginBottom: 15,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
    overflow: Platform.select({android: 'hidden'}),
    zIndex: 1,
  },
  inputDisabled: {
    backgroundColor: '#f0f0f0',
    color: '#000',
    zIndex: 1000,
    opacity: 1,
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
    fontSize: 16,
    letterSpacing: 5,
    marginLeft: 6,
  },
  cancelButton: {
    backgroundColor: '#d0d6e3',
    TouchableOpacity: 0.8,
  },
  confirmButton: {
    backgroundColor: '#00569A',
    TouchableOpacity: 0.8,
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default SalesItem;
