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
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';
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
  setImageUri,
  fileName,
  setFileName,
  setFileType,
  contractItems,
  setContractItems,
  loading,
  setLoading,
}) {
  const [clientOpen, setClientOpen] = useState(false);
  const [clientItems, setClientItems] = useState([]);
  const [productOpen, setProductOpen] = useState(false);
  const [productItems, setProductItems] = useState([]);
  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [displayPrice, setDisplayPrice] = useState(''); // 포맷팅된 문자열을 위한 상태
  const fetchData = async () => {
    try {
      const [clientResponse, productResponse] = await Promise.all([
        // axios.get('http://172.30.1.28:8181/contractApp/getClientList'),
        axios.get('http://192.168.0.10:8181/contractApp/getClientList'),
        // axios.get('http://172.30.1.28:8181/contractApp/getProductList'),
        axios.get('http://192.168.0.10:8181/contractApp/getProductList'),
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const onChangeClientAndProduct = async () => {
    if (clientNo != null && productNo != null) {
      try {
        const response = await axios.get(
          'http://172.30.1.28:8181/contractApp/getContractPriceByClientNoAndProductNo',
          //'http://localhost:8181/contractApp/getContractPriceByClientNoAndProductNo',
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
        setLoading(false);
      }
    }
  };

  const convertToLocalDate = utcDate => {
    const date = new Date(utcDate);
    const localDate = new Date(date.getTime() + 9 * 60 * 60 * 1000); // 한국 시간으로 변환
    return localDate.toISOString().split('T')[0]; // "YYYY-MM-DD" 형식으로 반환
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

  const handleContractPriceChange = value => {
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10);
    setContractPrice(isNaN(numericValue) ? 0 : numericValue);
    setDisplayPrice(value.replace(/[^0-9]/g, '')); // 입력 중에는 숫자만 표시
  };

  const handleContractPriceFocus = () => {
    setDisplayPrice(contractPrice.toString()); // 포커스 시 숫자만 표시
  };

  const handleContractPriceBlur = () => {
    setDisplayPrice(`${contractPrice.toLocaleString('ko-KR')} 원`); // 포커스를 벗어나면 포맷된 값으로 설정
  };
  const selectImage = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (!response.didCancel && !response.errorCode) {
        const asset = response.assets[0];
        setImageUri(asset.uri);
        setFileName(asset.fileName);
        setFileType(asset.type);
      }
    });
  };

  const formatCurrency = amount => {
    if (amount == null || isNaN(amount)) return '';
    return `${amount.toLocaleString('ko-KR')} 원`;
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000FF" />
      </View>
    );
  }
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
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
          <DatePicker
            modal
            open={isStartDatePickerVisible}
            date={selectedStartDate ? new Date(selectedStartDate) : new Date()}
            mode="date"
            maximumDate={
              selectedEndDate ? new Date(selectedEndDate) : undefined
            }
            onConfirm={handleStartConfirm}
            onCancel={hideStartDatePicker}
          />
          <Text>{'   '}</Text>
          <View style={styles.dateBox}>
            <TextInput
              style={styles.contractDateTextInputEnd}
              value={selectedEndDate}
              placeholder="YYYY-MM-DD"
              editable={false}
            />
            <TouchableOpacity
              style={styles.contractDateButtonEnd}
              onPress={showEndDatePicker}>
              <Icon name="event-available" size={24} style={styles.icon} />
            </TouchableOpacity>
            <DatePicker
              modal
              open={isEndDatePickerVisible}
              date={selectedEndDate ? new Date(selectedEndDate) : new Date()}
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
          value={displayPrice}
          onFocus={handleContractPriceFocus}
          onBlur={handleContractPriceBlur}
          onChangeText={handleContractPriceChange}
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
                  <Text style={styles.tableCell}>{item.contractSdate}</Text>
                  <Text style={styles.tableCell}>{item.contractEdate}</Text>
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
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  block: {flex: 1, padding: 16},
  text: {fontSize: 16, marginBottom: 8},
  dropdown: {
    minHeight: 40,
    borderColor: '#CED4DA',
    borderRadius: 4,
    marginBottom: 15,
  },

  dropdownContainer: {borderColor: '#ced4da'},
  dateBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -8,
    marginBottom: 8,
    marginTop: -8,
  },
  contractPriceTextInput: {
    height: 40,
    borderColor: '#CED4DA',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  contractDateTextInput: {
    height: 40,
    width: 120,
    color: '#000000',
    borderColor: '#CED4DA',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  contractDateTextInputEnd: {
    height: 40,
    width: 120,
    color: '#000000',
    borderColor: '#CED4DA',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginRight: 8,
    marginTop: 10,
  },
  contractDateTextInputEnd: {
    height: 40,
    width: 120,
    color: '#000000',
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginTop: 10,
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
  contractDateButtonEnd: {
    minHeight: 40,
    backgroundColor: '#00569A',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginTop: 10,
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
    borderColor: '#CED4DA',
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

  icon: {color: 'white'},
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    height: 40,
    padding: 10,
    backgroundColor: '#E3E3E3',
    borderBottomColor: '#CED4DA',
    borderBottomWidth: 1,
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableBody: {maxHeight: 150},
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#CED4DA',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    height: 40,
    padding: 10,
  },
});
export default ContractWriteEditor;
