import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

function ContractWriteEditor({
  clientNo,
  setClientNo,
  productNo,
  setProductNo,
  selectedStartDate,
  setSelectedStartDate,
  selectedEndDate,
  setSelectedEndDate,
  contractPrice,
  setContractPrice,
  imageUri,
  setImageUri,
  contractItems,
  setContractItems,
  loading,
  setLoading,
}) {
  //고객사
  const [clientOpen, setClientOpen] = useState(false);
  const [clientItems, setClientItems] = useState([]);

  //상품
  const [productOpen, setProductOpen] = useState(false);
  const [productItems, setProductItems] = useState([]);

  //계약 시작 및 종료일
  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

  // 고객사 및 상품 목록 가져오기
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
      console.log(error);
      Alert.alert('Error', '데이터를 가져오는 데 실패했습니다.');
    } finally {
      setLoading(false); // 데이터 로딩 완료 후 로딩 상태 변경
    }
  };

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    fetchData();
  }, []);

  const onChangeClientAndProduct = async () => {
    if (clientNo != null && productNo != null) {
      try {
        const response = await axios.get(
          'http://172.30.1.28:8181/contractApp/getContractList',
          {
            params: {
              clientNo: clientNo,
              productNo: productNo,
            },
          },
        );
        const updatedItems = response.data.map(item => ({
          ...item,
          contractSdate: convertToLocalDate(item.contractSdate),
          contractEdate: convertToLocalDate(item.contractEdate),
        }));
        setContractItems(updatedItems);
      } catch (error) {
        console.log(error);
        Alert.alert('Error', '데이터를 가져오는 데 실패했습니다.');
      } finally {
        setLoading(false); // 데이터 로딩 완료 후 로딩 상태 변경
      }
    }
  };

  // 서버의 UTC 날짜를 로컬 시간(KST)으로 변환
  const convertToLocalDate = utcDate => {
    const date = new Date(utcDate); // 서버로부터 받은 UTC 날짜
    const localDate = new Date(date.getTime() + 9 * 60 * 60 * 1000); // KST(UTC+9) 적용
    return localDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 반환
  };

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

  const formatDate = date => {
    if (!date) return '';
    const validDate = new Date(date);
    if (isNaN(validDate)) return '-';
    return validDate.toISOString().split('T')[0];
  };

  const formatCurrency = amount => {
    if (isNaN(amount) || amount === null) return '- 원';
    return `${parseInt(amount, 10)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 원`;
  };

  const [fileName, setFileName] = useState('');

  const selectImage = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (!response.didCancel && !response.errorCode) {
        const asset = response.assets[0];

        // 파일 이름이 존재하는 경우 사용
        if (asset.fileName) {
          setFileName(asset.fileName);
        } else {
          // 파일 이름이 없는 경우 URI에서 추출
          const uriParts = asset.uri.split('/');
          setFileName(uriParts[uriParts.length - 1]);
        }

        setImageUri(asset.uri);
      }
    });
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
        value={clientNo}
        items={clientItems}
        setOpen={setClientOpen}
        setValue={setClientNo}
        setItems={setClientItems}
        placeholder="고객사를 선택하세요"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        zIndex={3000}
        zIndexInverse={1000}
        onChangeValue={onChangeClientAndProduct}
      />
      <Text style={styles.text}>상품</Text>
      <DropDownPicker
        open={productOpen}
        value={productNo}
        items={productItems}
        setOpen={setProductOpen}
        setValue={setProductNo}
        setItems={setProductItems}
        placeholder="상품을 선택하세요"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        zIndex={2000}
        zIndexInverse={1000}
        onChangeValue={onChangeClientAndProduct}
      />
      <Text style={styles.text}>
        {'계약시작일                             계약종료일'}
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
            style={styles.contractDateButton}
            onPress={showStartDatePicker}>
            <Icon name="event-available" size={24} style={styles.icon} />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isStartDatePickerVisible}
            mode="date"
            maximumDate={
              selectedEndDate ? new Date(selectedEndDate) : undefined
            }
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
            style={styles.contractDateButton}
            onPress={showEndDatePicker}>
            <Icon name="event-available" size={24} style={styles.icon} />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isEndDatePickerVisible}
            mode="date"
            minimumDate={
              selectedStartDate ? new Date(selectedStartDate) : undefined
            }
            onConfirm={handleEndConfirm}
            onCancel={hideEndDatePicker}
          />
        </View>
      </View>
      <Text style={styles.text}>계약가격</Text>
      <TextInput
        style={styles.contractPriceTextInput}
        placeholder="계약가격을 입력하세요"
        keyboardType="numeric"
        value={contractPrice}
        onChangeText={setContractPrice}
      />
      <Text style={styles.text}>첨부파일</Text>
      <View style={styles.contractFileBox}>
        <TextInput
          style={styles.contractFileTextInput}
          value={fileName}
          placeholder="등록된 계약서가 없습니다."
          editable={false}
        />
        <TouchableOpacity
          style={styles.contractFileButton}
          onPress={selectImage}>
          <Icon name="upload" size={24} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <Text style={styles.text}>계약내역</Text>
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>계약시작일</Text>
          <Text style={styles.tableHeaderText}>계약종료일</Text>
          <Text style={styles.tableHeaderText}>계약가격</Text>
        </View>
        <ScrollView style={styles.tableBody}>
          {contractItems && contractItems.length > 0 ? (
            contractItems.map(item => (
              <View key={item.contractPriceNo} style={styles.tableRow}>
                <Text style={styles.tableCell}>
                  {formatDate(item.contractSdate)}
                </Text>
                <Text style={styles.tableCell}>
                  {formatDate(item.contractEdate)}
                </Text>
                <Text style={styles.tableCell}>
                  {formatCurrency(item.contractPrice)}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>계약내역이 없습니다</Text>
            </View>
          )}
        </ScrollView>
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
    fontSize: 16,
    marginBottom: 8,
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

  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  contractPriceTextInput: {
    height: 40,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 15,
  },

  contractDateTextInput: {
    height: 40,
    width: 120,
    color: '#000000',
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  contractDateButton: {
    minHeight: 40,
    backgroundColor: '#00569A',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  contractFileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  contractFileTextInput: {
    height: 40,
    width: 305,
    color: '#000000',
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  contractFileButton: {
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

  // 테이블 화면
  tableHeader: {
    flexDirection: 'row',
    height: 40,
    padding: 10,
    backgroundColor: '#e3e3e3',
    borderBottomColor: '#ced4da',
    borderBottomWidth: 1,
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
    borderBottomWidth: 1,
    borderBottomColor: '#ced4da',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    height: 40,
    padding: 10,
  },
});

export default ContractWriteEditor;
