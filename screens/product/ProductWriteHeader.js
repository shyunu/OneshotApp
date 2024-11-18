import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, View, Text, Alert, ActivityIndicator} from 'react-native';
import axios from 'axios';
import ProductTransparentCircleButton from './ProductTransparentCircleButton';

function ProductWriteHeader({
  supplierNo,
  categoryNo,
  productName,
  productPrice,
  safetyQuantity,
  productImgApp,
  items,
  loading,
  setLoading,
  setSupplierNo,
  setCategoryNo,
  setProductName,
  setProductPrice,
  setSafetyQuantity,
  setProductImgApp,
  setitems,
}) {
  const navigation = useNavigation();

  const onGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const onReset = () => {
    Alert.alert('경고 \n', '초기화하시겠습니까?\n', [
      {text: '취소', style: 'cancel'},
      {
        text: '확인',
        onPress: () => {
          setLoading(true);
          navigation.replace('ProductWrite');
          setLoading(false);
          // setLoading(true);
          // setSupplierNo(null);
          // setCategoryNo(null);
          // setProductName('');
          // setProductPrice('');
          // setSafetyQuantity('');
          // setProductImg(null);
          // setLoading(false);
          Alert.alert('초기화 완료\n', '모든 항목이 초기화되었습니다\n');
        },
      },
    ]);
  };

  const ConfirmCheck = async () => {
    // console.log('supplierNo:', supplierNo);
    // console.log('categoryNo:', categoryNo);
    // console.log('productName:', productName);
    // console.log('productPrice:', productPrice);
    // console.log('safetyQuantity:', safetyQuantity);
    // console.log('productImgApp:', productImgApp);
    console.log('아이템: ', items);

    if (!items || items.length === 0) {
      Alert.alert('오류\n', '등록할 상품을 추가해주세요\n');
      return;
    }

    if (
      !supplierNo ||
      !categoryNo ||
      !productName ||
      !productPrice ||
      !safetyQuantity ||
      !productImgApp
    ) {
      Alert.alert('경고\n', '모든 필드를 입력해주세요\n');
      return;
    }

    // 중복 확인
    // const duplicateItems = items.filter(
    //   (item, index, self) =>
    //     index !==
    //     self.findIndex(
    //       t =>
    //         t.supplierNo === item.supplierNo &&
    //         t.categoryNo === item.categoryNo &&
    //         t.productName === item.productName,
    //     ),
    // );

    // if (duplicateItems.length > 0) {
    //   Alert.alert(
    //     '경고',
    //     '중복된 상품이 있습니다. 중복된 항목을 제거하고 다시 시도해주세요.',
    //   );
    //   return;
    // }

    try {
      // 이미지 파일
      const imageFile = {
        uri: productImgApp.uri,
        type: 'image/jpeg',
        name: 'image.jpg',
      };

      // 상품 데이터
      const productData = {
        supplierNo: parseInt(supplierNo),
        categoryNo: parseInt(categoryNo),
        productName,
        productPrice: parseInt(productPrice.replace(/,/g, '')),
        safetyQuantity: parseInt(safetyQuantity.replace(/,/g, '')),
      };

      // FormData 생성
      const formData = new FormData();
      formData.append('vo', JSON.stringify(productData));
      formData.append('file', imageFile);

      // 요청 설정
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          console.log('Upload Progress:', percentCompleted);
        },
      };

      const response = await axios.post(
        // 'http://172.30.1.32:8181/productApp/postProduct',
        'http://localhost:8181/productApp/postProduct',
        // 'http://192.168.0.10:8181/productApp/postProduct',
        formData,
        config,
      );

      if (response.status === 201) {
        Alert.alert('확인 \n', '상품을 등록하시겠습니까?\n', [
          {text: '취소', style: 'cancel'},
          {
            text: '확인',
            onPress: () => {
              console.log('등록 성공:', response.data);
              Alert.alert('등록 성공 \n', '상품이 성공적으로 등록되었습니다');
              onGoBack();
            },
          },
        ]);
      }
    } catch (error) {
      console.error('처리 중 오류: ', error);
      Alert.alert(
        '오류\n',
        '처리 중 문제가 발생했습니다. 네트워크 연결을 확인해주세요.\n' +
          (error.response ? `오류 코드: ${error.response.status}` : ''),
      );
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
        <ProductTransparentCircleButton
          onPress={onGoBack}
          name="arrow-back"
          color="#424242"
        />
      </View>
      <View>
        <Text style={styles.title}>등록</Text>
      </View>
      <View style={styles.buttons}>
        <ProductTransparentCircleButton
          onPress={onReset}
          name="delete-forever"
          color="#ef5350"
          hasMarginRight
        />
        <ProductTransparentCircleButton
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

export default ProductWriteHeader;
