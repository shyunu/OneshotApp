import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

function ContractWriteEditor() {
  const [clientOpen, setClientOpen] = useState(false);
  const [clientValue, setClientValue] = useState(null);
  const [clientItems, setClientItems] = useState([]);

  const [productOpen, setProductOpen] = useState(false);
  const [productValue, setProductValue] = useState(null);
  const [productItems, setProductItems] = useState([]);

  const [loading, setLoading] = useState(true); // 로딩 상태 관리

  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [selectedEndDate, setSelectedEndDate] = useState('');

  // 고객사 목록과 상품 목록을 동시에 가져오는 함수
  const fetchData = async () => {
    try {
      const [clientResponse, productResponse] = await Promise.all([
        axios.get('http://172.30.1.28:8181/contractApp/getClientList'),
        axios.get('http://172.30.1.28:8181/contractApp/getProductList'),
      ]);

      setClientItems(
        clientResponse.data.map(client => ({
          label: client.clientName,
          value: client.clientNo,
        })),
      );

      setProductItems(
        productResponse.data.map(product => ({
          label: product.productName,
          value: product.productNo,
        })),
      );
    } catch (error) {
      Alert.alert('Error', '데이터를 가져오는 데 실패했습니다.');
      console.log(error);
    } finally {
      setLoading(false); // 데이터 로딩 완료 후 로딩 상태 변경
    }
  };

  useEffect(() => {
    fetchData(); // 컴포넌트 마운트 시 데이터 가져오기
  }, []);

  const showStartDatePicker = () => setStartDatePickerVisibility(true);
  const hideStartDatePicker = () => setStartDatePickerVisibility(false);

  const handleStartConfirm = date => {
    setSelectedStartDate(date.toISOString().split('T')[0]);
    hideStartDatePicker();
  };

  const showEndDatePicker = () => setEndDatePickerVisibility(true);
  const hideEndDatePicker = () => setEndDatePickerVisibility(false);

  const handleEndConfirm = date => {
    setSelectedEndDate(date.toISOString().split('T')[0]);
    hideEndDatePicker();
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
      <Text style={styles.text}>고객사</Text>
      <DropDownPicker
        open={clientOpen}
        value={clientValue}
        items={clientItems}
        setOpen={setClientOpen}
        setValue={setClientValue}
        setItems={setClientItems}
        placeholder="고객사를 선택하세요"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        listEmptyComponent={() => (
          <Text style={styles.emptyMessage}>등록된 고객사가 없습니다.</Text>
        )}
        zIndex={3000}
        zIndexInverse={1000}
      />

      <Text style={styles.text}>상품</Text>
      <DropDownPicker
        open={productOpen}
        value={productValue}
        items={productItems}
        setOpen={setProductOpen}
        setValue={setProductValue}
        setItems={setProductItems}
        placeholder="상품을 선택하세요"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        listEmptyComponent={() => (
          <Text style={styles.emptyMessage}>등록된 상품이 없습니다.</Text>
        )}
        zIndex={2000}
        zIndexInverse={1000}
      />

      <Text style={styles.text}>계약가격</Text>
      <TextInput
        style={styles.contractPriceTextInput}
        placeholder="계약가격을 입력하세요"
      />

      <Text style={styles.text}>
        {'계약시작일                                 계약종료일'}
      </Text>
      <View style={styles.dateBox}>
        <View style={styles.dateBox}>
          <TextInput
            style={styles.contractDateTextInput}
            value={selectedStartDate}
            placeholder="YYYY-MM-DD"
            editable={false}
          />
          <TouchableOpacity
            style={styles.dateButton}
            onPress={showStartDatePicker}>
            <Icon name="event-available" size={24} style={styles.icon} />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isStartDatePickerVisible}
            mode="date"
            onConfirm={handleStartConfirm}
            onCancel={hideStartDatePicker}
          />
        </View>
        <Text>{'   '}</Text>
        <View style={styles.dateBox}>
          <TextInput
            style={styles.contractDateTextInput}
            value={selectedEndDate}
            placeholder="YYYY-MM-DD"
            editable={false}
          />
          <TouchableOpacity
            style={styles.dateButton}
            onPress={showEndDatePicker}>
            <Icon name="event-available" size={24} style={styles.icon} />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isEndDatePickerVisible}
            mode="date"
            onConfirm={handleEndConfirm}
            onCancel={hideEndDatePicker}
          />
        </View>
      </View>
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
  dropdown: {
    minHeight: 40,
    borderColor: '#ced4da',
    borderRadius: 4,
    marginBottom: 10,
  },
  dropdownContainer: {
    borderColor: '#ced4da',
  },
  emptyMessage: {
    textAlign: 'center',
    paddingVertical: 10,
    color: 'gray',
    fontSize: 16,
  },
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contractPriceTextInput: {
    height: 40,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  contractDateTextInput: {
    height: 40,
    width: 120,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  dateButton: {
    minHeight: 40,
    backgroundColor: '#00569A',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  icon: {
    color: 'white',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ContractWriteEditor;
