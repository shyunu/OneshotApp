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
    const localDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    return localDate.toISOString().split('T')[0];
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

  const formatCurrency = amount => {
    if (amount == null || isNaN(amount)) return '';
    return `${amount.toLocaleString('ko-KR')} 원`;
  };

  const handleContractPriceChange = value => {
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10);
    setContractPrice(isNaN(numericValue) ? 0 : numericValue);
  };

  const handleContractPriceFocus = () => {
    // 포커스 시 숫자만 표시
    setContractPrice(prevPrice => prevPrice.toString().replace(/[^0-9]/g, ''));
  };

  const handleContractPriceBlur = () => {
    // 포커스를 벗어나면 포맷된 값으로 설정
    setContractPrice(prevPrice => (prevPrice ? formatCurrency(prevPrice) : ''));
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

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
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
              display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
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
              display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
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
          value={contractPrice ? contractPrice.toString() : ''}
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
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  block: {flex: 1, padding: 16},
  text: {fontSize: 16, marginBottom: 8},
  dropdown: {
    minHeight: 40,
    borderColor: '#ced4da',
    borderRadius: 4,
    marginBottom: 15,
  },
  dropdownContainer: {borderColor: '#ced4da'},
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
    backgroundColor: '#e3e3e3',
    borderBottomColor: '#ced4da',
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
