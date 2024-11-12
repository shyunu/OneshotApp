import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  FlatList,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import {launchImageLibrary} from 'react-native-image-picker';

function ProductWriteEditor({
  supplierNo,
  categoryNo,
  productName,
  productPrice,
  safetyQuantity,
  setSupplierNo,
  setCategoryNo,
  setProductName,
  setProductPrice,
  setPurchasePrice,
  setSafetyQuantity,
  setProductImgApp,
  items = [], // 기본값으로 빈 배열을 할당
}) {
  // 공급업체
  const [openSupplier, setOpenSupplier] = useState(false);
  const [valueSupplier, setValueSupplier] = useState(null);
  const [supplierItems, setSupplierItems] = useState([]);

  // 공급업체 정보
  const [supplierBusinessNo, setSupplierBusinessNo] = useState('');
  const [managerName, setManagerName] = useState('');
  const [managerPhone, setManagerPhone] = useState('');

  // 카테고리
  const [openCategory, setOpenCategory] = useState(false);
  const [valueCategory, setValueCategory] = useState(null);
  const [categoryItems, setCategoryItems] = useState([]);

  // 상품
  const [valueProduct, setValueProduct] = useState(null);
  const [productItems, setProductItems] = useState([]);

  const [imageUri, setImageUri] = useState(null);
  // const [productImgApp, setProductImgApp] = useState({
  //   uri: '',
  //   type: 'image/jpeg',
  //   fileName: 'image.jpg',
  // });

  const [displayProductPrice, setDisplayProductPrice] = useState('');
  const [displaySafetyQuantity, setDisplaySafetyQuantity] = useState('');

  const [loading, setLoading] = useState(true); // 로딩 상태 관리

  // 로딩
  // if (loading) {
  //   return (
  //     <View style={styles.loader}>
  //       <ActivityIndicator size="large" color="#0000ff" />
  //       <Text>데이터를 로드 중입니다</Text>
  //     </View>
  //   );
  // }

  // 공급업체 선택 시
  const handleSupplierChange = value => {
    setValueSupplier(value);
    setSupplierNo(value);
  };

  // 카테고리 선택 시
  const handleCategoryChange = value => {
    setValueCategory(value);
    setCategoryNo(value);
  };

  // 상품명 변경 시
  const handleProductNameChange = value => {
    setValueProduct(value);
    setProductName(value);
  };

  const handleInputChange = (type, value) => {
    // 숫자만 추출
    const numericValue = value.replace(/[^0-9]/g, '');

    if (type === 'productPrice') {
      // 실제 값
      setProductPrice(numericValue);
      // 표시용 값
      setDisplayProductPrice(
        numericValue ? formatNumber(numericValue) + '원' : '',
      );
    } else if (type === 'safetyQuantity') {
      setSafetyQuantity(numericValue);
      setDisplaySafetyQuantity(
        numericValue ? formatNumber(numericValue) + '개' : '',
      );
    }
  };

  // const [selectedImage, setSelectedImage] = useState(null);

  // const handleImageSelect = () => {
  //   launchImageLibrary(
  //     {
  //       mediaType: 'photo',
  //       quality: 1,
  //     },
  //     response => {
  //       if (response.didCancel) {
  //         console.log('User cancelled image picker');
  //       } else if (response.errorCode) {
  //         console.log('ImagePicker Error: ', response.errorMessage);
  //       } else {
  //         const selectedImage = response.assets[0];
  //         console.log('선택된 이미지:', selectedImage);

  //         setProductImgApp({
  //           uri: selectedImage.uri,
  //           type: selectedImage.type || 'image/jpeg',
  //           fileName: selectedImage.fileName || 'image.jpg',
  //         });

  //         setImageUri(selectedImage.uri);
  //       }
  //     },
  //   );
  // };

  const handleImageSelect = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
        includeBase64: true,
      },
      response => {
        if (response.didCancel) {
          console.log('사용자가 이미지를 선택하지 않았습니다.');
        } else if (response.errorMessage) {
          console.log('이미지 선택 에러:', response.errorMessage);
        } else {
          if (response.assets && response.assets.length > 0) {
            const selectedImage = response.assets[0];
            console.log('선택된 이미지:', selectedImage);

            // 상위 컴포넌트의 상태 업데이트
            setProductImgApp(selectedImage);

            // 로컬 상태 업데이트
            setImageUri(selectedImage.uri);
          }
        }
      },
    );
  };

  // 천단위 콤마
  const formatNumber = value => {
    if (!value) return '0';
    return parseInt(value, 10).toLocaleString('ko-KR');
  };

  // 공급업체
  useEffect(() => {
    const fetchSupplierList = async () => {
      try {
        const supplierListResponse = await axios.get(
          `http://192.168.0.10:8181/productApp/getSupplierList`,
        );
        setSupplierItems(
          supplierListResponse.data.map(supplier => ({
            label: supplier.supplierName,
            value: supplier.supplierNo,
          })),
        );
      } catch (error) {
        console.log('공급업체 로드 오류: ', error);
        Alert.alert('Error', '공급업체 로드 실패');
      }
      // finally {
      //   setLoading(false);
      // }
    };
    fetchSupplierList();
  }, []);

  // 공급업체 관련 정보
  useEffect(() => {
    const fetchSupplierInfo = async () => {
      if (valueSupplier) {
        try {
          console.log('Fetching supplier info for supplierNo:', valueSupplier); // 로그 추가
          const supplierInfoResponse = await axios.get(
            `http://192.168.0.10:8181/productApp/getSupplierContent/${valueSupplier}`,
          );
          console.log('Supplier info response:', supplierInfoResponse.data); // 로그 추가
          setSupplierBusinessNo(supplierInfoResponse.data.supplierBusinessNo);
          setManagerName(supplierInfoResponse.data.managerName);
          setManagerPhone(supplierInfoResponse.data.managerPhone);
        } catch (error) {
          console.log('공급업체 정보 로드 실패: ', error);
          Alert.alert('Error', '공급업체 정보 로드 실패');
        }
      } else {
        setSupplierBusinessNo('');
        setManagerName('');
        setManagerPhone('');
      }
    };
    fetchSupplierInfo();
  }, [valueSupplier]);

  // 카테고리
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryResponse = await axios.get(
          `http://192.168.0.10:8181/productApp/getCategoryList`,
        );
        console.log('categoryResponse:', categoryResponse.data); // 로그 추가
        setCategoryItems(
          categoryResponse.data.map(category => ({
            label: category.categoryName,
            value: category.categoryNo,
          })),
        );
      } catch (error) {
        console.log('카테고리 오류:', error);
        Alert.alert('Error', '카테고리 로드 실패');
      }
      // finally {
      //   setLoading(false);
      // }
    };
    fetchCategories();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}
      keyboardVerticalOffset={Platform.OS === 'android' ? 100 : 0}>
      <View style={styles.block}>
        <Text style={styles.text}>공급업체명</Text>
        <DropDownPicker
          open={openSupplier}
          value={valueSupplier}
          items={supplierItems}
          setOpen={setOpenSupplier}
          setValue={handleSupplierChange}
          setItems={setSupplierItems}
          style={styles.dropdown}
          placeholder="공급업체를 선택하세요"
          dropDownContainerStyle={styles.dropdownContainer}
        />
        <Text style={styles.text}>사업자번호</Text>
        <TextInput
          style={[styles.input, styles.disable]}
          editable={false}
          value={supplierBusinessNo}
        />
        <Text style={styles.text}>담당자</Text>
        <TextInput
          style={[styles.input, styles.disable]}
          editable={false}
          value={managerName}
        />
        <Text style={styles.text}>담당자연락처</Text>
        <TextInput
          style={[styles.input, styles.disable]}
          editable={false}
          value={managerPhone}
        />
        <Text style={styles.text}>카테고리</Text>
        <DropDownPicker
          open={openCategory}
          value={valueCategory}
          items={categoryItems}
          setOpen={setOpenCategory}
          setValue={handleCategoryChange}
          setItems={setCategoryItems}
          style={styles.dropdown}
          placeholder="카테고리를 선택하세요"
          dropDownContainerStyle={styles.dropdownContainer}
        />
        <Text style={styles.text}>상품명</Text>
        <TextInput
          placeholder="상품을 입력해주세요"
          style={styles.input}
          value={valueProduct}
          onChangeText={handleProductNameChange}
        />
        <Text style={styles.text}>판매가격</Text>
        <TextInput
          placeholder="판매가격을 입력해주세요"
          style={styles.input}
          value={displayProductPrice}
          onChangeText={value => {
            console.log('판매가격:', value);
            handleInputChange('productPrice', value);
          }}
          keyboardType="number-pad"
        />
        <Text style={styles.text}>안전재고수량</Text>
        <TextInput
          placeholder="안전재고수량을 입력해주세요"
          style={styles.input}
          value={displaySafetyQuantity}
          onChangeText={value => {
            console.log('안전재고수량:', value);
            handleInputChange('safetyQuantity', value);
          }}
          keyboardType="number-pad"
        />
        <Text style={styles.text}>첨부파일</Text>
        <View style={styles.productFileBox}>
          <TextInput
            style={styles.productFileTextInput}
            value={imageUri ? imageUri.split('/').pop() : ''}
            placeholder="등록된 이미지가 없습니다."
            editable={false}
          />
          <TouchableOpacity
            style={styles.productFileButton}
            onPress={handleImageSelect}>
            <Icon name="upload" size={24} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    padding: 16,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ced4da',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
    overflow: Platform.select({android: 'hidden'}),
  },
  disable: {
    backgroundColor: '#f0f0f0',
    color: '#000',
    elevation: 0,
    shadowOpacity: 0,
    height: 40,
  },
  dropdown: {
    minHeight: 40,
    borderColor: '#ced4da',
    borderRadius: 4,
    marginBottom: 15,
  },
  dropdownContainer: {
    borderColor: '#ced4da',
  },
  productTitle: {
    fontSize: 16,
    marginTop: 10,
    marginLeft: 5,
    marginBottom: 10,
  },
  productFileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  productFileTextInput: {
    height: 40,
    width: 305,
    color: '#000000',
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  productFileButton: {
    minHeight: 40,
    backgroundColor: '#00569A',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  icon: {
    color: 'white',
  },

  // 테이블 화면
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e3e3e3',
    padding: 10,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#ced4da',
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableBody: {
    maxHeight: 150,
  },
  tableRow: {
    flexDirection: 'row',
    textAlign: 'center',
    height: 40,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ced4da',
  },
  selectedRow: {
    backgroundColor: '#f0f0f0',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
});

export default ProductWriteEditor;
