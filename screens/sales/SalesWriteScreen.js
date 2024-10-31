import React, {useState} from 'react';
import {StyleSheet, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import SalesWriteEditor from './SalesWriteEditor';
import SalesWriteHeader from './SalesWriteHeader';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';

function SalesWriteScreen() {
  const [editorKey, setEditorKey] = useState(0);
  const navigation = useNavigation();

  //초기화
  function onResetFields() {
    setEditorKey(prevKey => prevKey + 1);
  }

  //등록데이터관리
  const [salesData, setSalesData] = useState({});
  const handleSaveData = data => {
    setSalesData(data);
  };

  //등록
  async function handleRegist() {
    if (Object.keys(salesData).length === 0) {
      Alert.alert('오류', '판매 등록 정보가 없습니다.');
      return;
    }
    console.log('전송할 데이터:', salesData);

    try {
      const response = await axios.post(
        'http://localhost:8181/salesApp/orderForm',
        salesData,
      );

      Alert.alert('\n', '판매가 정상 등록되었습니다!\n', [
        {
          text: '확인',
          onPress: () => navigation.navigate('MainTab', { 
            screen: '판매관리',
            params: { updatedData: salesData } // 등록된 데이터 전달
          }),
        },
      ]);
    } catch (error) {
      Alert.alert('등록실패!!!');
    }
  }

  return (
    <SafeAreaView style={styles.block}>
      <SalesWriteHeader onResetFields={onResetFields} onRegist={handleRegist} />
      <SalesWriteEditor key={editorKey} onSaveData={handleSaveData} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  block: {flex: 1, backgroundColor: 'white'},
});

export default SalesWriteScreen;
