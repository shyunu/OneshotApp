import {useNavigation} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import SalesItem from './SalesItem';

function SalesWriteEditor({client, onChangeClient}) {
  const nextInputRef = useRef(); // 다음 필드 참조
  const [disable, setDisabled] = useState(false); //textinput disabled처리

  // 고객사
  const [valueClient, setValueClient] = useState(null);
  const [openClient, setOpenClient] = useState(false);
  const [clients, setClients] = useState([
    {label: '고객사1', value: 'client1'},
    {label: '고객사2', value: 'client2'},
    {label: '고객사3', value: 'client3'},
    {label: '고객사4', value: 'client4'},
  ]);

  // 상품
  const [valueProduct, setValueProduct] = useState(null);
  const [openProduct, setOpenProduct] = useState(false);
  // const [products, setProducts] = useState([
  //   {label: '상품1', value: 'product1'},
  //   {label: '상품2', value: 'product2'},
  //   {label: '상품3', value: 'product3'},
  //   {label: '상품4', value: 'product4'},
  // ]);
  const [products, setProducts] = useState([
    {id: 1, text: 'product1', contractPrice: 1000, num: 1, total: 1000},
    {id: 1, text: 'product2', contractPrice: 1000, num: 2, total: 2000},
    {id: 1, text: 'product3', contractPrice: 1000, num: 1, total: 1000},
    {id: 1, text: 'product4', contractPrice: 1000, num: 2, total: 2000},
  ]);

  const onInsert = text => {
    const nextId =
      products.length > 0
        ? Math.max(...products.map(products => products.id)) + 1
        : 1;
    const products = {
      id: nextId,
      text,
      contractPrice,
      num,
      total,
    };
  };

  const navigation = useNavigation();
  const onPressAddBtn = () => {
    navigation.navigate('SalesItem');
  }

  return (
    <View style={styles.block}>
      <Text style={styles.text}>등록일자</Text>
      <TextInput
        editable={disable}
        style={[styles.input, styles.inputDisabled]}
      />

      <Text style={styles.text}>고객사</Text>
      <DropDownPicker
        open={openClient}
        value={valueClient}
        items={clients}
        setOpen={setOpenClient}
        setValue={setValueClient}
        setItems={setClients}
        placeholder="고객사를 선택하세요"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
      />

      <Text style={styles.text}>사업자번호</Text>
      <TextInput
        editable={disable}
        style={[styles.input, styles.inputDisabled]}
      />

      <Text style={styles.text}>담당자</Text>
      <TextInput
        editable={disable}
        style={[styles.input, styles.inputDisabled]}
      />

      <Text style={styles.text}>담당자 연락처</Text>
      <TextInput
        editable={disable}
        style={[styles.input, styles.inputDisabled]}
      />

      {/* <Text style={styles.text}>상품명</Text> */}
      {/* <DropDownPicker
        open={openProduct}
        value={valueProduct}
        items={products}
        setOpen={setOpenProduct}
        setValue={setValueProduct}
        setItems={setProducts}
        placeholder="상품을 선택하세요"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
      /> */}

      <View style={styles.buttonContainer}>
        <Text style={{fontSize: 16, marginTop: 6, marginLeft: 5}}>
          판매 상품
        </Text>
        <TouchableOpacity activeOpacity={0.5}>
          <View style={styles.buttonStyle} onInsert={onInsert} onPress={onPressAddBtn} >
            <Image source={require('../../assets/add_white.png')} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',
  },
  text: {
    marginBottom: 10,
  },
  input: {
    height: 40, // 고정된 높이
    borderColor: '#ced4da', // 연한 회색 테두리 (HTML input과 유사)
    borderWidth: 1,
    borderRadius: 4, // 모서리 곡선 처리
    paddingHorizontal: 10, // 좌우 여백
    marginBottom: 12, // 입력 필드 간 간격
    backgroundColor: '#fff', // 흰색 배경
    fontSize: 16, // 적당한 글씨 크기
    color: '#495057', // 텍스트 색상
    shadowColor: '#000', // 그림자 색상
    shadowOffset: {width: 0, height: 1}, // 그림자 위치
    shadowOpacity: 0.1, // 그림자 투명도
    shadowRadius: 1, // 그림자 반경
    elevation: 2, // Android 그림자 (elevation 사용)
  },
  inputDisabled: {
    backgroundColor: '#f0f0f0',
  },
  dropdown: {
    borderColor: '#ced4da',
    borderRadius: 4,
    marginBottom: 10,
  },
  dropdownContainer: {
    borderColor: '#ced4da',
  },
  buttonContainer: {
    flexDirection: 'row', // Row 방향으로 정렬
    justifyContent: 'space-between', // 오른쪽 정렬
    borderBottomColor: '#e3e3e3',
    borderBottomWidth: 1,
  },
  buttonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    backgroundColor: '#e3e3e3',
    borderRadius: 10,
  },
});

export default SalesWriteEditor;
