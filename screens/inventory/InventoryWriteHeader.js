import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, View, Text, Alert, ActivityIndicator} from 'react-native';
import InventoryTransparentCircleButton from './InventoryTransparentCircleButton';
import axios from 'axios';

function InventoryWriteHeader({
  supplierNo,
  setSupplierNo,
  managerName,
  setManagerName,
  managerPhone,
  setManagerPhone,
  items,
  setItems,
  loading,
  setLoading,
}) {
  const navigation = useNavigation();

  const onGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  // 초기화 버튼
  const onReset = () => {
    Alert.alert('경고 \n', '초기화하시겠습니까?\n', [
      {text: '취소', style: 'cancel'},
      {
        text: '확인',
        onPress: () => {
          setLoading(true);

          navigation.replace('InventoryWrite');
          // 데이터 초기화
          // setSupplierNo('');
          // setManagerName('');
          // setManagerPhone('');
          // setItems([]);

          setLoading(false);
          Alert.alert('초기화 완료\n', '모든 항목이 초기화되었습니다\n');
        },
      },
    ]);
  };

  // 등록
  const ConfirmCheck = async () => {
    console.log('아이템: ', items);
    if (!items || items.length === 0) {
      Alert.alert('오류\n', '등록할 상품을 추가해주세요\n');
      return;
    }
    if (!supplierNo) {
      Alert.alert('오류\n', '공급업체를 선택해주세요\n');
      return;
    }
    setLoading(false);
    try {
      const purchaseData = items.map(item => ({
        // supplierNo: supplierNo,
        productNo: item.productNo,
        purchaseQuantity: parseInt(item.purchaseQuantity),
        purchasePrice: parseInt(item.purchasePrice),
        employeeNo: 1, // 임시로 직원번호 1 설정
      }));
      console.log('구매 데이터:', purchaseData);

      const response = await axios.post(
        // 'http://localhost:8181/inventoryApp/registerPurchase',
        // 'http://172.30.1.32:8181/inventoryApp/registerPurchase',
        'http://192.168.0.10:8181/inventoryApp/registerPurchase',
        purchaseData,
      );

      Alert.alert('확인 \n', '구매를 등록하시겠습니까?\n', [
        {text: '취소', style: 'cancel'},
        {
          text: '확인',
          onPress: () => {
            setLoading(true);
            setLoading(false);
            console.log('등록 성공:', response.data);
            Alert.alert('등록 성공 \n', '구매가 성공적으로 등록되었습니다');
            onGoBack();
          },
        },
      ]);
    } catch (error) {
      console.error('등록 실패:', error);
      Alert.alert('등록 실패', '데이터 등록 중 오류가 발생했습니다');
      // }
      // } catch (error) {
      // if (error.response) {
      //   console.error('서버 응답 오류:', error.response.data);
      //   Alert.alert(
      //     '등록 실패',
      //     `오류: ${
      //       error.response.data.message || '데이터 등록 중 오류가 발생했습니다.'
      //     }`,
      //   );
      // } else if (error.request) {
      //   console.error('요청이 서버에 도달하지 못했습니다:', error.request);
      //   Alert.alert('등록 실패', '서버에 요청을 보내지 못했습니다.');
      // } else {
      //   console.error('오류 발생:', error.message);
      //   Alert.alert('등록 실패', '예기치 않은 오류가 발생했습니다.');
      // }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>데이터를 로드 중입니다</Text>
      </View>
    );
  }

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
          onPress={onReset}
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default InventoryWriteHeader;
