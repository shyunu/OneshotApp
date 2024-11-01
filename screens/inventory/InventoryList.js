import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import axios from 'axios';

function InventoryList() {
  const [purchaseList, setPurchaseList] = useState([]);

  const fetchPurchaseList = async => {
    // try {
    //   const
    // }
  };

  return (
    <ScrollView>
      <View style={styles.wrapper}>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>No.</Text>
            <Text style={styles.infoText}>2</Text>
            <Text style={styles.infoText}>공급업체명: </Text>
            <Text style={styles.infoText}>2</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>카테고리: </Text>
            <Text style={styles.infoText}></Text>
            <Text style={styles.infoText}>상품명- </Text>
            <Text style={styles.infoText}></Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>구매수량</Text>
            <Text style={styles.infoText}></Text>
            <Text style={styles.infoText}>구매단가</Text>
            <Text style={styles.infoText}></Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>총가격</Text>
            <Text style={styles.infoText}>담당자</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>No.</Text>
            <Text style={styles.infoText}>공급업체명</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>카테고리</Text>
            <Text style={styles.infoText}>상품명</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>구매수량</Text>
            <Text style={styles.infoText}>구매단가</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>총가격</Text>
            <Text style={styles.infoText}>담당자</Text>
          </View>
        </View>
      </View>
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
    marginHorizontal: 16,
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

export default InventoryList;
