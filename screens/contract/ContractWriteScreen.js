import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import ContractWriteEditor from './ContractWriteEditor';
import ContractWriteHeader from './ContractWriteHeader';

function ContractWriteScreen() {
  const [clientNo, setClientNo] = useState(0);
  const [productNo, setProductNo] = useState(0);
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [contractPrice, setContractPrice] = useState(0);
  const [contractItems, setContractItems] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <SafeAreaView style={styles.block}>
      <ContractWriteHeader
        clientNo={clientNo}
        setClientNo={setClientNo}
        productNo={productNo}
        setProductNo={setProductNo}
        selectedStartDate={selectedStartDate}
        setSelectedStartDate={setSelectedStartDate}
        selectedEndDate={selectedEndDate}
        setSelectedEndDate={setSelectedEndDate}
        contractPrice={contractPrice}
        setContractPrice={setContractPrice}
        contractItems={contractItems}
        setContractItems={setContractItems}
        loading={loading}
        setLoading={setLoading}
      />
      <ContractWriteEditor
        clientNo={clientNo}
        setClientNo={setClientNo}
        productNo={productNo}
        setProductNo={setProductNo}
        selectedStartDate={selectedStartDate}
        setSelectedStartDate={setSelectedStartDate}
        selectedEndDate={selectedEndDate}
        setSelectedEndDate={setSelectedEndDate}
        contractPrice={contractPrice}
        setContractPrice={setContractPrice}
        contractItems={contractItems}
        setContractItems={setContractItems}
        loading={loading}
        setLoading={setLoading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  block: {flex: 1, backgroundColor: 'white'},
});

export default ContractWriteScreen;
