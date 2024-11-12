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
    Alert.alert('경고 \n', '초기화하시겠습니까?', [
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
          Alert.alert('초기화 완료', '모든 항목이 초기화되었습니다');
        },
      },
    ]);
  };

  const ConfirmCheck = async () => {
    console.log('supplierNo:', supplierNo);
    console.log('categoryNo:', categoryNo);
    console.log('productName:', productName);
    console.log('productPrice:', productPrice);
    console.log('safetyQuantity:', safetyQuantity);
    console.log('productImgApp:', productImgApp);
    console.log('아이템: ', items);

    // 값이 비어있는지 확인
    if (!items || items.length === 0) {
      Alert.alert('오류', '등록할 상품을 추가해주세요');
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
      Alert.alert('경고', '모든 필드를 입력해주세요');
      return;
    }

    try {
      Alert.alert('확인 \n', '상품을 등록하시겠습니까?', [
        {text: '취소', style: 'cancel'},
        {
          text: '확인',
          onPress: async () => {
            try {
              setLoading(true);
              const formData = new FormData();

              if (productImgApp && productImgApp.uri) {
                formData.append('file', {
                  uri: productImgApp.uri,
                  type: productImgApp.type || 'image/jpeg', // 기본 이미지 타입을 'image/jpeg'로 설정
                  name: productImgApp.name || 'image.jpg', // 이름이 없다면 기본 파일명 설정
                });
              } else {
                Alert.alert('오류', '이미지 파일을 첨부해주세요');
                return;
              }

              const productData = {
                supplierNo: parseInt(supplierNo),
                categoryNo: parseInt(categoryNo),
                productName,
                productPrice: parseInt(productPrice.replace(/,/g, '')),
                safetyQuantity: parseInt(safetyQuantity.replace(/,/g, '')),
              };

              formData.append('vo', JSON.stringify(productData));

              const response = await axios.post(
                'http://172.30.1.21:8181/productApp/postProduct',
                formData,
                {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                },
              );

              console.log('등록 성공:', response.data);
              Alert.alert('등록 성공 \n', '상품이 성공적으로 등록되었습니다');
              onGoBack();
              // } catch (error) {
              //   console.error('등록 실패: ', error.response || error);
              //   Alert.alert(
              //     '등록 실패',
              //     `데이터 등록 중 오류가 발생했습니다: ${
              //       error.response?.data?.message || error.message
              //     }`,
              //   );
              // }
            } catch (error) {
              if (error.response) {
                console.error('서버 응답 오류:', error.response.data);
                Alert.alert(
                  '등록 실패',
                  `오류: ${
                    error.response.data.message ||
                    '데이터 등록 중 오류가 발생했습니다.'
                  }`,
                );
              } else if (error.request) {
                console.error(
                  '요청이 서버에 도달하지 못했습니다:',
                  error.request,
                );
                Alert.alert('등록 실패', '서버에 요청을 보내지 못했습니다.');
              } else {
                console.error('오류 발생:', error.message);
                Alert.alert('등록 실패', '예기치 않은 오류가 발생했습니다.');
              }
            } finally {
              setLoading(false);
            }
          },
        },
      ]);
    } catch (error) {
      console.error('처리 중 오류: ', error);
      Alert.alert('오류', '처리 중 문제가 발생했습니다');
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
