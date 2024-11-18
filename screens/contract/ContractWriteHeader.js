import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, View, Text, Alert} from 'react-native';
import ContractTransparentCircleButton from './ContractTransparentCircleButton';
import axios from 'axios';

function ContractWriteHeader({
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
  fileName,
  setFileName,
  fileType,
  setFileType,
  contractItems,
  setContractItems,
  loading,
  setLoading,
}) {
  const navigation = useNavigation();

  const onGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.pop();
    }
  };

  const onReset = () => {
    Alert.alert(
      '경고\n',
      '초기화하시겠습니까?\n',
      [
        {text: '취소', style: 'cancel'},
        {
          text: '확인',
          onPress: () => {
            setClientNo(null);
            setProductNo(null);
            setSelectedStartDate('');
            setSelectedEndDate('');
            setContractPrice('');
            setContractItems([]);
            setImageUri(null);
            setFileName('');
            setFileType('');
          },
        },
      ],
      {cancelable: false},
    );
  };

  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    name: fileName,
    type: fileType,
  });
  formData.append('clientNo', clientNo);
  formData.append('productNo', productNo);
  formData.append('selectedStartDate', selectedStartDate);
  formData.append('selectedEndDate', selectedEndDate);
  formData.append('contractPrice', contractPrice);

  const onSubmitConfirmed = async () => {
    setLoading(true); // 로딩 상태 활성화
    try {
      const response = await axios.post(
        'http://172.30.1.28:8181/contractApp/contract',
        formData,
        {headers: {'Content-Type': 'multipart/form-data'}},
      );

      if (response.status === 201) {
        Alert.alert('등록 성공\n', '계약이 성공적으로 등록되었습니다\n');
      } else {
        Alert.alert('등록 실패\n', '계약 등록에 실패했습니다\n');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', '서버에 연결하는 데 실패했습니다');
    } finally {
      setLoading(false); // 로딩 상태 비활성화
    }
    onGoBack();
  };

  const onsubmit = () => {
    if (clientNo == null || clientNo == '') {
      Alert.alert('확인\n', '모든 내용을 입력해 주세요\n');
    } else {
      Alert.alert('확인\n', '계약을 등록하시겠습니까?\n', [
        {text: '취소', style: 'cancel'},
        {text: '확인', onPress: onSubmitConfirmed},
      ]);
    }
  };

  return (
    <View style={styles.block}>
      <View style={styles.iconButtonWrapper}>
        <ContractTransparentCircleButton
          onPress={onGoBack}
          name="arrow-back"
          color="#424242"
        />
      </View>
      <View>
        <Text style={styles.title}>등록</Text>
      </View>
      <View style={styles.buttons}>
        <ContractTransparentCircleButton
          name="delete-forever"
          color="#ef5350"
          hasMarginRight
          onPress={onReset}
        />
        <ContractTransparentCircleButton
          name="check"
          color="#009688"
          onPress={onsubmit}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    height: 55,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 20,
    color: '#000000',
    marginLeft: 35,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ContractWriteHeader;
