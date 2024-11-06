import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import InventoryWriteHeader from './InventoryWriteHeader';
import InventoryWriteEditor from './InventoryWriteEditor';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

function InventoryWriteScreen() {
  const navigation = useNavigation();
  const [purchaseNo, setPurchaseNo] = useState(0);
  const [supplierNo, setSupplierNo] = useState(null);
  const [managerName, setManagerName] = useState('');
  const [managerPhone, setManagerPhone] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <SafeAreaView style={styles.block}>
      <InventoryWriteHeader
        purchaseNo={purchaseNo}
        setPurchaseNo={setPurchaseNo}
        supplierNo={supplierNo}
        setSupplierNo={setSupplierNo} // 상태 관리하는 supplierNo와 setSupplierNo 전달
        managerName={managerName}
        setManagerName={setManagerName}
        managerPhone={managerPhone}
        setManagerPhone={setManagerPhone}
        items={items}
        setItems={setItems}
        setLoading={setLoading}
        // addPurchaseItem={addPurchaseItem}
      />
      <InventoryWriteEditor
        supplierNo={supplierNo}
        setSupplierNo={setSupplierNo} // supplierNo 상태 전달
        items={items}
        setItems={setItems}
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
