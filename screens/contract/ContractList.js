import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import ContractDetail from './ContractDetail';

import axios from 'axios';

function ContractList() {
  const [contractPriceItems, setContractPriceItems] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'http://172.30.1.28:8181/contractApp/getContractPriceList',
      );
      const updatedItems = response.data.map(item => ({
        ...item,
        contractSdate: convertToLocalDate(item.contractSdate),
        contractEdate: convertToLocalDate(item.contractEdate),
      }));
      setContractPriceItems(updatedItems);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', '데이터를 가져오는 데 실패했습니다.');
    } finally {
    }
  };

  // 서버의 UTC 날짜를 로컬 시간(KST)으로 변환
  const convertToLocalDate = utcDate => {
    const date = new Date(utcDate); // 서버로부터 받은 UTC 날짜
    const localDate = new Date(date.getTime() + 9 * 60 * 60 * 1000); // KST(UTC+9) 적용
    return localDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 반환
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = amount => {
    if (isNaN(amount) || amount === null) return '- 원';
    return `${parseInt(amount, 10)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 원`;
  };

  const [modalIsVisible, setModalIsVisible] = useState(false);

  function startAddItem() {
    setModalIsVisible(true);
  }

  function endAddItem() {
    setModalIsVisible(false);
  }

  return (
    <ScrollView>
      <View style={styles.wrapper}>
        {contractPriceItems && contractPriceItems.length > 0 ? (
          contractPriceItems.map(item => (
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Text style={styles.infoShortText}>
                  No. {item.contractPriceNo}
                </Text>
                <TouchableOpacity onPress={startAddItem}>
                  <Text style={styles.infoFileText}>게약서 보기</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoShortText}>고객사</Text>
                <Text style={styles.infoLongText}>{item.clientName}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoShortText}>상품</Text>
                <Text style={styles.infoLongText}>{item.productName}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoShortText}>계약가격</Text>
                <Text style={styles.infoShortText}>
                  {formatCurrency(item.contractPrice)}
                </Text>
                <Text style={styles.infoShortText}>활성화</Text>
                <Text style={styles.infoShortText}>비활성화</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoShortText}>계약시작일</Text>
                <Text style={styles.infoShortText}>{item.contractSdate}</Text>
                <Text style={styles.infoShortText}>계약종료일</Text>
                <Text style={styles.infoShortText}>{item.contractEdate}</Text>
              </View>
            </View>
          ))
        ) : (
          <TouchableOpacity style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>계약내역이 없습니다</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {modalIsVisible && (
        <ContractDetail
          isVisible={modalIsVisible}
          onClose={endAddItem}
          style={styles.modalContainer}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginTop: 10,
  },
  infoContainer: {
    borderColor: '#e3e3e3',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginTop: 10,
    bottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    //justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e3',
  },
  infoShortText: {
    fontSize: 13,
    color: '#333',
    flex: 1,
    textAlign: 'left',
  },
  infoFileText: {
    fontSize: 13,
    color: '#333',
    flex: 1,
    textAlign: 'left',
    textDecorationLine: 'underline',
  },
  infoLongText: {
    fontSize: 13,
    color: '#333',
    textAlign: 'left',
    width: 255,
  },
});

export default ContractList;
