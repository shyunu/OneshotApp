import {useNavigation} from '@react-navigation/native';
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

function SalesWriteEditor() {
  const nextInputRef = useRef(); // 다음 필드 참조
  const [disable, setDisabled] = useState(false); //textinput disabled처리

  // 등록일자
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const formattedDate = `${year}년 ${month}월 ${day}일`;

  //고객사정보
  const [clientBusinessNo, setClientBusinessNo] = useState('');
  const [managerName, setManagerName] = useState('');
  const [managerPhone, setManagerPhone] = useState('');

  // 고객사
  const [client, setClient] = useState(null);
  const [openClient, setOpenClient] = useState(false);
  const [clientLists, setClientLists] = useState([]);

  const [loading, setLoading] = useState(true); // 로딩 상태

  const fetchData = async () => {
    try {
      const clientResponse = await axios.get(
        'http://172.30.1.63:8181/salesApp/getClientList',
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
    const fetchClientContent = async () => {
      if (client) {
        try {
          const response = await axios.get(
            `http://172.30.1.63:8181/salesApp/getClientContent/${client}`,
          );
          setClientBusinessNo(response.data.clientBusinessNo || '');
          setManagerName(response.data.managerName || '');
          setManagerPhone(response.data.managerPhone || '');
        } catch (error) {
          Alert.alert('Error', '고객사정보 불러오기 실패!');
        }
      } else {
        // 클라이언트가 선택되지 않았을 때 초기화
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

  //추가된 상품
  const [salesItems, setSalesItems] = useState([]);
  const addItem = item => {
    setSalesItems([...salesItems, item]);
  };

  //모든 필드 초기화
  function resetFields() {
    setClient(null);
    setClientBusinessNo('');
    setManagerName('');
    setManagerPhone('');
    setSalesItems([]);
  }

  //필드를 초기화할 것인지 물어보기
  function onAskReset() {
    Alert.alert('초기화', '정말로 초기화하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {
        text: '초기화',
        onPress: resetFields,
        style: 'destructive',
      },
    ]);
  }

  //원화 + 천원단위(,)
  const formatCurrency = amount => {
    return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 원`;
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
        <TouchableOpacity activeOpacity={0.5} onPress={startAddItem}>
          <View style={styles.buttonStyle}>
            <Image source={require('../../assets/add_white.png')} />
          </View>
        </TouchableOpacity>
      </View>
      <SalesItem
        isVisible={modalIsVisible}
        onClose={endAddItem}
        onAddItem={addItem}
        clientNo={client}
      />

      <View style={styles.salesItemContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>상품명</Text>
          <Text style={styles.headerText}>가격</Text>
          <Text style={styles.headerText}>재고</Text>
          <Text style={styles.headerText}>개수</Text>
          <Text style={styles.headerText}>금액</Text>
        </View>

        {salesItems.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={styles.contentText}>{item.valueProduct}</Text>
            <Text style={styles.contentText}>
              {formatCurrency(item.contractPrice)}
            </Text>
            <Text style={styles.contentText}>{item.inventoryQuantity}</Text>
            <Text style={styles.contentText}>{item.quantity}</Text>
            <Text style={styles.contentText}>
              {formatCurrency(item.amount)}
            </Text>
          </View>
        ))}
      </View>
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
    marginBottom: 10,
  },
  input: {
    height: 40,
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
    backgroundColor: '#f5f3f4',
  },
  dropdown: {
    minHeight: 40,
    borderColor: '#ced4da',
    borderRadius: 4,
    marginBottom: 10,
  },
  dropdownContainer: {
    borderColor: '#ced4da',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 25,
    height: 25,
    backgroundColor: '#e3e3e3',
    borderRadius: 7,
  },
  salesItemContainer: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f3f4',
    padding: 10,
  },
  headerText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomColor: '#f5f3f4',
    borderBottomWidth: 1,
  },
  contentText: {
    flex: 1,
    textAlign: 'center',
    padding: 4,
  },
});

export default SalesWriteEditor;
