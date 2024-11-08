import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Alert,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import ContractDetail from './ContractDetail';
import axios from 'axios';
import {useIsFocused} from '@react-navigation/native';

function ContractList({search}) {
  const isFocused = useIsFocused();
  const [contractPriceItems, setContractPriceItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [contractPriceNo, setContractPriceNo] = useState(0);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const url = search
        ? `http://172.30.1.28:8181/contractApp/getContractPriceList/${encodeURIComponent(
            search,
          )}`
        : 'http://172.30.1.28:8181/contractApp/getContractPriceList'; // search가 없을 경우 전체 조회 경로
      const response = await axios.get(url);
      const updatedItems = response.data.map((item, index) => ({
        ...item,
        contractSdate: convertToLocalDate(item.contractSdate),
        contractEdate: convertToLocalDate(item.contractEdate),
        key: index.toString(),
      }));
      setContractPriceItems(updatedItems);
    } catch (error) {
      console.error('데이터 가져오기 오류:', error);
      Alert.alert(
        '오류',
        '데이터를 가져오는 데 실패했습니다. 다시 시도해 주세요.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 서버의 UTC 날짜를 로컬 시간(KST)으로 변환
  const convertToLocalDate = utcDate => {
    const date = new Date(utcDate);
    const localDate = new Date(date.getTime() + 9 * 60 * 60 * 1000); // KST(UTC+9) 적용
    return localDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 반환
  };

  useEffect(() => {
    if (isFocused || search) {
      fetchData(); // 검색어가 변경될 때마다 데이터 가져오기
    }
  }, [isFocused, search]); // `isFocused`와 `search` 상태를 의존성으로 추가

  const formatCurrency = amount => {
    if (isNaN(amount) || amount === null) return '- 원';
    return `${parseInt(amount, 10)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 원`;
  };

  function startAddItem(contractPriceNo) {
    setContractPriceNo(contractPriceNo);
    setModalIsVisible(true);
  }

  function endAddItem() {
    setModalIsVisible(false);
  }

  return (
    <ScrollView>
      <View style={styles.wrapper}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : contractPriceItems && contractPriceItems.length > 0 ? (
          contractPriceItems.map(item => (
            <View
              key={item.key}
              style={styles.infoContainer}
              accessible={true}
              accessibilityLabel={`계약번호 ${item.contractPriceNo}, 고객사 ${item.clientName}, 상품 ${item.productName}`}>
              <View style={styles.infoRow}>
                <Text style={styles.infoShortText}>
                  No. {item.contractPriceNo}
                </Text>
                <TouchableOpacity
                  onPress={() => startAddItem(item.contractPriceNo)}
                  accessible={true}
                  accessibilityLabel={`계약서 보기 버튼. 계약번호 ${item.contractPriceNo}`}>
                  <Text style={styles.infoFileText}>계약서 보기</Text>
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
          <TouchableOpacity
            style={styles.infoContainer}
            accessible={true}
            accessibilityLabel="계약내역이 없습니다">
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
          contractPriceNo={contractPriceNo}
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
