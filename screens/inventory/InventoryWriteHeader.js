import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, View, Text, Alert} from 'react-native';
import InventoryTransparentCircleButton from './InventoryTransparentCircleButton';
import axios from 'axios';

function InventoryWriteHeader({
  purchaseNo,
  setPurchaseNo,
  supplierNo,
  setSupplierNo,
  managerName,
  setManagerName,
  managerPhone,
  setManagerPhone,
  items,
  setItems,
  setLoading,
  employeeNo,
  onResetFields,
}) {
  const navigation = useNavigation();

  const onGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  // 초기화 버튼
  const onReset = () => {
    Alert.alert('경고', '정말로 초기화하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {
        text: '확인',
        onPress: () => {
          // setSupplierNo(null);
          // setManagerName('');
          // setManagerPhone('');
          // setItems([]);
          console.log('초기화 후 상태:', {
            supplierNo: null,
            managerName: '',
            managerPhone: '',
            items: [],
          });
          Alert.alert('초기화 완료', '모든 항목이 초기화되었습니다');
        },
      },
    ]);
  };

  // check 버튼 클릭 시 데이터 등록
  // const ConfirmCheck = async () => {
  //   if (!items.length) {
  //     Alert.alert('오류', '등록할 상품을 추가해주세요.');
  //     return;
  //   }

  //   if (!supplierNo) {
  //     Alert.alert('오류', '공급업체를 선택해주세요.');
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     const response = await axios.post(
  //       'http://192.168.0.10:8181/inventoryApp/registerPurchase',
  //       {
  //         supplierNo: supplierNo,
  //         items,
  //         employeeNo,
  //       },
  //     );
  //     console.log('등록 성공:', response.data);
  //     Alert.alert('등록 성공', '상품 구매가 성공적으로 등록되었습니다');
  //     setManagerName('');
  //     setManagerPhone('');
  //     setItems([]); // 등록 후 초기화
  //     navigation.goBack(); // 페이지로 돌아가기
  //   } catch (error) {
  //     console.error('등록 실패:', error);
  //     Alert.alert('등록 실패', '데이터 등록 중 오류가 발생했습니다');
  //   } finally {
  //     setLoading(false);
  //   }
  //   onGoBack();
  // };

  // -----------------------
  // const ConfirmCheck = async () => {
  //   console.log('현재 items:', items); // items 내용 확인용 로그

  //   if (!items || items.length === 0) {
  //     Alert.alert('오류', '등록할 상품을 추가해주세요.');
  //     return;
  //   }

  //   if (!supplierNo) {
  //     Alert.alert('오류', '공급업체를 선택해주세요.');
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const purchaseData = {
  //       supplierInfo: {
  //         supplierNo,
  //         managerName,
  //         managerPhone,
  //       },
  //       items,
  //     };

  //     const response = await axios.post(
  //       'http://192.168.0.10:8181/inventoryApp/registerPurchase',
  //       purchaseData,
  //     );

  //     console.log('등록 성공:', response.data);
  //     Alert.alert('등록 성공', '상품 구매가 성공적으로 등록되었습니다');

  //     // 등록 후 필드 초기화
  //     setSupplierNo('');
  //     setManagerName('');
  //     setManagerPhone('');
  //     setItems([]); // 초기화
  //     onGoBack();
  //   } catch (error) {
  //     console.error('등록 실패:', error);
  //     Alert.alert('등록 실패', '데이터 등록 중 오류가 발생했습니다');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const ConfirmCheck = async () => {
    if (!items || items.length === 0) {
      Alert.alert('오류', '등록할 상품을 추가해주세요.');
      return;
    }

    if (!supplierNo) {
      Alert.alert('오류', '공급업체를 선택해주세요.');
      return;
    }

    setLoading(true);
    try {
      const purchaseData = {
        supplierInfo: {
          supplierNo,
          managerName,
          managerPhone,
        },
        items: items.map(item => ({
          productNo: item.productNo,
          purchaseQuantity: parseInt(item.purchaseQuantity),
          purchasePrice: parseInt(item.purchasePrice),
        })),
      };

      const response = await axios.post(
        'http://192.168.0.10:8181/inventoryApp/registerPurchase',
        purchaseData,
      );

      console.log('등록 성공:', response.data);
      Alert.alert('등록 성공', '상품 구매가 성공적으로 등록되었습니다');

      // 초기화
      setSupplierNo(null);
      setManagerName('');
      setManagerPhone('');
      setItems([]);
      onGoBack();
    } catch (error) {
      console.error('등록 실패:', error);
      Alert.alert('등록 실패', '데이터 등록 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
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
});

export default InventoryWriteHeader;
