import React, {useState} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import SalesSearchFrame from './SalesSearchFrame';
import SalesDetail from './SalesDetail';

function SalesList() {
  // 모달 상태 관리
  const [modalIsVisible, setModalIsVisible] = useState(false);

  function startAddItem() {
    setModalIsVisible(true);
  }

  function endAddItem() {
    setModalIsVisible(false);
  }


  return (
    <View style={styles.wrapper}>
      <SalesSearchFrame />

      {/* infoContainer를 TouchableOpacity로 감싸기 */}
      <TouchableOpacity style={styles.infoContainer} onPress={startAddItem}>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>No.</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>판매등록일자</Text>
          <Text style={styles.infoText}>판매담당자명</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>고객사명</Text>
          <Text style={styles.infoText}>총거래가</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>상품리스트</Text>
        </View>
      </TouchableOpacity>

      {/* SalesDetail 모달 - modalIsVisible에 따라 표시 */}
      {modalIsVisible && (
        <SalesDetail
          isVisible={modalIsVisible}
          onClose={endAddItem}
          style={styles.modalContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginTop: 40,
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
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e3',
  },
  infoText: {
    fontSize: 13,
    color: '#333',
    flex: 1,
    textAlign: 'left',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
});

export default SalesList;
