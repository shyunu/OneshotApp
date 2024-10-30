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
    setClientNo(null);
    setProductNo(null);
    setSelectedStartDate('');
    setSelectedEndDate('');
    setContractPrice('');
    setContractItems([]);
  };

  const onsubmit = async () => {
    setLoading(true); // 로딩 상태 활성화
    try {
      const response = await axios.post(
        'http://172.30.1.28:8181/contractApp/contract',
        {
          clientNo: clientNo,
          productNo: productNo,
          contractSdate: selectedStartDate,
          contractEdate: selectedEndDate,
          contractPrice: contractPrice,
        },
      );

      if (response.status === 201) {
        Alert.alert('Success', '계약이 성공적으로 등록되었습니다.');
      } else {
        Alert.alert('Error', '계약 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', '서버에 연결하는 데 실패했습니다.');
    } finally {
      setLoading(false); // 로딩 상태 비활성화
    }
    onGoBack();
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
