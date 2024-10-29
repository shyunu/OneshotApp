import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import SalesItem from './SalesItem';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';

function SalesWriteEditor({onSaveData}) {
  const nextInputRef = useRef(); // 다음 필드 참조
  const [disable, setDisabled] = useState(false); //textinput disabled처리

  // 등록일자 *** order_sdate(date)
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(
    day,
  ).padStart(2, '0')}`;

  //고객사정보
  const [clientBusinessNo, setClientBusinessNo] = useState('');
  const [managerName, setManagerName] = useState('');
  const [managerPhone, setManagerPhone] = useState('');
  const [employeeNo, setEmployeeNo] = useState(''); //*** employee_no(int)

  // 고객사
  const [client, setClient] = useState(null); //*** client_no(int)
  const [openClient, setOpenClient] = useState(false);
  const [clientLists, setClientLists] = useState([]);
  const [loading, setLoading] = useState(true); // 로딩 상태

  //배송상태
  const [deliveryStatus, setDeliveryStatus] = useState('배송대기'); //*** delivery_status(string)
  const [delivery, setDelivery] = useState(null); //*** delivery(date)

  //고객사리스트 불러오기
  const fetchData = async () => {
    try {
      const clientResponse = await axios.get(
        // 'http://172.30.1.63:8181/salesApp/getClientList',
        'http://localhost:8181/salesApp/getClientList',
      );
      console.log('API Response:', clientResponse.data); // 응답 데이터 확인

      setClientLists(
        clientResponse.data.map(client => ({
          label: client.clientName,
          value: client.clientNo,
        })),
      );
    } catch (error) {
      Alert.alert('Error', '데이터를 가져오기 실패!');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // 컴포넌트 마운트 시 데이터 가져오기
  }, []);

  //client를 선택하면 고객사정보 불러오기
  useEffect(() => {
    setSalesItems([]); 
    setSelectedProducts([]);
    setSelectedRowIndex(null); 
    const fetchClientContent = async () => {
      if (client) {
        try {
          const response = await axios.get(
            // `http://172.30.1.63:8181/salesApp/getClientContent/${client}`,
            `http://localhost:8181/salesApp/getClientContent/${client}`,
          );
          setClientBusinessNo(response.data.clientBusinessNo || '');
          setManagerName(response.data.managerName || '');
          setManagerPhone(response.data.managerPhone || '');
        } catch (error) {
          Alert.alert('Error', '고객사정보 불러오기 실패!');
        }
      } else {
        setClientBusinessNo('');
        setManagerName('');
        setManagerPhone('');
      }
    };
    fetchClientContent();
  }, [client]);

  //모달창
  const [modalIsVisible, setModalIsVisible] = useState(false);
  function startAddItem() {
    setModalIsVisible(true);
  }
  function endAddItem() {
    setModalIsVisible(false);
  }

  //선택된 상품 관리(중복등록안되게)
  const [selectedProducts, setSelectedProducts] = useState([]);
  //추가된 상품
  const [salesItems, setSalesItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const addItem = item => {
    setSalesItems([...salesItems, item]);
    setSelectedProducts([...selectedProducts, item.product]);
  };

  useEffect(() => {
    const total = salesItems.reduce((sum, item) => sum + item.amount, 0);
    setTotalAmount(total);
  }, [salesItems]);

  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const handleRowPress = index => {
    setSelectedRowIndex(index === selectedRowIndex ? null : index);
  };

  const handleDelete = () => {
    if (selectedRowIndex !== null) {
      const deletedProduct = salesItems[selectedRowIndex].product; // 삭제된 상품의 product 값 저장

      // salesItems에서 선택된 행을 삭제하고 상태 업데이트
      setSalesItems(prevItems =>
        prevItems.filter((_, index) => index !== selectedRowIndex),
      );

      // selectedProducts에서도 삭제된 상품을 제거
      setSelectedProducts(prevProducts =>
        prevProducts.filter(product => product !== deletedProduct),
      );

      setSelectedRowIndex(null);
    }
  };

  console.log('저장된 필드 값:', {
    orderSdate: formattedDate,
    employeeNo: managerName,
    clientNo: client,
    deliveryStatus: deliveryStatus,
    delivery: delivery,
    orderItems: salesItems.map(item => ({
      productNo: item.product,
      productName: item.productName,
      contractPrice: item.contractPrice,
      productQuantity: item.productQuantity,
      amount: item.amount,
    })),
  });

  //판매등록 정보들을 부모컴포넌트로 전달하기
  useEffect(() => {
    // console.log('formattedDate:', formattedDate);
    // console.log('employeeNo:', employeeNo);
    // console.log('client:', client);
    // console.log('deliveryStatus:', deliveryStatus);
    // console.log('delivery:', delivery);
    // console.log('salesItems:', salesItems);
    if (
      formattedDate &&
      // employeeNo &&
      client &&
      deliveryStatus &&
      // delivery &&
      salesItems.length > 0
    ) {
      // client와 salesItems가 유효한 경우에만 실행
      const data = {
        orderSdate: formattedDate,
        // employeeNo: employeeNo,
        clientNo: client,
        deliveryStatus: deliveryStatus,
        delivery: delivery,
        orderItems: salesItems.map(item => ({
          productNo: item.product,
          contractPrice: item.contractPrice,
          productQuantity: item.productQuantity,
          amount: item.amount,
        })),
      };
      onSaveData(data);
    } else {
      console.log('필드 값이 유효하지 않거나, 판매 항목이 없습니다.');
    }
  }, [formattedDate, employeeNo, client, deliveryStatus, delivery, salesItems]);

  //모든 필드 초기화
  function resetFields() {
    setClient(null);
    setClientBusinessNo('');
    setManagerName('');
    setManagerPhone('');
    setSalesItems([]);
    setSelectedProducts([]);
  }

  //원화 + 천원단위(,)
  const formatCurrency = amount => {
    return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원`;
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.block}>
      <Text style={styles.text}>등록일자</Text>
      <TextInput
        editable={disable}
        value={formattedDate}
        style={[styles.input, styles.inputDisabled]}
      />

      <Text style={styles.text}>고객사</Text>
      <DropDownPicker
        open={openClient}
        value={client}
        items={clientLists}
        setOpen={setOpenClient}
        setValue={setClient}
        setItems={setClientLists}
        placeholder="고객사를 선택하세요"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        listEmptyComponent={() => (
          <Text style={styles.emptyMessage}>등록된 고객사가 없습니다.</Text>
        )}
      />

      <Text style={styles.text}>사업자번호</Text>
      <TextInput
        editable={disable}
        value={clientBusinessNo}
        onChangeText={setClientBusinessNo}
        style={[styles.input, styles.inputDisabled]}
      />

      <Text style={styles.text}>담당자</Text>
      <TextInput
        editable={disable}
        value={managerName}
        onChangeText={setManagerName}
        style={[styles.input, styles.inputDisabled]}
      />

      <Text style={styles.text}>담당자 연락처</Text>
      <TextInput
        editable={disable}
        value={managerPhone}
        onChangeText={setManagerPhone}
        style={[styles.input, styles.inputDisabled]}
      />

      <View style={styles.buttonContainer}>
        <Text style={{fontSize: 16, marginTop: 6, marginLeft: 5}}>
          판매 상품
        </Text>
        <TouchableOpacity activeOpacity={0.8} onPress={startAddItem}>
          <View style={styles.buttonStyle}>
            <Image source={require('../../assets/add_white.png')} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8} onPress={handleDelete}>
          <View style={styles.deleteButtonStyle}>
            <Icon name="horizontal-rule" size={24} color="white" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.salesItemContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>상품명</Text>
          <Text style={styles.headerText}>가격</Text>
          {/* <Text style={styles.headerText}>재고</Text> */}
          <Text style={styles.headerText}>개수</Text>
          <Text style={styles.headerText}>금액</Text>
        </View>

        {salesItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tableRow,
              index === selectedRowIndex && styles.selectedRow,
            ]}
            onPress={() => handleRowPress(index)}>
            <Text style={styles.contentText}>{item.productName}</Text>
            <Text style={styles.contentText}>
              {formatCurrency(item.contractPrice)}
            </Text>
            <Text style={styles.contentText}>{item.productQuantity}</Text>
            <Text style={styles.contentText}>
              {formatCurrency(item.amount)}
            </Text>
          </TouchableOpacity>
        ))}

        <View style={styles.amountWrap}>
          <Text style={{marginLeft: 25, letterSpacing: 5}}>합계</Text>
          <TextInput
            style={styles.amount}
            editable={false}
            value={formatCurrency(totalAmount)}></TextInput>
        </View>
      </View>

      <SalesItem
        isVisible={modalIsVisible}
        onClose={endAddItem}
        onAddItem={addItem}
        clientNo={client}
        style={styles.modalContainer}
        selectedProducts={selectedProducts}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',
  },
  text: {
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 15,
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
    color: '#000',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 5,
  },
  buttonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 33,
    height: 33,
    backgroundColor: '#00569A',
    borderRadius: 4,
    marginLeft: 210,
  },
  deleteButtonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 33,
    height: 33,
    backgroundColor: '#00569A',
    borderRadius: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3e3e3',
    padding: 10,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#ced4da',
  },
  headerText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#ced4da',
    borderBottomWidth: 1,
  },
  contentText: {
    flex: 1,
    textAlign: 'center',
    padding: 10,
    height: 40,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  amountWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#ced4da',
  },
  amount: {
    height: 30,
    width: 100,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#495057',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
    marginLeft: 188,
    textAlign: 'right',
    paddingRight: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectedRow: {
    backgroundColor: '#f0f0f0',
  },
});

export default SalesWriteEditor;
