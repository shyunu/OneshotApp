import React from 'react';
import {
  Text,
  StyleSheet,
  View,
} from 'react-native';
import SalesSearchFrame from './SalesSearchFrame';


function SalesList() {

  return (
    <View style={styles.wrapper}>
      <SalesSearchFrame />

      <View style={styles.infoContainer}>
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
      </View>
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
});

export default SalesList;
