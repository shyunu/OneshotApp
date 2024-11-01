import React, {useState, useCallback} from 'react';
import {StyleSheet, View, KeyboardAvoidingView, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import InventoryWriteHeader from './InventoryWriteHeader';
import InventoryWriteEditor from './InventoryWriteEditor';

function InventoryWriteScreen() {
  const [purchaseNo, setPurchaseNo] = useState(0);
  const [supplierNo, setSupplierNo] = useState(0);
  const [managerName, setManagerName] = useState('');
  const [managerPhone, setManagerPhone] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [employeeNo, setEmployeeNo] = useState(0); // 임시로 1을 기본값으로 설정

  const addItem = useCallback(newItem => {
    setItems(currentItems => [...currentItems, newItem]);
  }, []);

  const handleReset = useCallback(() => {
    Alert.alert('경고', '정말로 초기화하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {
        text: '확인',
        onPress: () => {
          setSupplierNo(null);
          setManagerName('');
          setManagerPhone('');
          setItems([]);
          Alert.alert('초기화 완료', '모든 항목이 초기화되었습니다');
        },
      },
    ]);
  }, []);

  return (
    <SafeAreaView style={styles.block}>
      <InventoryWriteHeader
        purchaseNo={purchaseNo}
        setPurchaseNo={setPurchaseNo}
        supplierNo={supplierNo}
        setSupplierNo={setSupplierNo}
        managerName={managerName}
        setManagerName={setManagerName}
        items={items}
        setItems={setItems}
        loading={loading}
        setLoading={setLoading}
        onReset={handleReset}
      />
      <InventoryWriteEditor
        items={items}
        // setItems={setItems}
        addItem={addItem}
        supplierNo={supplierNo}
        setSupplierNo={setSupplierNo}
        purchaseNo={purchaseNo}
        setPurchaseNo={setPurchaseNo}
        managerName={managerName}
        setManagerName={setManagerName}
        loading={loading}
        setLoading={setLoading}
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

export default InventoryWriteScreen;
