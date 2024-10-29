import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, View, Text, Alert} from 'react-native';
import InventoryTransparentCircleButton from './InventoryTransparentCircleButton';
import InventoryWriteEditor from './InventoryWriteEditor';
import axios from 'axios';

function InventoryWriteHeader() {
  const navigation = useNavigation();

  const onGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  function deleteReset() {
    Alert.alert('경고', '정말로 초기화하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {
        text: '확인',
        // onPress: () => {
        //   if (onRegister) {
        //     onRegister();
        //   }
        // },
      },
    ]);
  }

  const ConfirmCheck = async () => {
    // check 버튼 클릭 시 데이터 등록
    try {
      const response = await axios.post(
        'http://172.30.1.43:8181/inventoryApp/registerPurchase',
        {
          productNo: productNo,
          purchasePrice: purchasePrice,
          purchaseQuantity: purchaseQuantity,
          employeeNo: employeeNo,
        },
      );
      console.log('등록 성공:', response.data);
      navigation.goBack(); // 페이지로 돌아가기
    } catch (error) {
      console.error('등록 실패:', error);
      Alert.alert('등록 실패', '데이터 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.block}>
      <View style={styles.iconButtonWrapper}>
        <InventoryTransparentCircleButton
          onPress={onGoBack}
          name="arrow-back"
          color="#424242"
        />
      </View>
      <View>
        <Text style={styles.title}>등록</Text>
      </View>
      <View style={styles.buttons}>
        <InventoryTransparentCircleButton
          onPress={deleteReset}
          name="delete-forever"
          color="#ef5350"
          hasMarginRight
        />
        <InventoryTransparentCircleButton
          onPress={ConfirmCheck}
          name="check"
          color="#009688"
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

export default InventoryWriteHeader;
