import React, {useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import ProductWriteHeader from './ProductWriteHeader';
import ProductWriteEditor from './ProductWriteEditor';

function ProductWriteScreen() {
  const [supplierNo, setSupplierNo] = useState(null);
  const [categoryNo, setCategoryNo] = useState(null);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [safetyQuantity, setSafetyQuantity] = useState('');
  const [productImgApp, setProductImgApp] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  // 디버깅 useEffect
  useEffect(() => {
    console.log('State 변경됨:', {
      supplierNo,
      categoryNo,
      productName,
      productPrice,
      safetyQuantity,
      productImgApp,
      items,
    });
  }, [
    supplierNo,
    categoryNo,
    productName,
    productPrice,
    safetyQuantity,
    productImgApp,
    items,
  ]);

  // 아이템 상태 업데이트 useEffect
  useEffect(() => {
    console.log('항목 업데이트 시도:', {
      supplierNo,
      categoryNo,
      productName,
      productPrice,
      safetyQuantity,
      productImgApp,
    });

    if (
      supplierNo &&
      categoryNo &&
      productName &&
      productPrice &&
      safetyQuantity &&
      productImgApp
    ) {
      const newItem = {
        supplierNo: Number(supplierNo),
        categoryNo: Number(categoryNo),
        productName,
        productPrice: productPrice.replace(/[^0-9]/g, ''),
        safetyQuantity: safetyQuantity.replace(/[^0-9]/g, ''),
        productImgApp: productImgApp.uri, // uri만 저장
      };
      console.log('새로운 아이템 생성:', newItem);
      setItems(prevItems => [...prevItems, newItem]);
    }
  }, [
    supplierNo,
    categoryNo,
    productName,
    productPrice,
    safetyQuantity,
    productImgApp,
  ]);

  const handleProductPriceChange = value => {
    console.log('가격 변경:', value);
    // 숫자와 쉼표만 허용
    const numberOnly = value.replace(/[^0-9,]/g, '');
    // 쉼표 처리
    const formatted = numberOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    setProductPrice(formatted);
  };

  const handleSafetyQuantityChange = value => {
    console.log('수량 변경:', value);
    const numberOnly = value.replace(/[^0-9]/g, '');
    setSafetyQuantity(numberOnly);
  };

  const handleImageSelect = image => {
    console.log('이미지 선택:', image);
    if (typeof image === 'string') {
      // 문자열로 들어온 경우 객체로 변환
      setProductImgApp({
        uri: image,
        type: 'image/jpeg',
        name: image.split('/').pop(),
      });
    } else {
      setProductImgApp(image);
    }
  };

  return (
    <SafeAreaView style={styles.block}>
      <ProductWriteHeader
        supplierNo={supplierNo}
        categoryNo={categoryNo}
        productName={productName}
        productPrice={productPrice}
        safetyQuantity={safetyQuantity}
        productImgApp={productImgApp}
        items={items}
        loading={loading}
        setLoading={setLoading}
        setSupplierNo={setSupplierNo}
        setCategoryNo={setCategoryNo}
        setProductName={setProductName}
        setProductPrice={handleProductPriceChange}
        setSafetyQuantity={handleSafetyQuantityChange}
        setProductImgApp={setProductImgApp} // 상태 업데이트 함수
        handleImageSelect={handleImageSelect} // 이미지 선택 함수 전달
      />
      <ProductWriteEditor
        supplierNo={supplierNo}
        categoryNo={categoryNo}
        productName={productName}
        productPrice={productPrice}
        safetyQuantity={safetyQuantity}
        setSupplierNo={setSupplierNo}
        setCategoryNo={setCategoryNo}
        setProductName={setProductName}
        setProductPrice={handleProductPriceChange}
        setSafetyQuantity={handleSafetyQuantityChange}
        setProductImgApp={handleImageSelect}
        items={items}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default ProductWriteScreen;
